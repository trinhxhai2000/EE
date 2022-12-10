import { writable } from "svelte/store";
export enum ADMIN_PAGES {
    USER = "user-page",
    QUESTION = "question-page"
}
export const currentAdminPage = writable<ADMIN_PAGES | null>(null);
