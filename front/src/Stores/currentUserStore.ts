import { writable } from "svelte/store";
interface UserStore {
    id: number,
    username: string,
}
export const currentUser = writable<UserStore | null>(null);
