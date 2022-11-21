import { writable } from "svelte/store";
export const loginVisibilityStore = writable(true);
export const registerVisibilityStore = writable(false);
export const adminPageVisibilityStore = writable(false);
