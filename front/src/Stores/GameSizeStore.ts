import { get, writable } from "svelte/store";

export interface GameSize {
    width: number;
    height: number;
}

export const gameSizeStore = writable<GameSize>({
    width: window.innerWidth,
    height: window.innerHeight,
});
