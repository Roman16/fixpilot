import {FC, useEffect, useState} from "react";
import {useEmployeesList} from "@/hooks/employees/useEmployeesList";
import styles from "@/app/components/forms/OrderForm/orderForm.module.scss";
import {Button, Input} from "@/app/components/ui";
import {Select} from "@/app/components/ui/Select/Select";
import {IEmployee} from "@/types/employee";
import {useFieldArray} from "react-hook-form";
import {IWork} from "@/types/order";


interface WorksProps {
    register: any;
    setValue?: (name: any, value: any) => void;
    watched: any[];
    control: any;
}

export const Works: FC<WorksProps> = ({
                                          register,
                                          setValue,
                                          watched,
                                          control
                                      }) => {
    const {data: employeesData} = useEmployeesList();
    const employees = employeesData?.data || [];

    const {
        fields,
        append,
        remove,
    } = useFieldArray({control, name: "works"});

    const handleAddWork = () => {
        append({name: "", employeeId: watched[0].employeeId})
    }

    return (
        <div className={styles.section}>
            <h3>
                Роботи (послуги)
            </h3>

            {fields.map((field, index) => (
                <div key={field.id} className={styles.dynamicRow}>
                    <div className={styles.rowIndex}>{index + 1}</div>

                    <Input
                        {...register(`works.${index}.name`)}
                        placeholder={`Назва роботи`}
                    />

                    <Select<IEmployee>
                        options={employees.map((e: IEmployee) => ({
                            value: e.id,
                            label: `${e.name} ${e?.role && `(${e.role})`}`,
                            id: e.id
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
                            {...register(`works.${index}.price`, {
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
                    onClick={handleAddWork}
                >
                    Додати роботу
                </Button>

                <h5>Загальна вартість робіт:</h5>
                <p>
                    {watched?.reduce((sum, item) => sum + Number(item.price || 0), 0)} ₴
                </p>
            </div>
        </div>
    );
};