'use client';

import styles from "./catalog.module.scss";
import {useState} from "react";
import {
    useSupplierBrands,
    useSupplierModels,
    useSupplierSubModels,
    useSupplierCatalog,
    useSupplierParts
} from "@/hooks/supplier/useSupplier";
import {BrandStep} from "./components/BrandStep";
import {ModelStep} from "./components/ModelStep";
import {SubModelStep} from "./components/SubModelStep";
import {CatalogStep} from "./components/CatalogStep";
import {PartsStep} from "./components/PartsStep";
import {Breadcrumbs} from "./components/Breadcrumbs";

type Step = 'brand' | 'model' | 'submodel' | 'catalog' | 'parts';

export default function CatalogPage() {
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
    const [selectedSubModelId, setSelectedSubModelId] = useState<number | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

    const {data: brands = [], isLoading: brandsLoading} = useSupplierBrands();
    const {data: models = [], isLoading: modelsLoading} = useSupplierModels(selectedBrandId);
    const {data: subModels = [], isLoading: subModelsLoading} = useSupplierSubModels(selectedModelId);
    const {data: nodes = [], isLoading: nodesLoading} = useSupplierCatalog(selectedSubModelId);
    const {data: parts = [], isLoading: partsLoading} = useSupplierParts(selectedSubModelId, selectedNodeId);

    const selectedBrand = brands.find(b => b.id === selectedBrandId);
    const selectedModel = models.find(m => m.id === selectedModelId);
    const selectedSubModel = subModels.find(s => s.id === selectedSubModelId);
    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    const activeStep: Step = selectedNodeId ? 'parts'
        : selectedSubModelId ? 'catalog'
            : selectedModelId ? 'submodel'
                : selectedBrandId ? 'model'
                    : 'brand';

    const handleBrandSelect = (id: number) => {
        setSelectedBrandId(id);
        setSelectedModelId(null);
        setSelectedSubModelId(null);
        setSelectedNodeId(null);
    };

    const handleModelSelect = (id: number) => {
        setSelectedModelId(id);
        setSelectedSubModelId(null);
        setSelectedNodeId(null);
    };

    const handleSubModelSelect = (id: number) => {
        setSelectedSubModelId(id);
        setSelectedNodeId(null);
    };

    const handleNodeSelect = (id: number) => {
        setSelectedNodeId(id);
    };

    const goToBrand = () => {
        setSelectedBrandId(null);
        setSelectedModelId(null);
        setSelectedSubModelId(null);
        setSelectedNodeId(null);
    };

    const goToModel = () => {
        setSelectedModelId(null);
        setSelectedSubModelId(null);
        setSelectedNodeId(null);
    };

    const goToSubModel = () => {
        setSelectedSubModelId(null);
        setSelectedNodeId(null);
    };

    const goToCatalog = () => {
        setSelectedNodeId(null);
    };

    return (
        <div className={styles.page}>
            <Breadcrumbs
                items={[
                    {label: 'Марка', value: selectedBrand?.name, onClick: goToBrand, active: activeStep === 'brand'},
                    selectedBrandId ? {label: 'Модель', value: selectedModel?.name, onClick: goToModel, active: activeStep === 'model'} : null,
                    selectedModelId ? {label: 'Рік', value: selectedSubModel?.name, onClick: goToSubModel, active: activeStep === 'submodel'} : null,
                    selectedSubModelId ? {label: 'Категорія', value: selectedNode?.name, onClick: goToCatalog, active: activeStep === 'catalog'} : null,
                    selectedNodeId ? {label: 'Товари', value: null, onClick: () => {}, active: activeStep === 'parts'} : null,
                ].filter(Boolean) as any}
            />

            {activeStep === 'brand' && (
                <BrandStep
                    brands={brands}
                    isLoading={brandsLoading}
                    selectedBrandId={selectedBrandId}
                    onSelect={handleBrandSelect}
                />
            )}

            {activeStep === 'model' && (
                <ModelStep
                    models={models}
                    isLoading={modelsLoading}
                    selectedModelId={selectedModelId}
                    onSelect={handleModelSelect}
                />
            )}

            {activeStep === 'submodel' && (
                <SubModelStep
                    subModels={subModels}
                    isLoading={subModelsLoading}
                    selectedSubModelId={selectedSubModelId}
                    onSelect={handleSubModelSelect}
                />
            )}

            {activeStep === 'catalog' && (
                <CatalogStep
                    nodes={nodes}
                    isLoading={nodesLoading}
                    selectedNodeId={selectedNodeId}
                    onSelect={handleNodeSelect}
                />
            )}

            {activeStep === 'parts' && (
                <PartsStep
                    parts={parts}
                    isLoading={partsLoading}
                />
            )}
        </div>
    );
}