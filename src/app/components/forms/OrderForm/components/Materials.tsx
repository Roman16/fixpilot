import React from "react";
import styles from "@/app/components/forms/OrderForm/orderForm.module.scss";
import {Button, Input} from "@/app/components/ui";
import {useFieldArray} from "react-hook-form";
import {Price} from "@/app/components/ui/Price/Price";


interface MaterialsProps {
    register: any;
    watched: any[];
    control: any;
}

export const Materials: React.FC<MaterialsProps> = ({
                                                        register,
                                                        watched,
                                                        control
                                                    }) => {
    const {
        fields,
        append,
        remove,
    } = useFieldArray({control, name: "materials"});

    return (
        <div className={styles.section}>
            <h3>Використані матеріали</h3>

            {fields.map((field, index) => (
                <div key={field.id} className={styles.dynamicRow}>
                    <div className={styles.rowIndex}>{index + 1}</div>

                    <Input
                        {...register(`materials.${index}.name`)}
                        placeholder={`Назва матеріалу`}
                    />

                    <Input
                        {...register(`materials.${index}.count`, {
                            valueAsNumber: true
                        })}
                        placeholder={`Кількість`}
                        type="number"
                        className={styles.materialCount}
                    />

                    <div className={styles.priceContainer}>
                        <Input
                            {...register(`materials.${index}.price`, {
                                valueAsNumber: true
                            })}
                            className={styles.price}
                            placeholder="Ціна"
                            type="number"
                            suffix={'₴'}
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
                    iconType={'plus'}
                    className={styles["add-item"]}
                    type="button"
                    onClick={() => append({name: "", count: 1})}
                >
                    Додати матеріал
                </Button>

                <h5>Загальна вартість матеріалів:</h5>
                <p>
                    <Price value={watched?.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item?.count ?? 0)), 0)}/>
                </p>
            </div>
        </div>
    );
};