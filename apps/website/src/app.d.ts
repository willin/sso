/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import type { App as OauthApp } from '$lib/hono/services/app';
import type { ThirdUser, User } from '$lib/hono/services/user';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: User & { thirdparty: ThirdUser[] };
    }
    interface PageData {
      user: User & { thirdparty: ThirdUser[] };
      apps: OauthApp[];
      app: OauthApp;
    }
    // interface PageState {}
    interface Platform {
      env: {
        DB: D1Database;
        CACHE: KVNamespace;
        AFDIAN_CLIENT_ID: string;
        AFDIAN_CLIENT_SECRET: string;
        AFDIAN_CALLBACK_URL?: string;
        ALIPAY_APP_ID: string;
        ALIPAY_PRIVATE_KEY: string;
        ALIPAY_CALLBACK_URL: string;
        GITHUB_ID: string;
        GITHUB_SECRET: string;
        GITHUB_CALLBACK_URL?: string;
      };
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
