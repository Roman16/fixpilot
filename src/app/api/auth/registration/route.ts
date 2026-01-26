import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import {connectToDatabase} from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
    try {
        const { email, password, companyName } = await request.json();
        await connectToDatabase();

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return NextResponse.json(
                { error: "Такий email уже зареєстровано" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            companyName,
        });

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET, { expiresIn: "30d" });

        const response = NextResponse.json(
            {
                message: "User registered and logged in",
                data: { id: newUser._id, email: newUser.email },
            },
            { status: 201 }
        );

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        return response;
    } catch (error: any) {
        console.error('Register Error:', error);
        return NextResponse.json(
            { error: "Сталася помилка при реєстрації" },
            { status: 500 }
        );
    }
}

