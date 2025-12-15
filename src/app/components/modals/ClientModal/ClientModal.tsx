import {Modal} from "@/app/components/ui/Modal/Modal";
import styles from "./сlientModal.module.scss";
import {ClientForm} from "@/app/components/forms/ClientForm/ClientForm";
import {useModalStore} from "@/store/modalStore";
import {IClient} from "@/types/client";
import {useClientsMutations} from "@/hooks/clients/useClientsMutations";

export const ClientModal = () => {
    const closeModal = useModalStore(state => state.closeModal)
    const client = useModalStore(state => state.modalProps)
    const {createClient, updateClient} = useClientsMutations();

    const submitHandler = async (data: IClient) => {
        try {
            if (client?.id) {
                await updateClient.mutateAsync({...data, id: client.id});
            } else {
                await createClient.mutateAsync(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeModal()
        }
    };

    return (<Modal headerText={client?.id ? client.name : 'Новий клієнт'} className={styles.modal}>
        <ClientForm
            onSubmit={submitHandler}
            onClose={closeModal}
            client={client}
            loading={createClient.isPending || updateClient.isPending}
        />
    </Modal>)
}