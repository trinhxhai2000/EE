import { writable } from "svelte/store";
export enum LIST_GAME {
    CLOUD_SHOOT
}
export const currentGameStore = writable<LIST_GAME | null>(null);
