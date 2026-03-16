import {NextRequest, NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import {getSession} from '@/lib/getSession';
import User from '@/models/User';
import {supplierRequest} from '@/lib/supplierSession';
import {parseModels} from '@/lib/supplierParser';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session?.id) return NextResponse.json({message: 'Неавторизовано'}, {status: 401});

        const brandId = new URL(req.url).searchParams.get('brandId');
        if (!brandId) return NextResponse.json({message: 'brandId обовязковий'}, {status: 400});

        const user = await User.findById(session.id).select('supplierLogin supplierPassword');
        if (!user?.supplierLogin) {
            return NextResponse.json({message: 'Додайте логін та пароль постачальника в налаштуваннях'}, {status: 400});
        }

        const js = await supplierRequest(session.id, user.supplierLogin, user.supplierPassword, {
            act: 'loadmodellinelist',
            id: brandId,
            select: 'modellinelistmoto',
            sys: '2',
        });

        return NextResponse.json({data: parseModels(js)});
    } catch (error: any) {
        console.error('Supplier models error:', error);
        return NextResponse.json({message: error.message || 'Помилка'}, {status: 500});
    }
}