import {create} from 'zustand';

interface ModalState {
    modal: null | 'clientModal' | 'confirmAction';
    modalProps?: any;
    openModal: (modal: ModalState['modal'], props?: any) => void;
    closeModal: () => void;
    openConfirm: (text: string) => Promise<boolean>;
    closeConfirm: () => void;

}

export const useModalStore = create<ModalState>((set, get) => ({
    modal: null,
    modalProps: {},
    openModal: (modal, props = {}) => set({modal, modalProps: props}),
    closeModal: () => set({modal: null, modalProps: {}}),
    openConfirm: (text) => {
        return new Promise<boolean>((resolve) => {
            set({
                modal: 'confirmAction',
                modalProps: {text, resolve},
            });
        });
    },
    closeConfirm: () => {
        const resolve = get().modalProps.resolve;
        if (resolve) resolve(false);
        set({
            modal: null,
            modalProps: {}
        });
    }
}));
