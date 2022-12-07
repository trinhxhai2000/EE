import { writable } from 'svelte/store';

const FLASH_TIME_OUT = 2000;

export const errorFlash = writable<string>("");
export const successFlash = writable<string>("");
export const warnFlash = writable<string>("");

// todo: [check the case there are more than one flash are displayed]
function createFlashModalStore() {

    let errorFlashTimeout: NodeJS.Timeout | null = null;
    let successFlashTimeout: NodeJS.Timeout | null = null;
    return {
        showErrorFlash(text: string) {
            errorFlash.set(text);
            if (errorFlashTimeout) {
                clearTimeout(errorFlashTimeout);
            }
            errorFlashTimeout = setTimeout(
                () => {
                    errorFlash.set("");
                },
                FLASH_TIME_OUT
            )
        },

        showSuccessFlash(text: string) {
            successFlash.set(text);
            if (successFlashTimeout) {
                clearTimeout(successFlashTimeout);
            }
            successFlashTimeout = setTimeout(
                () => {
                    successFlash.set("");
                },
                FLASH_TIME_OUT
            )
        }
    }
}

export const flashStore = createFlashModalStore();