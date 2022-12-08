import { get, writable } from "svelte/store";

type YesCallBack = Function | undefined;
type NoCallBack = Function | undefined;
type BtnCallBack = Function | undefined;

export interface UserSession {
    username: string,
}

export const userSession = writable<UserSession | null>(null);


function createUserSessionStore() {
    let btnCallBack: BtnCallBack;
    let currentUser: string | null = null;

    return {
        login(username: string) {
            // const preData = get(userSession);
            // preData.username = "";
            userSession.set({ username });
        },
        logout(username: string, callback: BtnCallBack) {
            userSession.set(null);
        },

    };
}

export const userSessionStore = createUserSessionStore();
