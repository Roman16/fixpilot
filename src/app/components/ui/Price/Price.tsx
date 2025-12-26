import {formatUAH} from "@/utils/formatNumber";

type PriceProps = {
    value: number | string;
};

export const Price = ({ value}: PriceProps) => {
    return <span>{formatUAH(value)} ₴</span>;
};
