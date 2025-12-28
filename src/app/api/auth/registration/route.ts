import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import {connectToDatabase} from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { email, password, company } = await request.json();
        await connectToDatabase();

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return NextResponse.json(
                { error: "Такий email уже зареєстровано" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, company });
        await newUser.save();

        const { _id } = newUser.toObject();

        return NextResponse.json(
            { message: "User registered successfully", data: { id: _id, email } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Register Error:', error);
        return NextResponse.json(
            { error: "Сталася помилка при реєстрації" },
            { status: 500 }
        );
    }
}

