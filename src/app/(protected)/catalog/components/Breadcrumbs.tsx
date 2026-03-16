import styles from "../catalog.module.scss";

interface BreadcrumbItem {
    label: string;
    value?: string | null;
    onClick: () => void;
    active: boolean;
}

interface Props {
    items: BreadcrumbItem[];
}

export const Breadcrumbs = ({items}: Props) => {
    if (items.length <= 1 && !items[0]?.value) return null;

    return (
        <nav className={styles.breadcrumbs}>
            {items.map((item, index) => (
                <span key={index} className={styles.breadcrumbItem}>
                    {index > 0 && <span className={styles.breadcrumbSeparator}>›</span>}
                    <button
                        className={`${styles.breadcrumbBtn} ${item.active ? styles.breadcrumbActive : ''} ${item.value ? styles.breadcrumbDone : ''}`}
                        onClick={item.onClick}
                        disabled={item.active}
                    >
                        <span className={styles.breadcrumbLabel}>{item.label}</span>
                        {item.value && <span className={styles.breadcrumbValue}>{item.value}</span>}
                    </button>
                </span>
            ))}
        </nav>
    );
};