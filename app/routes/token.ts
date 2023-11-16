import { type LoaderFunction, type ActionFunction, json } from '@remix-run/cloudflare';

export const action: ActionFunction = async () => {};

export const loader: LoaderFunction = async () => {
  return json({
    code: 404
  });
};
