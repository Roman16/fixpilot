import React from 'react';
import styles from '@/app/components/forms/OrderForm/orderForm.module.scss';
import {Button, Input} from '@/app/components/ui';
import {useFieldArray} from 'react-hook-form';
import {Price} from '@/app/components/ui/Price/Price';
import {MaterialAutocomplete} from './MaterialAutocomplete';

interface MaterialsProps {
    register: any;
    watched: any[];
    control: any;
    setValue: (name: any, value: any) => void;
    fields: any[];
    append: (data: any) => void;
    remove: (index: number) => void;
}

export const Materials: React.FC<MaterialsProps> = ({    register, watched, fields, append, remove, setValue}) => {

    return (
        <div className={styles.section}>
            <h3>Використані матеріали</h3>

            {fields.map((field, index) => (
                <div key={field.id} className={styles.dynamicRow}>
                    <div className={styles.rowIndex}>{index + 1}</div>

                    <MaterialAutocomplete
                        value={watched[index]?.name || ''}
                        onChange={(val, defaultPrice) => {
                            setValue(`materials.${index}.name`, val);
                            if (defaultPrice != null && !watched[index]?.price) {
                                setValue(`materials.${index}.price`, defaultPrice);
                            }
                        }}
                        placeholder="Назва матеріалу"
                    />

                    <Input
                        {...register(`materials.${index}.count`, {valueAsNumber: true})}
                        placeholder="Кількість"
                        type="number"
                        className={styles.materialCount}
                    />

                    <div className={styles.priceContainer}>
                        <Input
                            {...register(`materials.${index}.price`, {valueAsNumber: true})}
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
                <Button
                    iconType="plus"
                    className={styles['add-item']}
                    type="button"
                    onClick={() => append({name: '', count: 1})}
                >
                    Додати матеріал
                </Button>

                <h5>Загальна вартість матеріалів:</h5>
                <p>
                    <Price
                        value={watched?.reduce(
                            (sum, item) => sum + Number(item.price || 0) * Number(item?.count ?? 0),
                            0
                        )}
                    />
                </p>
            </div>
        </div>
    );
};