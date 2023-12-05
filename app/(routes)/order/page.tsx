import getOrders from '@/actions/get-order';
import { OrderClient } from './component/client';

const OrderPage = async () => {

    const orderList = await getOrders()

    return (
        <div className="custom-container">
            <OrderClient orderList={orderList} />
        </div>
    )
}

export default OrderPage;
