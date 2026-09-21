'use client';

import {IVehicle} from "@/types/vehicles";
import {Button} from "@/app/components/ui";
import styles from '../clients.module.scss'
import {Loader} from "@/app/components/ui/Loader/Loader";
import {useModalStore} from "@/store/modalStore";
import {IClient} from "@/types/client";
import {useRouter} from 'next/navigation';
import ROUTES from "@/config/routes";
import clientsService from "@/services/clientsService";
import toast from "react-hot-toast";
import clsx from "clsx";
import {CalendarDays, Gauge, Hash} from "lucide-react";

interface VehiclesTableProps {
  vehicles: IVehicle[];
  onDelete: (vehicleId: string) => void;
  deletingId: string | null;
  client: IClient | undefined;
}

export const Vehicles = ({vehicles, onDelete, deletingId, client}: VehiclesTableProps) => {
  const openModal = useModalStore(state => state.openModal);
  const router = useRouter();

  const handleRedirect = (id: string) => {
    router.push(`${ROUTES.ORDERS}?vehicleId=${id}`)
  }

  const getShareUrl = async (vehicleId: string) => {
    const {token} = await clientsService.shareVehicle(vehicleId);
    return `${window.location.origin}/share/${token}`;
  }

  const handleOpenHistory = async (vehicleId: string) => {
    // вкладку відкриваємо одразу, інакше браузер заблокує попап після await
    const tab = window.open('', '_blank');

    try {
      const url = await getShareUrl(vehicleId);
      if (tab) tab.location.href = url;
    } catch {
      tab?.close();
    }
  }

  const handleCopyLink = async (vehicleId: string) => {
    try {
      const url = await getShareUrl(vehicleId);
      await navigator.clipboard.writeText(url);
      toast.success('Посилання скопійоване');
    } catch {
      // помилку запиту вже показав baseService
    }
  }

  return (<div className={styles.vehiclesBlock}>
      <h3>
        {vehicles.length ? 'Гараж' : 'Немає транспортних засобів'}
        <Button iconType={'plus'} onClick={() => openModal('vehiclesModal', {id: client?.id ?? ''})}>
          Додати
        </Button>
      </h3>

      <div className={styles.list}>
        {vehicles.map((vehicle: IVehicle) => (<div
          key={vehicle.id}
          onClick={() => handleRedirect(vehicle.id)}
          className={styles.vehicleItem}
        >
          <div className={styles.name}>
            <h4 title={`${vehicle.brand} ${vehicle.model}`}>{vehicle.brand} {vehicle.model}</h4>
            {vehicle.plate && <span className={styles.plate}>{vehicle.plate}</span>}
          </div>

          <div className={styles.details}>
            <div className={styles.param}>
              <span className={styles.paramLabel}><CalendarDays/> Рік</span>
              <b>{vehicle.year || '—'}</b>
            </div>

            <div className={styles.param}>
              <span className={styles.paramLabel}><Gauge/> Пробіг</span>
              <b>{vehicle.mileage != null ? `${vehicle.mileage.toLocaleString('uk-UA')} км` : '—'}</b>
            </div>

            <div className={clsx(styles.param, styles.vin)}>
              <span className={styles.paramLabel}><Hash/> VIN</span>
              <b>{vehicle.vin || '—'}</b>
            </div>
          </div>

          <div className={styles.vehicleActions}>
            <div className={styles.shareActions}>
              <Button
                iconType={'external'}
                title={'Відкрити історію робіт для клієнта'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenHistory(vehicle.id)
                }}
              >
                Історія
              </Button>

              <Button
                iconType={'link'}
                title={'Скопіювати посилання для клієнта'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyLink(vehicle.id)
                }}
              >
                Посилання
              </Button>
            </div>

            <div className={styles.manageActions}>
              <Button
                iconType={'edit'}
                title={'Редагувати'}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('vehiclesModal', {vehicle})
                }}
              />

              <Button
                iconType={'delete'}
                title={'Видалити'}
                className={styles.danger}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(vehicle.id)
                }}
              />
            </div>
          </div>

          {deletingId === vehicle.id && <Loader className={styles.vehicleLoader}/>}
        </div>))}
      </div>
    </div>
  );
};
