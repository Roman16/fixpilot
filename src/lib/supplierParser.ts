/**
 * src/lib/supplierParser.ts
 * Парсить JS-відповіді order.vladislav.ua в чистий JSON
 */

export interface SupplierBrand {
    id: number;
    name: string;
}

export interface SupplierModel {
    id: number;
    name: string;
}

export interface SupplierCatalogNode {
    id: number;
    name: string;
    parentId: number | null;
    level: number;
}

export interface SupplierPart {
    id: number;
    article: string;
    name: string;
    brand: string;
    unit: string;
    description: string;
    priceRetail: number;
    priceWholesale: number;
}

export interface SupplierOrder {
    id: string;
    orderNum: string;
    orderDate: string;
    orderSum: string;
    status: string;
    contractId: number;
}

// <option value=533>HONDA</option>
export function parseBrands(js: string): SupplierBrand[] {
    const out: SupplierBrand[] = [];
    const re = /<option value=(-?\d+)>([^<]+)<\/option>/g;
    let m;
    while ((m = re.exec(js)) !== null) {
        const id = parseInt(m[1]);
        if (id > 0) out.push({ id, name: m[2].trim() });
    }
    return out;
}

// new Option('YZF - R1 / R6', 21340, false, false)
export function parseModels(js: string): SupplierModel[] {
    const out: SupplierModel[] = [];
    const re = /new Option\('([^']+)',\s*(\d+),/g;
    let m;
    while ((m = re.exec(js)) !== null) {
        const id = parseInt(m[2]);
        if (id > 0) out.push({ id, name: m[1].trim() });
    }
    return out;
}

// awstl_redisign(el, ID, ..., "BRAND", ..., "ARTICLE/NAME/OEM", "unit", ..., ["retail","wholesale","disc"], ..., "desc", ...)
export interface SupplierPart {
    id: number;
    article: string;
    name: string;
    oem: string;
    brand: string;
    brandSlug: string;
    unit: string;
    description: string;
    priceRetail: number;
    priceWholesale: number;
}

export function parseParts(js: string): SupplierPart[] {
    const parts: SupplierPart[] = [];
    const re = /awstl_redisign\(document\.getElementById\('[^']+'\),\s*([\s\S]+?)\);\s*(?:awstl_|setcompare|checkList|setSem)/g;
    let m;

    while ((m = re.exec(js)) !== null) {
        try {
            const raw = m[1];
            const args = splitArgs(raw);
            if (args.length < 24) continue;

            const id = parseInt(args[0]);
            const brand = unquote(args[2]);
            const brandSlug = unquote(args[3]);
            const articleRaw = unquote(args[7]);
            const unit = unquote(args[8]);

            const slashParts = articleRaw.split('/');
            const article = slashParts[0]?.trim() ?? '';
            const name = slashParts[1]?.trim() ?? articleRaw;
            const oem = slashParts[2]?.trim() ?? '';

            const pricesMatch = raw.match(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/);
            const priceRetail = pricesMatch ? parsePrice(pricesMatch[1]) : 0;
            const priceWholesale = pricesMatch ? parsePrice(pricesMatch[2]) : 0;

            const descMatch = raw.match(/,\s*"([^"]{10,})"\s*,\s*\d+\s*,\s*(?:false|true)\s*,\s*\d+/);
            const description = descMatch ? descMatch[1] : '';

            parts.push({id, article, name, oem, brand, brandSlug, unit, description, priceRetail, priceWholesale});
        } catch {
            continue;
        }
    }

    return parts;
}
// ── helpers ───────────────────────────────────────────────────────────────────

function unquote(s: string): string {
    return s.replace(/^["']|["']$/g, '').trim();
}

function parsePrice(s: string): number {
    return parseFloat(s.replace(/\s/g, '').replace(',', '.')) || 0;
}

function splitArgs(str: string): string[] {
    const args: string[] = [];
    let cur = '', depth = 0, inStr = false, strChar = '';
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (inStr) {
            cur += ch;
            if (ch === strChar && str[i - 1] !== '\\') inStr = false;
        } else if (ch === '"' || ch === "'") {
            inStr = true; strChar = ch; cur += ch;
        } else if (ch === '[' || ch === '(') {
            depth++; cur += ch;
        } else if (ch === ']' || ch === ')') {
            depth--; cur += ch;
        } else if (ch === ',' && depth === 0) {
            args.push(cur.trim()); cur = '';
        } else {
            cur += ch;
        }
    }
    if (cur.trim()) args.push(cur.trim());
    return args;
}

export interface SupplierSubModel {
    id: number;
    name: string;
}

// addmodelrowforselect(58867, true, "S 1000 R (2013-2020)", ...)
export function parseSubModels(js: string): SupplierSubModel[] {
    const out: SupplierSubModel[] = [];
    const re = /addmodelrowforselect\(\s*(\d+)\s*,\s*(?:true|false)\s*,\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(js)) !== null) {
        out.push({ id: parseInt(m[1]), name: m[2].trim() });
    }
    return out;
}

export function parseCatalog(js: string): SupplierCatalogNode[] {
    const out: SupplierCatalogNode[] = [];
    const re = /addbranchsel\(\s*(\d+)\s*,\s*(\d+)\s*,\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(js)) !== null) {
        const id = parseInt(m[1]);
        const parentId = parseInt(m[2]);
        const name = m[3].replace(/\s*\(\s*\d+\s*\)\s*$/, '').trim(); // прибираємо "( 3 )"
        out.push({ id, name, parentId: parentId === 0 ? null : parentId, level: parentId === 0 ? 0 : 1 });
    }
    return out;
}


// TStream.arrtable[0]={..., CurOrderID:"17441455", StatusName:"Закрите", ...}
export function parseOrders(js: string): SupplierOrder[] {
    const out: SupplierOrder[] = [];
    const re = /TStream\.arrtable\[\d+\]=\{([^}]+)\}/g;
    let m;
    while ((m = re.exec(js)) !== null) {
        try {
            const raw = m[1];
            const get = (key: string) => raw.match(new RegExp(`${key}:"([^"]*)"`))?.[1] ?? '';
            const getNum = (key: string) => parseInt(raw.match(new RegExp(`${key}:(\\d+)`))?.[1] ?? '0');
            out.push({
                id: get('CurOrderID'),
                orderNum: get('orderNum'),
                orderDate: get('orderDate'),
                orderSum: get('orderSum'),
                status: get('StatusName'),
                contractId: getNum('CurContractID'),
            });
        } catch { continue; }
    }
    return out;
}

export function findOpenOrder(orders: SupplierOrder[]): string | null {
    const open = orders.filter(o => o.status === 'Формується');
    return open.at(-1)?.id ?? null;
}
