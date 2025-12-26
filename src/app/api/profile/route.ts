import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import User from "@/models/User";
import { put, del } from '@vercel/blob';

export async function PATCH(request: Request) {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const user = await User.findById(session.id);

        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        const formData = await request.formData();
        const logoFile = formData.get('logo') as File | null;
        const removeLogo = formData.get('removeLogo') === 'true';

        if (removeLogo && user.logo) {
            await del(user.logo);
            user.logo = undefined;
        }

        if (logoFile && logoFile.size > 0) {
            if (user.logo) {
                await del(user.logo);
            }

            const safeFileName = logoFile.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9.\-_]/g, '');

            const blob = await put(
                `logos/${session.id}/${Date.now()}-${safeFileName}`,
                logoFile,
                {
                    access: "public",
                    contentType: logoFile.type,
                }
            );

            user.logo = blob.url;
        }

        const companyName = formData.get('companyName');
        if (companyName !== null) {
            user.companyName = companyName.toString();
        }

        const email = formData.get('email');
        if (email !== null) {
            user.email = email.toString();
        }

        const phone = formData.get('phone');
        if (phone !== null) {
            user.phone = phone.toString();
        }

        const address = formData.get('address');
        if (address !== null) {
            user.address = address.toString();
        }

        await user.save();

        return NextResponse.json({
            companyName: user.companyName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            logo: user.logo,
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({message: "Сталась помилка при оновленні профілю"}, {status: 500});
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const user = await User.findById(session.id).select('-password');

        if (!user) {
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }

        return NextResponse.json({
            companyName: user.companyName || '',
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            logo: user.logo || ''
        });
    } catch (error) {
        console.error("Load clients error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні клієнтів"}, {status: 500});
    }
}
