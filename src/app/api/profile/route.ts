import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import User from "@/models/User";

import fs from "fs";
import path from "path";

export async function POST(request: Request) {
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

        if (logoFile && logoFile.size > 0) {
            const safeFileName = logoFile.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9.\-_]/g, '');

            const fileName = `${Date.now()}-${safeFileName}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, {recursive: true});
            }

            const arrayBuffer = await logoFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fs.writeFileSync(path.join(uploadDir, fileName), buffer);

            user.logo = `/uploads/${fileName}`;
        }

        const companyName = formData.get("companyName")?.toString() || '';
        const email = formData.get("email")?.toString() || '';
        const phone = formData.get("phone")?.toString() || '';

        user.companyName = companyName;
        user.email = email;
        user.phone = phone;

        await user.save();

        return NextResponse.json({
            companyName: user.companyName,
            email: user.email,
            phone: user.phone,
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
            logo: user.logo || ''
        });
    } catch (error) {
        console.error("Load clients error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні клієнтів"}, {status: 500});
    }
}
