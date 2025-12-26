export function formatUAH(value: number | string): string {
    const num = typeof value === 'string' ? Number(value) : value;

    if (!Number.isFinite(num)) return '0';

    const hasDecimals = Math.round(num * 100) % 100 !== 0;

    return new Intl.NumberFormat('uk-UA', {
        minimumFractionDigits: hasDecimals ? 1 : 0,
        maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(num);
}