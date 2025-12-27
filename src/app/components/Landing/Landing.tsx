import {Wrench, CheckCircle2, LayoutDashboard, Users, Zap, ShieldCheck} from "lucide-react";
import Link from "next/link";
import {Button} from "@/app/components/ui";
import './landing.scss'
import Image from 'next/image';

export const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar__container">
                    <div className="navbar__logo">
                        Garage<span>OS</span>
                    </div>

                    <div className="navbar__links">
                        <Link href="/login">
                            Вхід
                        </Link>

                        <Link href="/registration">
                            <Button>Почати безкоштовно</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero__bg">
                    {/*<Image*/}
                    {/*    src="/img/landing_bg.webp"*/}
                    {/*    alt="Garage service for cars and motorcycles"*/}
                    {/*    fill*/}
                    {/*    priority*/}
                    {/*/>*/}
                    <div className="hero__bg__blur"/>
                </div>

                <div className="hero__container">
                    <div className="hero__badge">
                        Майбутнє управління автосервісом вже тут
                    </div>

                    <h1 className="hero__title">
                        Керуйте своїм сервісом на повну потужність з <span className="text-primary">GarageOS</span>
                    </h1>

                    <p className="hero__description">
                        Професійна SaaS платформа для авто та мото сервісів. Автоматизація клієнтів, замовлень та
                        розрахунку зарплат в одному місці.
                    </p>

                    <div className="hero__actions">
                        <Link href="/login">
                            Спробувати безкоштовно
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="features__container">
                    <div className="features__title">
                        <h2>Все необхідне для вашого бізнесу</h2>
                        <p>GarageOS створений для того, щоб ви могли фокусуватися на ремонті, а не на паперах.</p>
                    </div>

                    <div className="features__list">
                        {[
                            {
                                icon: Users,
                                title: "Управління клієнтами",
                                desc: "Повна історія автомобілів, контактів та звернень клієнтів в одній базі."
                            },
                            {
                                icon: LayoutDashboard,
                                title: "Наряд-замовлення",
                                desc: "Створюйте детальні замовлення, додавайте роботи та запчастини за лічені секунди."
                            },
                            {
                                icon: Zap,
                                title: "Розрахунок зарплат",
                                desc: "Автоматичний підрахунок комісійних для майстрів на основі виконаних робіт."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Безпека даних",
                                desc: "Ваша інформація надійно захищена та доступна з будь-якого пристрою 24/7."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Прозорість",
                                desc: "Зручні статуси замовлень та історія виплат працівникам для повного контролю."
                            },
                            {
                                icon: Wrench,
                                title: "Гнучкість",
                                desc: "Налаштовуйте платформу під свій сервіс: власні комісії, логотипи та майстри."
                            },
                        ].map((f, i) => (
                            <div key={i} className="features__list__card">
                                <i>
                                    <f.icon className="h-6 w-6 text-primary"/>
                                </i>
                                <h4>{f.title}</h4>
                                <p className="text-muted-foreground">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <h4 className="footer__logo">
                    GarageOS
                </h4>

                <p>© 2025 GarageOS. Всі права захищені.</p>
            </footer>
        </div>
    );
}