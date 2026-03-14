import {FC, useEffect, useRef, useState} from 'react';
import {useEmployeesList} from '@/hooks/employees/useEmployeesList';
import styles from '@/app/components/forms/OrderForm/orderForm.module.scss';
import {Button, Input} from '@/app/components/ui';
import {Select} from '@/app/components/ui/Select/Select';
import {IEmployee} from '@/types/employee';
import {useFieldArray} from 'react-hook-form';
import {Price} from '@/app/components/ui/Price/Price';
import {WorkAutocomplete} from './WorkAutocomplete';
import {useServiceTemplates} from '@/hooks/serviceTemplates/useServiceTemplates';
import {IServicePackage} from '@/types/serviceTemplate';

interface WorksProps {
    register: any;
    setValue?: (name: any, value: any) => void;
    watched: any[];
    control: any;
    appendMaterial?: (material: any) => void;
}

export const Works: FC<WorksProps> = ({register, setValue, watched, control, appendMaterial}) => {
    const {data: employeesData} = useEmployeesList();
    const {data: templates} = useServiceTemplates();
    const employees = employeesData?.data || [];
    const packages: IServicePackage[] = templates?.packages || [];

    const [showPackages, setShowPackages] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {fields, append, remove} = useFieldArray({control, name: 'works'});

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowPackages(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleAddWork = () => {
        append({name: '', employeeId: watched[0]?.employeeId || ''});
    };

    const handleApplyPackage = (pkg: IServicePackage) => {
        const defaultEmployeeId = watched[0]?.employeeId || '';

        pkg.works?.forEach((work) => {
            append({
                name: work.name,
                price: work.price ?? '',
                employeeId: defaultEmployeeId,
            });
        });

        pkg.materials?.forEach((mat) => {
            appendMaterial?.({
                name: mat.name,
                count: mat.count ?? 1,
                price: mat.price ?? '',
            });
        });

        setShowPackages(false);
    };

    return (
        <div className={styles.section}>
            <h3 className={styles.selectTitle}>
                Роботи (послуги)

                {packages.length > 0 && (
                    <Select
                        options={packages.map((pkg) => ({
                            ...pkg,
                            value: pkg.name,
                            label: pkg.name,
                        }))}
                        value=""
                        placeholder="Додати пакет послуг"
                        onChange={(_, pkg) => handleApplyPackage(pkg)}
                    />
                )}
            </h3>

            {fields.map((field, index) => (
                <div key={field.id} className={styles.dynamicRow}>
                    <div className={styles.rowIndex}>{index + 1}</div>

                    <WorkAutocomplete
                        value={watched[index]?.name || ''}
                        onChange={(val, defaultPrice) => {
                            setValue && setValue(`works.${index}.name`, val);
                            if (defaultPrice != null && !watched[index]?.price) {
                                setValue && setValue(`works.${index}.price`, defaultPrice);
                            }
                        }}
                        placeholder="Назва роботи"
                    />

                    <Select<IEmployee>
                        options={employees.map((e: IEmployee) => ({
                            ...e,
                            value: e.id,
                            label: `${e.name} ${e?.role && `(${e.role})`}`,
                            id: e.id,
                        }))}
                        value={watched[index]?.employeeId || ''}
                        className={styles.employee}
                        onChange={(id) => {
                            setValue && setValue(`works.${index}.employeeId`, id);
                        }}
                        placeholder="Майстер"
                    />

                    <div className={styles.priceContainer}>
                        <Input
                            {...register(`works.${index}.price`, {valueAsNumber: true})}
                            className={styles.price}
                            placeholder="Ціна"
                            type="number"
                            suffix="₴"
                        />
                    </div>

                    <Button
                        className={styles.delete}
                        iconType="delete"
                        type="button"
                        onClick={() => remove(index)}
                    />
                </div>
            ))}

            <div className={styles.totalRow}>
                <Button iconType="plus" className={styles['add-item']} type="button" onClick={handleAddWork}>
                    Додати роботу
                </Button>

                <h5>Загальна вартість робіт:</h5>
                <p>
                    <Price value={watched?.reduce((sum, item) => sum + Number(item.price || 0), 0)} />
                </p>
            </div>
        </div>
    );
};