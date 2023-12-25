import type { MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import type {
  AlipayErrorResponse,
  AlipayScope,
  AlipaySignType,
  AlipayTokenResponse,
  AlipayUser
} from './types';

/**
 * 格式化时间
 * @param {string} inputPattern 时间格式,默认为'yyyy-MM-dd hh:mm:ss'
 * @param {any} inputDate 输入时间,默认为当前
 * @return {string} 格式化的时间
 */
const formatDate = (
  inputPattern: string = 'yyyy-MM-dd hh:mm:ss',
  inputDate: any = undefined
) => {
  const date =
    new Date(inputDate).toString() === 'Invalid Date'
      ? new Date()
      : new Date(inputDate);
  let pattern = inputPattern;
  const y = date.getFullYear().toString();
  const o = {
    M: date.getMonth() + 1, // month
    d: date.getDate(), // day
    h: date.getHours(), // hour
    m: date.getMinutes(), // minute
    s: date.getSeconds() // second
  };
  pattern = pattern.replace(/(y+)/gi, (a, b) =>
    y.substr(4 - Math.min(4, b.length))
  );
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  for (const i in o) {
    // @ts-ignore
    pattern = pattern.replace(new RegExp(`(${i}+)`, 'g'), (a, b) =>
      // @ts-ignore
      o[i] < 10 && b.length > 1 ? `0${o[i]}` : o[i]
    );
  }
  return pattern;
};

/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function alipayAuth(opts: {
  app_id?: string;
  private_key?: string;
  redirect_uri?: string;
  sign_type?: AlipaySignType;
  scope?: AlipayScope;
}): MiddlewareHandler {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error(
      '`crypto.subtle.importKey` is undefined. Alipay auth middleware requires it.'
    );
  }

  return async (c, next) => {
    console.log(c.req.url);
    const { ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_CALLBACK_URL } = env<{
      ALIPAY_APP_ID: string;
      ALIPAY_PRIVATE_KEY: string;
      ALIPAY_CALLBACK_URL: string;
    }>(c);

    const options = {
      app_id: ALIPAY_APP_ID,
      private_key: ALIPAY_PRIVATE_KEY,
      redirect_uri: ALIPAY_CALLBACK_URL,
      scope: 'auth_user',
      sign_type: 'RSA2' as AlipaySignType,
      ...opts
    };

    // Avoid CSRF attack by checking state
    const queryKeys = Object.keys(c.req.queries());
    // skip check: [],['returnTo']
    if (
      queryKeys.length > 1 ||
      (queryKeys.length === 1 && !queryKeys.includes('returnTo'))
    ) {
      const storedState = getCookie(c, 'state');
      if (c.req.query('state') !== storedState) {
        throw new HTTPException(401);
      }
    }

    const returnTo = c.req.query('returnTo');
    if (returnTo) {
      setCookie(c, 'returnTo', returnTo, {
        maxAge: 60 * 10,
        httpOnly: true,
        path: '/'
        // secure: true,
      });
    }

    const code = c.req.query('auth_code');
    // Redirect to login dialog
    if (!code) {
      const state: string =
        crypto?.randomUUID() || Math.random().toString().substring(2);
      setCookie(c, 'state', state, {
        maxAge: 60 * 10,
        httpOnly: true,
        path: '/'
        // secure: true,
      });

      const url = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?${new URLSearchParams(
        {
          app_id: options.app_id,
          state,
          scope: options.scope,
          redirect_uri: options.redirect_uri
        }
      ).toString()}`;
      return c.redirect(url);
    }

    async function signFn(params: URLSearchParams) {
      const signParams = Object.fromEntries(params.entries());
      // 排序
      const signStr = Object.keys(signParams)
        .sort()
        .map((key) => {
          return `${key}=${signParams[key]}`;
        })
        .join('&');

      // 计算签名
      const encoder = new TextEncoder();
      const data = encoder.encode(signStr);
      // base64 decode the string to get the binary data
      const binaryDerString = atob(options.private_key);
      // convert from a binary string to an ArrayBuffer
      const binaryDer = str2ab(binaryDerString);
      const key = await crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: {
            name: options.sign_type === 'RSA2' ? 'SHA-256' : 'SHA-1'
          }
        },
        false, // whether the key is extractable (i.e. can be used in exportKey)
        ['sign'] // can be any combination of 'sign' and 'verify'
      );

      const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        data
      );
      const sign = btoa(
        // @ts-ignore
        String.fromCharCode.apply(null, new Uint8Array(signature))
      );
      return sign;
    }

    async function getTokenFromCode(code: string) {
      const params = new URLSearchParams();
      params.set('app_id', options.app_id);
      params.set('method', 'alipay.system.oauth.token');
      params.set('charset', 'utf-8');
      params.set('sign_type', options.sign_type);
      params.set('timestamp', formatDate());
      params.set('version', '1.0');
      params.set('grant_type', 'authorization_code');
      params.set('code', code);
      const sign = await signFn(params);
      params.set('sign', sign);
      const url = new URL('https://openapi.alipay.com/gateway.do');
      url.search = params.toString();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': '@hono-dev/auth-alipay'
        }
      });
      const data = (await response.json()) as {
        alipay_system_oauth_token_response: AlipayTokenResponse;
        error_response?: AlipayErrorResponse;
      };
      if ('error_response' in data)
        throw new HTTPException(400, { message: data.error_response?.sub_msg });

      const result = data.alipay_system_oauth_token_response;
      return result;
    }

    async function getUserData(accessToken: string) {
      const params = new URLSearchParams();
      params.set('app_id', options.app_id);
      params.set('method', 'alipay.user.info.share');
      params.set('charset', 'utf-8');
      params.set('sign_type', options.sign_type);
      params.set('timestamp', formatDate());
      params.set('version', '1.0');
      params.set('auth_token', accessToken);
      const sign = await signFn(params);
      params.set('sign', sign);
      const url = new URL('https://openapi.alipay.com/gateway.do');
      url.search = params.toString();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': '@hono-dev/auth-alipay'
        }
      });
      const data = (await response.json()) as {
        alipay_user_info_share_response: AlipayUser;
        error_response?: AlipayErrorResponse;
      };
      if ('error_response' in data)
        throw new HTTPException(400, { message: data.error_response?.sub_msg });

      const result = data.alipay_user_info_share_response;
      return {
        user_id: result.user_id,
        nick_name: result.nick_name,
        avatar: result.avatar
      } as AlipayUser;
    }

    // Retrieve user data from alipay
    const token = await getTokenFromCode(code);
    const user = await getUserData(token.access_token);
    // Set return info
    c.set('alipay-token', token);
    c.set('alipay-user', user);

    await next();
  };
}
