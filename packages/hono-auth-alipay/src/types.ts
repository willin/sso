export type AlipayScope = 'auth_user';
export type AlipaySignType = 'RSA2' | 'RSA';

export type AlipayUser = {
  user_id: string;
  nick_name: string;
  avatar: string;
};

export type AlipayErrorResponse = {
  code: string;
  msg: string;
  sub_msg: string;
  sub_code: string;
};

export type AlipayTokenResponse = {
  access_token: string;
  alipay_user_id: string;
  auth_start: string; // '2023-12-25 20:00:00'
  expires_in: number;
  re_expires_in: number;
  refresh_token: string;
  user_id: string;
};
