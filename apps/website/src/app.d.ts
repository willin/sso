/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import type { App as Apps, User } from '$lib/types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: User;
    }
    interface PageData {
      user: User;
      apps: Apps[];
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
