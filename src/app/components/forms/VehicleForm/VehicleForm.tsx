import {Input} from "@/app/components/ui";
import styles from "./vehicleForm.module.scss";
import React, {useEffect, useState} from "react";
import {Autocomplete} from "@/app/components/ui/Autocomplete/Autocomplete";
import {useWatch} from "react-hook-form";

interface VehicleFormProps {
    prefix?: string;
    register: any;
    setValue: any;
    control: any;
}

interface Brand {
    brandName: string;
    models: string[];
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
                                                            prefix = "vehicle",
                                                            register,
                                                            setValue,
                                                            control,
                                                        }) => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);
    const [modelOptions, setModelOptions] = useState<string[]>([]);

    const brandValue = useWatch({
        control,
        name: `${prefix}.brand`
    });

    const modelValue = useWatch({
        control,
        name: `${prefix}.model`
    });

    useEffect(() => {
        fetch('/data/moto-brands.json')
            .then(res => res.json())
            .then(data => {
                setBrands(data)
                setBrandOptions(data.map((b: Brand) => b.brandName));
            })
            .catch(console.error);
    }, []);

    const handleSelectBrand = (brand: string) => {
        setValue(`${prefix}.brand`, brand);

        const brandObj = brands.find(
            b => b.brandName.toLowerCase() === brand.toLowerCase()
        );

        setModelOptions(brandObj?.models || []);
        setValue(`${prefix}.model`, "");
    };

    const handleSelectModel = (model: string) => {
        setValue(`${prefix}.model`, model);
    };

    return (
        <div className={styles.vehicleWrap}>
            <h3 className={styles.groupTitle}>
                Транспортний засіб
            </h3>

            <div className={styles.row}>
                <Autocomplete
                    label="Марка"
                    placeholder="BMW"
                    value={brandValue || ""}
                    onChange={handleSelectBrand}
                    suggestions={brandOptions}
                    openOnFocus={true}
                />

                <Autocomplete
                    label="Модель"
                    placeholder="S1000RR"
                    value={modelValue || ""}
                    onChange={handleSelectModel}
                    suggestions={modelOptions}
                    openOnFocus={true}
                />
            </div>

            <div className={styles.row}>
                <Input
                    placeholder={'АА 1111 АА'}
                    label={'Номерний знак'}
                    {...register(`${prefix}.plate`)}
                />

                <Input
                    type={'number'}
                    placeholder={'69000'}
                    label={'Пробіг'}
                    {...register(`${prefix}.mileage`)}
                />
            </div>

            <Input
                placeholder={'JWJF353664JBB36RT'}
                label={'VIN'}
                {...register(`${prefix}.vin`)}
            />
        </div>
    );
};
