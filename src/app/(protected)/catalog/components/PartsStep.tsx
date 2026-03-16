import styles from "../catalog.module.scss";
import {SupplierPart} from "@/lib/supplierParser";
import {useAddToSupplierOrder} from "@/hooks/supplier/useSupplier";
import {useState} from "react";

interface Props {
    parts: SupplierPart[];
    isLoading: boolean;
}

export const PartsStep = ({parts, isLoading}: Props) => {
    const addToOrder = useAddToSupplierOrder();
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

    const handleAdd = async (part: SupplierPart) => {
        await addToOrder.mutateAsync({wareCode: part.id, qty: 1});
        setAddedIds(prev => new Set(prev).add(part.id));
    };

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <span className={styles.step}>05</span>
                <h2>Товари</h2>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Завантаження товарів...</div>
            ) : parts.length === 0 ? (
                <div className={styles.empty}>Товари не знайдені</div>
            ) : (
                <div className={styles.partsTable}>
                    {parts.map(part => (
                        <div key={part.id} className={styles.partRow}>
                            <img
                                className={styles.partImg}
                                src={`https://order.vladislav.ua/wareimages/${part.id}_1.jpg`}
                                alt={part.name}
                                onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}}
                            />
                            <div className={styles.partInfo}>
                                <span className={styles.partArticle}>{part.article}</span>
                                <span className={styles.partName}>{part.name}</span>
                                {part.oem && <span className={styles.partOem}>OEM: {part.oem}</span>}
                                {part.description && <span className={styles.partDescription}>{part.description}</span>}
                            </div>
                            <span className={styles.partBrand}>{part.brand}</span>
                            <span className={styles.partUnit}>{part.unit}</span>
                            <span className={styles.partPrice}>{part.priceRetail} ₴</span>
                            <span className={styles.partPriceWholesale}>{part.priceWholesale} ₴</span>

                            <button
                                className={`${styles.orderBtn} ${addedIds.has(part.id) ? styles.ordered : ''}`}
                                onClick={() => handleAdd(part)}
                                disabled={addToOrder.isPending || addedIds.has(part.id)}
                            >
                                {addedIds.has(part.id) ? '✓' : 'Замовити'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};