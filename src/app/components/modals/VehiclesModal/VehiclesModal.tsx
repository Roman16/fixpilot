import {Modal} from "@/app/components/ui/Modal/Modal";
import styles from './vehiclesModal.module.scss'
import {VehicleForm} from "@/app/components/forms/VehicleForm/VehicleForm";
import {useModalStore} from "@/store/modalStore";
import React, {FC} from "react";
import {useForm} from "react-hook-form";
import {Button} from "@/app/components/ui";
import {useClientsMutations} from "@/hooks/clients/useClientsMutations";
import {IVehicle} from "@/types/vehicles";

interface VehiclesModalProps {
    modalId: string;
    modalProps?: { id?: string, vehicle?: IVehicle };
}

interface VehicleFormValues {
    vehicle: IVehicle;
}

export const VehiclesModal: FC<VehiclesModalProps> = ({
                                                          modalId,
                                                          modalProps
                                                      }) => {
    const {closeModal} = useModalStore()
    const {createVehicle, updateVehicle} = useClientsMutations()
    const isPending = createVehicle.isPending || updateVehicle.isPending;

    const {
        control,
        register,
        handleSubmit,
        setValue
    } = useForm<VehicleFormValues>({
        defaultValues: {
            vehicle: {...modalProps?.vehicle}
        }
    });

    const submitHandler = async (data: VehicleFormValues) => {
        try {
            if (modalProps?.vehicle) {
                await updateVehicle.mutateAsync({
                    vehicle: data.vehicle
                })
            }

            if (modalProps?.id) {
                await createVehicle.mutateAsync({
                    vehicle: data.vehicle,
                    clientId: modalProps.id
                });
            }

            onClose()
        } catch (e) {
            console.log(e);
        }

    };

    const onClose = () => closeModal(modalId)


    return (<Modal
        headerText={modalProps?.vehicle ? `${modalProps.vehicle.brand} ${modalProps.vehicle.model}` : 'Новий транспортний засіб'}
        className={styles.modal}
    >
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
            <VehicleForm
                prefix="vehicle"
                register={register}
                setValue={setValue}
                control={control}
            />

            <div className={styles.actions}>
                <Button
                    type={'button'}
                    onClick={onClose}
                    disabled={isPending}
                >
                    Скасувати
                </Button>

                <Button
                    type="submit"
                    variant={'primary'}
                    isLoading={isPending}
                >
                    Зберегти
                </Button>
            </div>
        </form>
    </Modal>)
}