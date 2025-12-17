import {Column, Table} from "@/app/components/ui/Table/Table";
import {IVehicle} from "@/types/vehicles";
import {Button} from "@/app/components/ui";
import styles from '../clients.module.scss'

interface VehiclesTableProps {
    vehicles: IVehicle[];
    onDelete: (vehicleId: string) => void;
}

export const VehiclesTable = ({vehicles, onDelete}: VehiclesTableProps) => {
    const vehicleColumns: Column<IVehicle>[] = [
        {
            key: 'brand',
            label: 'Марка',
        },
        {
            key: 'model',
            label: 'Модель',
        },
        {
            key: 'year',
            label: 'Рік',
        },
        {
            key: 'plate',
            label: 'Номер',
        },
        {
            key: 'vin',
            label: 'VIN',
        },
        {
            key: 'mileage',
            label: 'Пробіг',
            render: value => `${value} км`
        },
        {
            key: 'actions',
            label: '',
            width: '60px',
            render: (_, row) => (<div className={'table-actions'}>
                    <Button
                        onClick={() => onDelete(row.id)}
                        iconType={'delete'}
                    />
                </div>
            )
        },
    ];

    if (!vehicles.length) {
        return <div>Немає транспортних засобів</div>;
    }

    return (<div className={styles.vehiclesBlock}>
            <h3>Гараж</h3>
            <Table<IVehicle>
                columns={vehicleColumns}
                data={vehicles}
                rowKey={v => v.id}
                emptyText="Немає транспорту"
            />
        </div>
    );
};
