import { v4 as uuidv4 } from "uuid";

const gameQualityKey = "gameQuality";
const audioPlayerVolumeKey = "audioVolume";
const audioPlayerMuteKey = "audioMute";
const gameSoundMuteKey = "gameSoundMute";
const gameResolutionKey = "gameResolution";
const gameSoundVolumeKey = "gameSoundVolume";

const authToken = "authToken";
const userProperties = "user-properties";

export interface LocalUser {
    username: string
}
class LocalUserStore {
    saveUser(localUser: LocalUser) {
        localStorage.setItem("localUser", JSON.stringify(localUser));
    }
    getLocalUser(): LocalUser | null {
        const data = localStorage.getItem("localUser");
        return data ? JSON.parse(data) : null;
    }

    setGameQualityValue(value: number): void {
        localStorage.setItem(gameQualityKey, "" + value);
    }
    getGameQualityValue(): number {
        return parseInt(localStorage.getItem(gameQualityKey) || "60");
    }

    setAudioPlayerVolume(value: number): void {
        localStorage.setItem(audioPlayerVolumeKey, "" + value);
    }
    getAudioPlayerVolume(): number {
        return parseFloat(localStorage.getItem(audioPlayerVolumeKey) || "1");
    }

    setAudioPlayerMuted(value: boolean): void {
        localStorage.setItem(audioPlayerMuteKey, value.toString());
    }
    getAudioPlayerMuted(): boolean {
        return localStorage.getItem(audioPlayerMuteKey) === "true";
    }

    setGameSoundVolume(value: number): void {
        localStorage.setItem(gameSoundVolumeKey, "" + value);
    }
    getGameSoundVolume(): number {
        return parseFloat(localStorage.getItem(gameSoundVolumeKey) || "1");
    }

    setGameSoundMuted(value: boolean): void {
        localStorage.setItem(gameSoundMuteKey, value.toString());
    }
    getGameSoundMuted(): boolean {
        return localStorage.getItem(gameSoundMuteKey) === "true";
    }

    setGameResolution(value: string): void {
        localStorage.setItem(gameResolutionKey, value.toString());
    }
    getGameResolution(): string {
        return localStorage.getItem(gameResolutionKey) || "";
    }

    setAuthToken(value: string | null) {
        value ? localStorage.setItem(authToken, value) : localStorage.removeItem(authToken);
    }
    getAuthToken(): string | null {
        return localStorage.getItem(authToken);
    }

    getAllUserProperties(): Map<string, unknown> {
        const result = new Map<string, string>();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                if (key.startsWith(userProperties + "_")) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        const userKey = key.substr((userProperties + "_").length);
                        result.set(userKey, JSON.parse(value));
                    }
                }
            }
        }
        return result;
    }

    setUserProperty(name: string, value: unknown): void {
        localStorage.setItem(userProperties + "_" + name, JSON.stringify(value));
    }
}

export const localUserStore = new LocalUserStore();
