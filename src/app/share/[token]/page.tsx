import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Wrench, Package, MapPin, Phone, Gauge, ChevronDown} from "lucide-react";
import {getPublicVehicleHistory} from "@/lib/getPublicVehicleHistory";
import {Price} from "@/app/components/ui/Price/Price";
import styles from "./share.module.scss";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {token} = await params;
    const history = await getPublicVehicleHistory(token);

    return {
        title: history ? `${history.vehicle.brand} ${history.vehicle.model} — історія обслуговування` : 'Історія обслуговування',
        robots: {index: false, follow: false},
    };
}

const formatDate = (iso: string | null) =>
    iso ? new Intl.DateTimeFormat('uk-UA', {day: '2-digit', month: 'long', year: 'numeric'}).format(new Date(iso)) : '';

const formatKm = (value: number) => `${new Intl.NumberFormat('uk-UA').format(value)} км`;

export default async function SharePage({params}: PageProps) {
    const {token} = await params;
    const history = await getPublicVehicleHistory(token);

    if (!history) notFound();

    const {service, vehicle, orders} = history;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.service}>
                    {service.logo && <img src={service.logo} alt={service.name} className={styles.logo}/>}

                    <div>
                        <h2>{service.name || 'Сервіс'}</h2>
                        {service.address && <p><MapPin size={14}/> {service.address}</p>}
                        {service.phone && <p><Phone size={14}/> <a href={`tel:${service.phone}`}>{service.phone}</a></p>}
                    </div>
                </header>

                <section className={styles.vehicle}>
                    <span className={styles.label}>Історія обслуговування</span>
                    <h1>{vehicle.brand} {vehicle.model}</h1>

                    <dl>
                        {vehicle.year && <div><dt>Рік</dt><dd>{vehicle.year}</dd></div>}
                        {vehicle.plate && <div><dt>Номер</dt><dd>{vehicle.plate}</dd></div>}
                        {vehicle.vin && <div><dt>VIN</dt><dd>{vehicle.vin}</dd></div>}
                        {vehicle.mileage != null && <div><dt>Пробіг</dt><dd>{formatKm(vehicle.mileage)}</dd></div>}
                    </dl>
                </section>

                {orders.length === 0 && <p className={styles.empty}>Виконаних робіт поки немає</p>}

                <ol className={styles.timeline}>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <details className={styles.order}>
                                <summary>
                                    <div className={styles.orderInfo}>
                                        <time>{formatDate(order.date)}</time>
                                        {order.mileage != null && <span><Gauge size={14}/> {formatKm(order.mileage)}</span>}
                                    </div>

                                    <b className={styles.orderTotal}><Price value={order.worksTotal + order.materialsTotal}/></b>
                                    <ChevronDown size={18} className={styles.chevron}/>
                                </summary>

                                <div className={styles.orderBody}>
                                    {order.works.length === 0 && order.materials.length === 0 && (
                                        <p className={styles.empty}>Деталі не вказані</p>
                                    )}

                                    {order.works.length > 0 && (
                                        <div className={styles.group}>
                                            <h3><Wrench size={16}/> Виконані роботи</h3>
                                            <ul>
                                                {order.works.map((work, i) => (
                                                    <li key={i}>
                                                        {work.name}
                                                        <span className={styles.price}><Price value={work.price}/></span>
                                                    </li>
                                                ))}
                                                <li className={styles.total}>
                                                    Всього за роботи
                                                    <span className={styles.price}><Price value={order.worksTotal}/></span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    {order.materials.length > 0 && (
                                        <div className={styles.group}>
                                            <h3><Package size={16}/> Матеріали</h3>
                                            <ul>
                                                {order.materials.map((m, i) => (
                                                    <li key={i}>
                                                        {m.name}
                                                        <span className={styles.count}>× {m.count}</span>
                                                        <span className={styles.price}><Price value={m.price * m.count}/></span>
                                                    </li>
                                                ))}
                                                <li className={styles.total}>
                                                    Всього за матеріали
                                                    <span className={styles.price}><Price value={order.materialsTotal}/></span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </details>
                        </li>
                    ))}
                </ol>
            </div>
        </main>
    );
}
