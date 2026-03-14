'use client';

import React, {useEffect, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {Button, Input} from '@/app/components/ui';
import {useServiceTemplates, useUpdateServiceTemplates} from '@/hooks/serviceTemplates/useServiceTemplates';
import {IServiceTemplate, IServicePackage} from '@/types/serviceTemplate';
import styles from './serviceTemplatesSettings.module.scss';
import {ChevronDown, ChevronUp} from "lucide-react";

export const ServiceTemplatesSettingsForm: React.FC = () => {
    const {data: templates, isLoading} = useServiceTemplates();
    const updateMutation = useUpdateServiceTemplates();
    const [activePackageIndex, setActivePackageIndex] = useState<number | null>(null);

    const {register, handleSubmit, reset, control} = useForm<IServiceTemplate>({
        defaultValues: {works: [], materials: [], packages: []},
    });

    const {fields: workFields, append: appendWork, remove: removeWork} =
        useFieldArray({control, name: 'works'});

    const {fields: materialFields, append: appendMaterial, remove: removeMaterial} =
        useFieldArray({control, name: 'materials'});

    const {fields: packageFields, append: appendPackage, remove: removePackage} =
        useFieldArray({control, name: 'packages'});

    useEffect(() => {
        if (templates) reset(templates);
    }, [templates, reset]);

    const onSubmit = (values: IServiceTemplate) => {
        updateMutation.mutate(values);
    };

    if (isLoading) return <p>Завантаження...</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

            {/* ── Стандартні роботи ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h3>Стандартні роботи</h3>
                        <p className={styles.hint}>
                            Підказки при введенні назви роботи. Якщо вказати ціну — вона підставиться автоматично.
                        </p>
                    </div>
                </div>

                <div className={styles.itemList}>
                    {workFields.map((field, index) => (
                        <div key={field.id} className={styles.itemRow}>
                            <Input
                                {...register(`works.${index}.name`)}
                                placeholder="Назва роботи (напр. Заміна масла)"
                            />
                            <Input
                                {...register(`works.${index}.price`, {valueAsNumber: true})}
                                placeholder="Дефолтна ціна"
                                type="number"
                                suffix="₴"
                                className={styles.priceInput}
                            />
                            <Button type="button" iconType="delete" onClick={() => removeWork(index)} />
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    iconType="plus"
                    onClick={() => appendWork({name: '', price: undefined})}
                >
                    Додати роботу
                </Button>
            </section>

            {/* ── Стандартні матеріали ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h3>Стандартні матеріали</h3>
                        <p className={styles.hint}>
                            Підказки при введенні назви матеріалу. Ціна підставиться при виборі.
                        </p>
                    </div>
                </div>

                <div className={styles.itemList}>
                    {materialFields.map((field, index) => (
                        <div key={field.id} className={styles.itemRow}>
                            <Input
                                {...register(`materials.${index}.name`)}
                                placeholder="Назва матеріалу (напр. Моторна олія 1л)"
                            />
                            <Input
                                {...register(`materials.${index}.price`, {valueAsNumber: true})}
                                placeholder="Дефолтна ціна"
                                type="number"
                                suffix="₴"
                                className={styles.priceInput}
                            />
                            <Button type="button" iconType="delete" onClick={() => removeMaterial(index)} />
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    iconType="plus"
                    onClick={() => appendMaterial({name: '', price: undefined})}
                >
                    Додати матеріал
                </Button>
            </section>

            {/* ── Пакети послуг ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h3>Пакети послуг</h3>
                        <p className={styles.hint}>
                            Пакет одним кліком додає набір робіт та матеріалів у замовлення.
                        </p>
                    </div>
                </div>

                <div className={styles.packageList}>
                    {packageFields.map((pkgField, pkgIndex) => {
                        const isOpen = activePackageIndex === pkgIndex;
                        return (
                            <div key={pkgField.id} className={styles.packageCard}>
                                <div
                                    className={styles.packageHeader}
                                    onClick={() => setActivePackageIndex(isOpen ? null : pkgIndex)}
                                >
                                    <div
                                        className={styles.packageNameWrap}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Input
                                            {...register(`packages.${pkgIndex}.name`)}
                                            placeholder="Назва пакету (напр. ТО-1, Сезонне обслуговування)"
                                        />
                                    </div>
                                    <span className={styles.chevron}>{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
                                    <Button
                                        type="button"
                                        iconType="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removePackage(pkgIndex);
                                            if (activePackageIndex === pkgIndex) setActivePackageIndex(null);
                                        }}
                                    />
                                </div>

                                {isOpen && (
                                    <PackageEditor
                                        pkgIndex={pkgIndex}
                                        register={register}
                                        control={control}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <Button
                    type="button"
                    iconType="plus"
                    onClick={() => {
                        appendPackage({name: '', works: [], materials: []});
                        setActivePackageIndex(packageFields.length);
                    }}
                >
                    Додати пакет
                </Button>
            </section>

            <Button
                type="submit"
                variant="primary"
                isLoading={updateMutation.isPending}
                className={styles.saveBtn}
            >
                Зберегти шаблони
            </Button>
        </form>
    );
};

interface PackageEditorProps {
    pkgIndex: number;
    register: any;
    control: any;
}

const PackageEditor: React.FC<PackageEditorProps> = ({pkgIndex, register, control}) => {
    const {fields: wFields, append: aw, remove: rw} =
        useFieldArray({control, name: `packages.${pkgIndex}.works`});

    const {fields: mFields, append: am, remove: rm} =
        useFieldArray({control, name: `packages.${pkgIndex}.materials`});

    return (
        <div className={styles.packageContent}>
            <div className={styles.packageCol}>
                <h4>Роботи</h4>
                {wFields.map((wf, wi) => (
                    <div key={wf.id} className={styles.itemRow}>
                        <Input
                            {...register(`packages.${pkgIndex}.works.${wi}.name`)}
                            placeholder="Назва роботи"
                        />
                        <Input
                            {...register(`packages.${pkgIndex}.works.${wi}.price`, {valueAsNumber: true})}
                            placeholder="Ціна"
                            type="number"
                            suffix="₴"
                            className={styles.priceInput}
                        />
                        <Button type="button" iconType="delete" onClick={() => rw(wi)} />
                    </div>
                ))}
                <Button type="button" iconType="plus" onClick={() => aw({name: '', price: undefined})}>
                    Додати роботу
                </Button>
            </div>

            <div className={styles.packageCol}>
                <h4>Матеріали</h4>
                {mFields.map((mf, mi) => (
                    <div key={mf.id} className={styles.itemRow}>
                        <Input
                            {...register(`packages.${pkgIndex}.materials.${mi}.name`)}
                            placeholder="Назва матеріалу"
                        />
                        <Input
                            {...register(`packages.${pkgIndex}.materials.${mi}.count`, {valueAsNumber: true})}
                            placeholder="К-сть"
                            type="number"
                            className={styles.countInput}
                        />
                        <Input
                            {...register(`packages.${pkgIndex}.materials.${mi}.price`, {valueAsNumber: true})}
                            placeholder="Ціна"
                            type="number"
                            suffix="₴"
                            className={styles.priceInput}
                        />
                        <Button type="button" iconType="delete" onClick={() => rm(mi)} />
                    </div>
                ))}
                <Button type="button" iconType="plus" onClick={() => am({name: '', count: 1, price: undefined})}>
                    Додати матеріал
                </Button>
            </div>
        </div>
    );
};