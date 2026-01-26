import styles from "./orderForm.module.scss";
import {useForm} from "react-hook-form";
import {IMaterial, IOrder, IWork} from "@/types/order";
import React, {FC, useState} from "react";
import {ClientAutocomplete} from "@/app/components/ClientAutocomplete/ClientAutocomplete";
import {Button, Input} from "@/app/components/ui";
import {IVehicle} from "@/types/vehicles";
import {Select} from "@/app/components/ui/Select/Select";
import {pdf} from "@react-pdf/renderer";
import {PdfTemplate} from "@/utils/pdf/PdfTemplate";
import {IClient} from "@/types/client";
import dayjs from "dayjs";
import {Works} from "@/app/components/forms/OrderForm/components/Works";
import {Materials} from "@/app/components/forms/OrderForm/components/Materials";
import {useProfile} from "@/hooks/profile/useProfile";
import {useModalStore} from "@/store/modalStore";
import {Price} from "@/app/components/ui/Price/Price";

interface OrderFormProps {
    onSubmit: (data: any) => void;
    onClose: () => void;
    order?: IOrder | null;
    loading: boolean;
}

interface FormValues {
    clientId: string | null;
    client: IClient | null;
    vehicleId: string | null;
    vehicle: IVehicle | null;
    mileage?: number | null;
    works: IWork[];
    materials: IMaterial[];
}

export const OrderForm: FC<OrderFormProps> = ({order, onSubmit, onClose, loading}) => {
    const openModal = useModalStore((state) => state.openModal);
    const {data: profile} = useProfile();
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);

    const {register, handleSubmit, setValue, watch, control} = useForm<FormValues>({
        defaultValues: {
            clientId: order?.clientId ?? null,
            client: order?.client ?? null,
            vehicleId: order?.vehicleId ?? null,
            vehicle: order?.vehicle ?? null,
            mileage: order?.mileage ?? null,
            works: order?.works ?? [{}],
            materials: order?.materials ?? [],
        },
    });

    const selectedClientId = watch("clientId");
    const selectedVehicleId = watch("vehicleId");

    const watchedWorks = watch("works");
    const watchedMaterials = watch("materials");

    const vehicleOptions = vehicles.map((v: IVehicle) => ({
        ...v,
        label: `${v.brand} ${v.model} ${v?.plate && `(${v.plate})`}`,
        value: v.id
    }));

    const downloadPdfHandler = async () => {
        const formValues = watch();

        const blob = await pdf(
            <PdfTemplate
                order={{
                    ...formValues,
                    createdAt: order?.createdAt || dayjs().toString(),
                    orderNumber: order?.orderNumber || 666
                }}
                profile={profile}
            />
        ).toBlob();

        const fileName = `Наряд-замовлення_${formValues.vehicle?.brand || ""}_${formValues.vehicle?.plate || ""}.pdf`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.generalInfo}>
                <div className={styles.clientRow}>
                    <ClientAutocomplete
                        disabled={!!order?.id}
                        value={selectedClientId}
                        onChange={(client) => {
                            const vehicle = client?.vehicles?.[0] || null;
                            setValue("clientId", client?.id || '')
                            setValue("client", client || null)
                            setValue("vehicleId", vehicle?.id ?? null)
                            setValue("mileage", vehicle?.mileage ?? null)
                            setVehicles(client?.vehicles || [])
                        }}
                        onSetVehicles={(arr = []) => setVehicles(arr)}
                    />

                    <Button
                        type={'button'}
                        iconType={'addUser'}
                        onClick={() => openModal('clientModal')}
                    />
                </div>

                <div className={styles.clientRow}>
                    <Select<IVehicle>
                        label="Транспортний засіб"
                        options={vehicleOptions}
                        disabled={!selectedClientId || !!order?.id}
                        value={order?.id ? `${order.vehicle?.brand} ${order.vehicle?.model} ${order.vehicle?.plate && `(${order.vehicle.plate})`}` : selectedVehicleId}
                        onChange={(id, vehicle) => {
                            setValue("vehicleId", id)
                            setValue("mileage", vehicle.mileage)
                            setValue("vehicle", vehicle)
                        }}
                    />
                    <Button
                        disabled={!selectedClientId || !!order?.id}
                        type={'button'}
                        iconType={'addVehicle'}
                        onClick={() => openModal('vehiclesModal', {id: selectedClientId})}
                    />
                </div>


                <Input
                    label="Пробіг"
                    {...register("mileage", {
                        valueAsNumber: true
                    })}
                    suffix={'км'}
                    disabled={!selectedVehicleId}
                />
            </div>

            <div className={styles.col}>
                <Works
                    control={control}
                    register={register}
                    watched={watchedWorks}
                    setValue={setValue}
                />

                <Materials
                    control={control}
                    register={register}
                    watched={watchedMaterials}
                />
            </div>

            <div className={styles.actions}>
                <h3>
                    Разом до
                    сплати: <Price value={watchedMaterials.reduce((sum, item) => sum + Number(item.price || 0), 0) + watchedWorks.reduce((sum, item) => sum + Number(item.price || 0), 0)}/>
                </h3>

                <Button
                    type="button"
                    iconType={'print'}
                    onClick={downloadPdfHandler}
                />

                {order?.status !== 'completed' && order?.status !== 'archived' && <>
                  <Button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Скасувати
                  </Button>

                    {order?.id && <Button
                      type={'button'}
                      variant="primary"
                      isLoading={loading}
                      onClick={() => onSubmit({...order, status: 'completed'})}
                    >
                      Виконано
                    </Button>}

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                  >
                    Зберегти
                  </Button>
                </>}
            </div>
        </form>
    );
};