import {IVehicle} from "@/types/vehicles";
import {Button} from "@/app/components/ui";
import styles from '../clients.module.scss'
import {Loader} from "@/app/components/ui/Loader/Loader";
import {useModalStore} from "@/store/modalStore";
import {IClient} from "@/types/client";

interface VehiclesTableProps {
    vehicles: IVehicle[];
    onDelete: (vehicleId: string) => void;
    deletingId: string | null;
    client: IClient | undefined;
}

export const Vehicles = ({vehicles, onDelete, deletingId, client}: VehiclesTableProps) => {
    const openModal = useModalStore(state => state.openModal);

    return (<div className={styles.vehiclesBlock}>
            <h3>
                {vehicles.length ? 'Гараж' : 'Немає транспортних засобів'}
                <Button iconType={'plus'} onClick={() => openModal('vehiclesModal', {id: client?.id ?? ''})}>
                    Додати
                </Button>
            </h3>

            <div className={styles.list}>
                {vehicles.map((vehicle: IVehicle) => (<div className={styles.vehicleItem}>
                    <div className={styles.name}>
                        <h4>{vehicle.brand} {vehicle.model}</h4>
                        <span>{vehicle.plate}</span>
                    </div>

                    <div className={styles.details}>
                        <p>Рік: {vehicle.year}</p>
                        <p>Пробіг: {vehicle.mileage} км</p>
                        <p>VIN: {vehicle.vin}</p>
                    </div>

                    <div className={styles.vehicleActions}>
                        <Button
                            iconType={'edit'}
                            onClick={() => openModal('vehiclesModal', {vehicle})}
                        />

                        <Button
                            iconType={'delete'}
                            onClick={() => onDelete(vehicle.id)}
                        />
                    </div>

                    {deletingId === vehicle.id && <Loader className={styles.vehicleLoader}/>}
                </div>))}
            </div>
        </div>
    );
};
