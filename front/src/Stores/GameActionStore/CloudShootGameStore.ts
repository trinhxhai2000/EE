import { writable } from "svelte/store";
export interface GameQuestion {
    title: string,
    desc: string,
}

export interface CountDownData {
    duration: number,
    startTime: number,
}

export const currentQuestion = writable<GameQuestion | null>(null);
export const currentScore = writable<number | null>(null);
export const currentCountDown = writable<CountDownData | null>(null);
export const isStartGame = writable<boolean | null>(null);
