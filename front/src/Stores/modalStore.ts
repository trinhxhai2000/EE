import { get, writable } from "svelte/store";

type YesCallBack = Function | undefined;
type NoCallBack = Function | undefined;
type BtnCallBack = Function | undefined;

export const showConfirmModal = writable<boolean>(false);
export const showInfoModal = writable<boolean>(false);

function createConfirmModalStore() {
    let yesCallBack: YesCallBack;
    let noCallBack: NoCallBack;
    let title: string;

    return {
        showConfirmModal(
            tle: string,
            yCallBack: YesCallBack,
            nCallBack: NoCallBack
        ) {
            yesCallBack = yCallBack;
            noCallBack = nCallBack;
            title = tle;
            showConfirmModal.set(true);
        },
        getTitle(): string {
            return title;
        },
        yesConfirm(): void {
            if (yesCallBack) yesCallBack();
            showConfirmModal.set(false);
        },
        noConfirm(): void {
            if (noCallBack) noCallBack();
            showConfirmModal.set(false);
        },
        closeConfirmModal(): void {
            showConfirmModal.set(false);
        },
        isShowing(): boolean {
            return get(showConfirmModal);
        },
    };
}

function createInfoModalStore() {
    let btnCallBack: BtnCallBack;
    let title: string;

    return {
        showInfoModal(tle: string, callback: BtnCallBack) {
            btnCallBack = callback;
            title = tle;
            showInfoModal.set(true);
        },
        getTitle(): string {
            return title;
        },
        confirm(): void {
            if (btnCallBack) btnCallBack();
            showInfoModal.set(false);
        },
        closeInfoModal(): void {
            showInfoModal.set(false);
        },
        isShowing(): boolean {
            return get(showInfoModal);
        },
    };
}

export const confirmModalStore = createConfirmModalStore();

export const waitingModalStore = writable("");

export const infoModalStore = createInfoModalStore();
