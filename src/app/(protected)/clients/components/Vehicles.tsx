import {IVehicle} from "@/types/vehicles";
import {Button} from "@/app/components/ui";
import styles from '../clients.module.scss'

interface VehiclesTableProps {
    vehicles: IVehicle[];
    onDelete: (vehicleId: string) => void;
}

export const Vehicles = ({vehicles, onDelete}: VehiclesTableProps) => {
    if (!vehicles.length) {
        return <div>Немає транспортних засобів</div>;
    }

    return (<div className={styles.vehiclesBlock}>
            <h3>
                Гараж
                <Button iconType={'plus'}>
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

                    <Button
                        className={styles.deleteBtn}
                        iconType={'delete'}
                        onClick={() => onDelete(vehicle.id)}
                    />
                </div>))}
            </div>
        </div>
    );
};
