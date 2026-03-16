import styles from "../catalog.module.scss";
import {SupplierModel} from "@/lib/supplierParser";

interface Props {
    models: SupplierModel[];
    isLoading: boolean;
    selectedModelId: number | null;
    onSelect: (id: number) => void;
}

const parseModelName = (name: string) => {
    const match = name.match(/^(.+?)\s*(\(\d{4}.*?\))?\s*$/);
    return {
        title: match?.[1]?.trim() ?? name,
        years: match?.[2]?.trim() ?? null,
    };
};

export const ModelStep = ({models, isLoading, selectedModelId, onSelect}: Props) => {
    const selectedModel = models.find(m => m.id === selectedModelId);

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <span className={styles.step}>02</span>
                <h2>Модель</h2>
                {selectedModel && <span className={styles.selected}>{selectedModel.name}</span>}
            </div>

            {isLoading ? (
                <div className={styles.loading}>Завантаження...</div>
            ) : (
                <div className={styles.modelGrid}>
                    {models.map(model => {
                        const {title, years} = parseModelName(model.name);
                        return (
                            <button
                                key={model.id}
                                className={`${styles.modelBtn} ${selectedModelId === model.id ? styles.active : ''}`}
                                onClick={() => onSelect(model.id)}
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