import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {connectToDatabase} from "@/lib/db";
import User from "@/models/User";

const SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
    try {
        const {email, password} = await request.json();

        await connectToDatabase();

        const user = await User.findOne({email});

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ message: "Невірний email або пароль" }, { status: 401 });
        }

        const token = jwt.sign({id: user._id, email: user.email}, SECRET, {expiresIn: "30d"});

        const response = NextResponse.json(
            {
                message: "Logged in",
                data: {id: user._id, email: user.email},
            },
            {status: 200}
        );

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 днів
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({message: "Сталась помилка при вході"}, {status: 500});
    }
}
