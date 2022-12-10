import { get, writable } from "svelte/store";
import { USER_ROLE } from "../interface/api/UserInterfaces";

type YesCallBack = Function | undefined;
type NoCallBack = Function | undefined;
type BtnCallBack = Function | undefined;

export interface UserSession {
    username: string,
    role: USER_ROLE
}

export const userSession = writable<UserSession | null>(null);


function createUserSessionStore() {
    let btnCallBack: BtnCallBack;
    let currentUser: string | null = null;

    return {
        login(username: string, role: USER_ROLE) {
            // const preData = get(userSession);
            // preData.username = "";
            userSession.set({ username, role });
        },
        logout(callback: BtnCallBack = undefined) {
            userSession.set(null);
        },

    };
}

export const userSessionStore = createUserSessionStore();
