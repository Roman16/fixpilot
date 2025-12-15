import {baseService} from "@/services/baseService";
import {IOrdersResponse, IOrder} from "@/types/order";


class ordersService extends baseService {
    getOrders(page: number = 1, limit: number = 20, search: string = "") {
        return this.get<IOrdersResponse>('/orders', {
            params: { page, limit, search }
        });
    }

    createOrder(data: IOrder) {
        return this.post('/orders', data);
    }

    updateOrder(data: IOrder,) {
        return this.patch(`/orders/${data.id}`, data);
    }

    deleteOrder(id: string) {
        return this.delete(`/orders/${id}`);
    }

}

export default new ordersService();