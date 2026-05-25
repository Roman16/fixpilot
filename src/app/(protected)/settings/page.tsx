'use client';

import {useState} from "react";
import {ProfileForm} from "@/app/components/forms/ProfileForm/ProfileForm";
import {ServiceTemplatesSettingsForm} from "@/app/components/forms/ServiceTemplatesSettingsForm/ServiceTemplatesSettingsForm";
import styles from "./settings.module.scss";

type Tab = 'profile' | 'templates';

const tabs: {id: Tab; label: string}[] = [
    {id: 'profile', label: 'Профіль'},
    {id: 'templates', label: 'Шаблони робіт'},
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    return (
        <div className={styles.page}>
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.content}>
                {activeTab === 'profile' && <ProfileForm />}
                {activeTab === 'templates' && <ServiceTemplatesSettingsForm />}
            </div>
        </div>
    );
}