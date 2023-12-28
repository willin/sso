/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import type { App as Apps, User, ThirdUser } from '$lib/types';

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
      apps: Apps[];
      app: Apps;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
