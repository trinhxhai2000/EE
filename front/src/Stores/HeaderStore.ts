import { get, writable } from "svelte/store";

type YesCallBack = Function | undefined;
type NoCallBack = Function | undefined;
type BtnCallBack = Function | undefined;


export interface HeaderData {
    title: string,
}

export const headerData = writable<HeaderData>({
    title: "Title",
});


function createInfoModalStore() {
    let btnCallBack: BtnCallBack;
    let currentUser: string | null = null;

    return {
        setHeaderTitle(tle: string, callback: BtnCallBack) {
            const preData = get(headerData);
            preData.title = tle;
            headerData.set(preData);
        },
    };
}

export const headerDataStore = createInfoModalStore();
