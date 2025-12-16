"use client"

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import styles from "./dashboard.module.scss";
import {Card} from "@/app/components/Dashbord/components/Card";

const revenueData = [
    {month: "Січ", revenue: 12000, jobs: 17},
    {month: "Лют", revenue: 21000, jobs: 25},
    {month: "Бер", revenue: 8000, jobs: 27},
    {month: "Квіт", revenue: 16000, jobs: 33},
    {month: "Трав", revenue: 25000, jobs: 45},
    {month: "Черв", revenue: 19000, jobs: 48},
];

export const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboardWrapper}>
            <div className={styles.cardList}>
                <Card
                    title={'Клієнтів'}
                    value={'50'}
                />

                <Card
                    title={'Нових замовлень'}
                    value={'50'}
                />

                <Card
                    title={'Загальний прибуток'}
                    value={'10 000 ₴'}
                />
            </div>

            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={600}>
                    <LineChart data={revenueData} margin={{ top: 20, right: 50, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />

                        {/* Ліва вісь для прибутку */}
                        <YAxis yAxisId="left" label={{ value: "Прибуток, грн", angle: -90, position: 'insideLeft' }} />

                        {/* Права вісь для виконаних робіт */}
                        <YAxis yAxisId="right" orientation="right" label={{ value: "Виконані роботи", angle: 90, position: 'insideRight' }} />

                        <Tooltip />
                        <Legend />

                        <Line yAxisId="left" type="monotone" dataKey="revenue" name="Прибуток" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="jobs" name="Виконані роботи" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
