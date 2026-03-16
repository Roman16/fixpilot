import {NextRequest, NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import {getSession} from '@/lib/getSession';
import User from '@/models/User';
import {supplierRequest} from '@/lib/supplierSession';
import {parseParts} from '@/lib/supplierParser';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session?.id) return NextResponse.json({message: 'Неавторизовано'}, {status: 401});

        const {searchParams} = new URL(req.url);
        const modelId = searchParams.get('modelId');
        const nodeId = searchParams.get('nodeId');

        if (!modelId) return NextResponse.json({message: 'modelId обовязковий'}, {status: 400});
        if (!nodeId) return NextResponse.json({message: 'nodeId обовязковий'}, {status: 400});

        const user = await User.findById(session.id).select('supplierLogin supplierPassword');
        if (!user?.supplierLogin) {
            return NextResponse.json({message: 'Додайте логін та пароль постачальника в налаштуваннях'}, {status: 400});
        }

        const js = await supplierRequest(session.id, user.supplierLogin, user.supplierPassword, {
            act: 'getnodewares',
            model: modelId,
            node: nodeId,
            pref: 'sel_moto',
            contract: '90125',
        });

        return NextResponse.json({data: parseParts(js)});
    } catch (error: any) {
        console.error('Supplier parts error:', error);
        return NextResponse.json({message: error.message || 'Помилка'}, {status: 500});
    }
}