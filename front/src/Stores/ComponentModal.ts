import { writable } from "svelte/store";

export enum ComponentModalType {
    ADD_QUESTION,
    EDIT_QUESTION,
}

export const currentComponentModalStore = writable<ComponentModalType | null>(
    null,
    // ComponentModalType.PREVIEW_MAP_TYPE
);


function createComponentModalStore() {
    let _onCloseCallback: Function | undefined;
    let _data: any | undefined;
    return {
        showComponentModal(componentType: ComponentModalType, onClose?: Function | undefined, data?: any) {
            _data = data;
            currentComponentModalStore.set(componentType);
            _onCloseCallback = onClose;
        },
        getData(): any {
            return _data;
        },
        closeComponentModal(reload = false) {
            if (_onCloseCallback && reload) {
                _onCloseCallback();
            }
            currentComponentModalStore.set(null);
        }
    }
}

export const componentModalStore = createComponentModalStore();
