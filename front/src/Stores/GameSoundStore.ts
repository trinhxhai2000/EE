import { get, writable } from "svelte/store";

export interface GameSoundVolume {
    muted: boolean;
    volume: number;
}

function createGameSoundVolume() {
    const { subscribe, update } = writable<GameSoundVolume>({
        volume: 1,
        muted: false,
    });
    return {
        subscribe,
        setMuted: (newMute: boolean): void => {
            update((gameSoundVolume: GameSoundVolume) => {
                gameSoundVolume.muted = newMute;
                return gameSoundVolume;
            });
        },
        setVolume: (newVolume: number): void => {
            update((gameSoundVolume: GameSoundVolume) => {
                gameSoundVolume.volume = newVolume;
                return gameSoundVolume;
            });
        },
    };
}
export const gameSoundStore = createGameSoundVolume();
