import styles from "../catalog.module.scss";
import {SupplierCatalogNode} from "@/lib/supplierParser";
import {useState} from "react";

interface Props {
    node: SupplierCatalogNode;
    childNodes: SupplierCatalogNode[];
    selectedNodeId: number | null;
    onSelect: (id: number) => void;
    getChildren: (id: number) => SupplierCatalogNode[];
}

export const CatalogNode = ({node, childNodes, selectedNodeId, onSelect, getChildren}: Props) => {
    const [expanded, setExpanded] = useState(false);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = childNodes.length > 0;

    const handleClick = () => {
        onSelect(node.id);
        if (hasChildren) setExpanded(v => !v);
    };

    return (
        <div className={styles.treeNode}>
            <button
                className={`${styles.nodeBtn} ${isSelected ? styles.active : ''} ${hasChildren ? styles.hasChildren : ''}`}
                onClick={handleClick}
            >
                {hasChildren && (
                    <span className={`${styles.arrow} ${expanded ? styles.open : ''}`}>▸</span>
                )}
                <span>{node.name}</span>
            </button>

            {expanded && hasChildren && (
                <div className={styles.nodeChildren}>
                    {childNodes.map(child => (
                        <CatalogNode
                            key={child.id}
                            node={child}
                            childNodes={getChildren(child.id)}
                            selectedNodeId={selectedNodeId}
                            onSelect={onSelect}
                            getChildren={getChildren}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};