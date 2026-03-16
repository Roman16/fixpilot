import styles from "../catalog.module.scss";
import {SupplierBrand} from "@/lib/supplierParser";

interface Props {
    brands: SupplierBrand[];
    isLoading: boolean;
    selectedBrandId: number | null;
    onSelect: (id: number) => void;
}

const BRAND_LOGOS: Record<string, string | null> = {
    "_УНИВЕРСАЛЬНОЕ ПРЕДЛОЖЕНИЕ": null,
    "APRILIA": "/brands/aprilia.svg",
    "ARCTIC CAT ATV": "/brands/arctic-cat.svg",
    "ARCTIC CAT SNOWMOBILES": "/brands/arctic-cat.svg",
    "BAJAJ": "/brands/bajaj.svg",
    "BMW": "/brands/bmw.svg",
    "BOMBARDIER / CAN-AM ATV": "/brands/bombardier.svg",
    "BOMBARDIER SNOWMOBILES (SKI-DOO)": "/brands/bombardier.svg",
    "BUELL": "/brands/buell.svg",
    "CF MOTO ATV": "/brands/cfmoto.svg",
    "CPI": "/brands/bmw.svgnull",
    "DUCATI": "/brands/ducati.svg",
    "GEON": "/brands/bmw.svgnull",
    "GILERA": "/brands/bmw.svgnull",
    "HARLEY-DAVIDSON": "/brands/harley-davidson.svg",
    "HONDA": "/brands/honda.svg",
    "HONDA ATV": "/brands/honda.svg",
    "HUSABERG": "/brands/bmw.svgnull",
    "HUSQVARNA": "/brands/husqvarna.svg",
    "HYOSUNG": "/brands/bmw.svgnull",
    "HYOSUNG ATV": "/brands/bmw.svgnull",
    "INDIAN": "/brands/indian.svg",
    "ITALJET": "/brands/bmw.svgnull",
    "JAWA/CZ": "/brands/bmw.svgnull",
    "KAWASAKI": "/brands/kawasaki.svg",
    "KAWASAKI ATV": "/brands/kawasaki.svg",
    "KEEWAY": "/brands/bmw.svgnull",
    "KTM": "/brands/ktm.svg",
    "KTM ATV": "/brands/ktm.svg",
    "KYMCO": "/brands/bmw.svgnull",
    "KYMCO ATV": "/brands/bmw.svgnull",
    "LIFAN": "/brands/bmw.svgnull",
    "MALAGUTI": "/brands/bmw.svgnull",
    "MBK": "/brands/bmw.svgnull",
    "MOTO GUZZI": "/brands/moto-guzzi.svg",
    "MV AGUSTA": "/brands/mv-agusta.svg",
    "PEUGEOT": "/brands/peugeot.svg",
    "PIAGGIO / VESPA": "/brands/vespa.svg",
    "POLARIS ATV": "/brands/polaris.svg",
    "POLARIS SNOWMOBILE": "/brands/polaris.svg",
    "SPEED GEAR ATV": "/brands/bmw.svgnull",
    "SUZUKI": "/brands/suzuki.svg",
    "SUZUKI ATV": "/brands/suzuki.svg",
    "SYM": "/brands/bmw.svgnull",
    "TRIUMPH": "/brands/triumph.svg",
    "VICTORY": "/brands/bmw.svgnull",
    "YAMAHA": "/brands/yamaha.svg",
    "YAMAHA ATV": "/brands/yamaha.svg",
    "YAMAHA SNOWMOBILE": "/brands/yamaha.svg",
    "EVINRUDE": "/brands/bmw.svgnull",
    "HONDA MARINE": "/brands/honda.svg",
    "JOHNSON": "/brands/bmw.svgnull",
    "KAWASAKI MARINE": "/brands/kawasaki.svg",
    "MERCURY MARINE": "/brands/bmw.svgnull",
    "NISSAN MARINE": "/brands/bmw.svgnull",
    "PARSUN": "/brands/bmw.svgnull",
    "SEA-DOO": "/brands/bmw.svgnull",
    "SUZUKI MARINE": "/brands/suzuki.svg",
    "TOHATSU": "/brands/bmw.svgnull",
    "YAMAHA MARINE": "/brands/yamaha.svg"
};

const getBrandLogo = (name: string): string | null => {
    return `/img${BRAND_LOGOS[name.toUpperCase()]}`;
};

export const BrandStep = ({brands, isLoading, selectedBrandId, onSelect}: Props) => {
    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <span className={styles.step}>01</span>
                <h2>Марка</h2>
                {selectedBrand && <span className={styles.selected}>{selectedBrand.name}</span>}
            </div>

            {isLoading ? (
                <div className={styles.loading}>Завантаження...</div>
            ) : (
                <div className={styles.brandGrid}>
                    {brands.map(brand => {
                        const logo = getBrandLogo(brand.name);

                        return (
                            <button
                                key={brand.id}
                                className={`${styles.brandBtn} ${selectedBrandId === brand.id ? styles.active : ''}`}
                                onClick={() => onSelect(brand.id)}
                            >
                                <img
                                    src={logo || ''}
                                    alt={brand.name}
                                    className={styles.brandLogo}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'
                                    }}
                                />

                                <span className={styles.brandNameLabel}>{brand.name}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};