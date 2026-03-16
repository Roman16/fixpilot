import {NextRequest, NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import {getSession} from '@/lib/getSession';
import User from '@/models/User';
import {supplierRequest, supplierPageRequest} from '@/lib/supplierSession';
import {parseOrders, findOpenOrder} from '@/lib/supplierParser';

// Отримати список замовлень і знайти відкрите
async function getOpenOrderId(userId: string, login: string, password: string): Promise<string> {
    const js = await supplierPageRequest(userId, login, password, {
        act: 'orders_',
        fillDetails: 'false',
        cl: 'orders',
        isActive: 'true',
        elem: 'ul.navigation-list.left li a.orders',
    });

    const orders = parseOrders(js);
    return findOpenOrder(orders) ?? '';
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session?.id) return NextResponse.json({message: 'Неавторизовано'}, {status: 401});

        const {wareCode, qty = 1} = await req.json();
        if (!wareCode) return NextResponse.json({message: 'wareCode обовязковий'}, {status: 400});

        const user = await User.findById(session.id).select('supplierLogin supplierPassword');
        if (!user?.supplierLogin) return NextResponse.json({message: 'Додайте логін та пароль постачальника'}, {status: 400});

        const ordr = await getOpenOrderId(session.id, user.supplierLogin, user.supplierPassword);
        console.log('open order id:', ordr);

        const js = await supplierRequest(session.id, user.supplierLogin, user.supplierPassword, {
            act: 'linefromsearchtoorder',
            ordr,
            warecode: String(wareCode),
            wareqty: String(qty),
            isfromwaresearch: 'true',
            contract: '90125',
        });

        // Витягуємо номер замовлення з відповіді
        const orderMatch = js.match(/ordernum=(\d+)/);
        const orderNum = orderMatch?.[1] ?? ordr;

        return NextResponse.json({
            message: 'Товар додано до замовлення',
            orderId: orderNum,
        });
    } catch (error: any) {
        console.error('Supplier order error:', error);
        return NextResponse.json({message: error.message || 'Помилка'}, {status: 500});
    }
}