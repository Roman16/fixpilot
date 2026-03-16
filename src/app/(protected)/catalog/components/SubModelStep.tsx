import styles from "../catalog.module.scss";
import {SupplierSubModel} from "@/lib/supplierParser";

interface Props {
    subModels: SupplierSubModel[];
    isLoading: boolean;
    selectedSubModelId: number | null;
    onSelect: (id: number) => void;
}

const parseSubModelName = (name: string) => {
    const match = name.match(/^(.+?)\s*(\(\d{4}.*?\))\s*$/);
    return {
        title: match?.[1]?.trim() ?? name,
        years: match?.[2]?.trim() ?? null,
    };
};

export const SubModelStep = ({subModels, isLoading, selectedSubModelId, onSelect}: Props) => {
    const selectedSubModel = subModels.find(s => s.id === selectedSubModelId);

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <span className={styles.step}>03</span>
                <h2>Рік випуску</h2>
                {selectedSubModel && <span className={styles.selected}>{selectedSubModel.name}</span>}
            </div>

            {isLoading ? (
                <div className={styles.loading}>Завантаження...</div>
            ) : (
                <div className={styles.modelGrid}>
                    {subModels.map(sub => {
                        const {title, years} = parseSubModelName(sub.name);
                        return (
                            <button
                                key={sub.id}
                                className={`${styles.modelBtn} ${selectedSubModelId === sub.id ? styles.active : ''}`}
                                onClick={() => onSelect(sub.id)}
                            >
                                <span className={styles.modelTitle}>{title}</span>
                                {years && <span className={styles.modelYears}>{years}</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};