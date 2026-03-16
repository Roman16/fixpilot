import styles from "../catalog.module.scss";
import {SupplierCatalogNode} from "@/lib/supplierParser";

interface Props {
    nodes: SupplierCatalogNode[];
    isLoading: boolean;
    selectedNodeId: number | null;
    onSelect: (id: number) => void;
}

export const CatalogStep = ({nodes, isLoading, selectedNodeId, onSelect}: Props) => {
    const rootNodes = nodes.filter(n => n.parentId === null || n.level === 0);
    const getChildren = (parentId: number) => nodes.filter(n => n.parentId === parentId);

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <span className={styles.step}>04</span>
                <h2>Категорія запчастин</h2>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Завантаження каталогу...</div>
            ) : rootNodes.length === 0 ? (
                <div className={styles.empty}>Каталог для цієї моделі недоступний</div>
            ) : (
                <div className={styles.catalogColumns}>
                    {rootNodes.map(root => {
                        const children = getChildren(root.id);
                        return (
                            <div key={root.id} className={styles.catalogGroup}>
                                <div
                                    className={styles.catalogGroupTitle}
                                    title={root.name}
                                >
                                    {root.name}
                                </div>
                                {children.length > 0 ? (
                                    <div className={styles.catalogGroupItems}>
                                        {children.map(child => {
                                            const grandChildren = getChildren(child.id);
                                            return (
                                                <div key={child.id}>
                                                    <button
                                                        className={`${styles.catalogItem} ${selectedNodeId === child.id ? styles.active : ''}`}
                                                        onClick={() => onSelect(child.id)}
                                                    >
                                                        {child.name}
                                                    </button>
                                                    {grandChildren.length > 0 && (
                                                        <div className={styles.catalogSubItems}>
                                                            {grandChildren.map(grand => (
                                                                <button
                                                                    key={grand.id}
                                                                    className={`${styles.catalogSubItem} ${selectedNodeId === grand.id ? styles.active : ''}`}
                                                                    onClick={() => onSelect(grand.id)}
                                                                >
                                                                    {grand.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <button
                                        className={`${styles.catalogItem} ${selectedNodeId === root.id ? styles.active : ''}`}
                                        onClick={() => onSelect(root.id)}
                                    >
                                        {root.name}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};