/**
 * src/lib/supplierSession.ts
 * Авторизація на order.vladislav.ua та виконання запитів
 * Credentials беруться з профілю юзера в БД
 */

const SUPPLIER_URL = 'https://order.vladislav.ua';

// In-memory кеш сесій per userId
const sessions = new Map<string, { cookies: string; expiresAt: number }>();

function buildCookieString(raw: string[]): string {
    const map: Record<string, string> = {};
    for (const header of raw) {
        const [pair] = header.split(';');
        const eq = pair.indexOf('=');
        if (eq > 0) {
            const key = pair.slice(0, eq).trim();
            const val = pair.slice(eq + 1).trim();
            map[key] = val;
        }
    }
    return Object.entries(map).map(([k, v]) => `${k}=${v}`).join('; ');
}

export async function loginToSupplier(userId: string, login: string, password: string): Promise<string> {
    const body = new URLSearchParams({
        act: 'backjobmainautentication',
        lgn: password,
        psw: login,
    });

    const response = await fetch(`${SUPPLIER_URL}/app/orders.cgi/nabj`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/javascript, application/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0',
        },
        body: body.toString(),
    });

    const buffer = await response.arrayBuffer();
    const text = new TextDecoder('windows-1251').decode(buffer);

    if (!response.ok) throw new Error(`Supplier login failed: ${response.status}`);

    const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
    const cookieString = buildCookieString(setCookieHeaders);

    if (!cookieString.includes('sid=')) {
        throw new Error('Не вдалось авторизуватись у постачальника. Перевірте логін та пароль.');
    }

    sessions.set(userId, {
        cookies: cookieString,
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 хв
    });

    return cookieString;
}

export async function getSupplierCookies(userId: string, login: string, password: string): Promise<string> {
    const cached = sessions.get(userId);
    if (cached && Date.now() < cached.expiresAt) return cached.cookies;
    return loginToSupplier(userId, login, password);
}

export async function supplierRequest(
    userId: string,
    login: string,
    password: string,
    params: Record<string, string>,
): Promise<string> {
    const cookies = await getSupplierCookies(userId, login, password);

    const response = await fetch(`${SUPPLIER_URL}/app/orders.cgi/abj`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/javascript, application/javascript, */*; q=0.01',
            'Cookie': cookies,
            'User-Agent': 'Mozilla/5.0',
            'Referer': `${SUPPLIER_URL}/app/orders.cgi/universal?act=orders`,
        },
        body: new URLSearchParams(params).toString(),
    });

    if (!response.ok) throw new Error(`Supplier request failed: ${response.status}`);

    const buffer = await response.arrayBuffer();
    const text = new TextDecoder('windows-1251').decode(buffer);
    console.log(text);
    // Якщо сесія інвалідована — ре-логінимось і повторюємо
    if (text.includes('backjobmainautentication') || text.includes('autentication')) {
        sessions.delete(userId); // скидаємо кеш
        const freshCookies = await loginToSupplier(userId, login, password);

        const retry = await fetch(`${SUPPLIER_URL}/app/orders.cgi/abj`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/javascript, application/javascript, */*; q=0.01',
                'Cookie': freshCookies,
                'User-Agent': 'Mozilla/5.0',
                'Referer': `${SUPPLIER_URL}/app/orders.cgi/universal?act=orders`,
            },
            body: new URLSearchParams(params).toString(),
        });

        const retryBuffer = await retry.arrayBuffer();
        return new TextDecoder('windows-1251').decode(retryBuffer);
    }

    return text;
}

export async function supplierPageRequest(
    userId: string,
    login: string,
    password: string,
    params: Record<string, string>,
): Promise<string> {
    const cookies = await getSupplierCookies(userId, login, password);

    const response = await fetch(`${SUPPLIER_URL}/app/orders.cgi/newpagebj`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': cookies,
            'User-Agent': 'Mozilla/5.0',
        },
        body: new URLSearchParams(params).toString(),
    });

    if (!response.ok) throw new Error(`Supplier page request failed: ${response.status}`);

    const buffer = await response.arrayBuffer();
    return new TextDecoder('windows-1251').decode(buffer);
}