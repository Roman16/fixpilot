import styles from "./orderModal.module.scss";
import {Modal} from "@/app/components/ui/Modal/Modal";
import {OrderForm} from "@/app/components/forms/OrderForm/OrderForm";
import {useModalStore} from "@/store/modalStore";
import {IOrder} from "@/types/order";
import {useOrdersMutations} from "@/hooks/orders/useOrdersMutations";

export const OrderModal = () => {
    const order = useModalStore(state => state.modalProps)
    const closeModal = useModalStore(state => state.closeModal)

    const {createOrder, updateOrder} = useOrdersMutations();

    const submitHandler = async (data: IOrder) => {
        try {
            if (order?.id) {
                await updateOrder.mutateAsync({...data, id: order.id});
            } else {
                await createOrder.mutateAsync(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeModal()
        }
    };

    return (<Modal
        headerText={order?.id ? `Замовлення на ${order.vehicle.brand} ${order.vehicle.model}` : 'Нове замовлення'}
        className={styles.modal}>
        <OrderForm
            order={order}
            loading={createOrder.isPending || updateOrder.isPending}

            onSubmit={submitHandler}
            onClose={closeModal}
        />
    </Modal>)
}