import {create} from "zustand";
import {ReactNode} from "react";

export type ModalType =
    | 'clientModal'
    | 'confirmAction'
    | 'orderModal'
    | 'employeeModal'
    | 'payoutsModal';

interface ModalItem {
    id: string;
    type: ModalType;
    props?: any;
}

export interface ModalState {
    modals: ModalItem[];

    openModal: (type: ModalType, props?: any) => string;
    closeModal: (id?: string) => void;

    openConfirm: (text: string | ReactNode) => Promise<boolean>;
    closeConfirm: (id: string, result?: boolean) => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
    modals: [],

    openModal: (type, props = {}) => {
        const id = crypto.randomUUID();

        set(state => ({
            modals: [...state.modals, {id, type, props}]
        }));

        return id;
    },

    closeModal: (id) => {
        console.log(id);
        set(state => ({
            modals: id
                ? state.modals.filter(m => m.id !== id)
                : state.modals.slice(0, -1)
        }));
    },

    openConfirm: (text) => {
        return new Promise<boolean>((resolve) => {
            const id = crypto.randomUUID();

            set(state => ({
                modals: [
                    ...state.modals,
                    {
                        id,
                        type: 'confirmAction',
                        props: {text, resolve}
                    }
                ]
            }));
        });
    },

    closeConfirm: (id, result = false) => {
        const modal = get().modals.find(m => m.id === id);
        modal?.props?.resolve?.(result);

        set(state => ({
            modals: state.modals.filter(m => m.id !== id)
        }));
    }
}));
