import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface Session {
    id: string;
    email?: string;
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as Session;
        return decoded;
    } catch {
        return null;
    }
};