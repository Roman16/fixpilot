import React from "react"
import {Page, Text, View, Document, StyleSheet, Font} from '@react-pdf/renderer'
import {IMaterial, IWork} from "@/types/order";
import {IClient} from "@/types/client";
import {IVehicle} from "@/types/vehicles";

Font.register({
    family: "Arimo",
    fonts: [
        { src: "/fonts/arimo/Arimo-Regular.ttf", fontWeight: "normal" },
        { src: "/fonts/arimo/Arimo-Bold.ttf", fontWeight: "bold" },
    ],
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        fontFamily: 'Arimo',
        padding: '10px 20px',
        fontSize: '10px',
    },
    date: {
        fontSize: '8px',
        marginBottom: '20px'
    },
    title: {
        fontSize: '16px',
        fontWeight: 700,
        marginBottom: '20px'
    },
    orderName: {
        fontSize: '14px',
        fontWeight: 700,
        marginBottom: '20px'
    },
    contact: {
        fontSize: '10px',
    },
    workTime: {
        fontSize: '10px',
        margin: '20px 0 20px'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detailsRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    detailsCol: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    img: {
        width: '120px',
        height: '120px'
    },
    boldText: {
        fontWeight: 700
    },
    orderDetails: {
        marginBottom: '5px'
    },
    table: {
        border: '1px solid #000',
        borderBottom: 0
    },
    tableHeader: {
        fontWeight: 700,
        fontSize: '12px',
        borderBottom: '1px solid #000',
        padding: '3px 5px'
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid #000',
    },
    rowIndex: {
        width: '40px',
        borderRight: '1px solid #000',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px 5px'
    },
    rowName: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        borderRight: '1px solid #000',
        padding: '3px 5px'
    },
    rowPrice: {
        maxWidth: '100px',
        padding: '3px 5px',
        flex: '1',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    totalLabel: {
        flex: '1',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRight: '1px solid #000',
        padding: '0 5px 0 0'
    }

})

export const moneyMask = (value: number) => {
    let re = '\\d(?=(\\d{' + 3 + '})+' + '$' + ')'
    return (+value).toFixed(Math.max(0)).replace(new RegExp(re, 'g'), '$& ')
}

interface PdfTemplateProps {
    order: {
        orderNumber: number,
        client?: IClient | null,
        vehicle?: IVehicle | null,
        works?: IWork[],
        materials?: IMaterial[],
        mileage?: number | null,
        createdAt?: string,
    }
}

export const PdfTemplate: React.FC<PdfTemplateProps> = ({order}) => {
    const worksTotal = order.works?.reduce((sum, currentValue) => sum + +(currentValue.price || 0), 0) || 0,
        materialsTotal = order.materials?.reduce((sum, currentValue) => sum + +(currentValue.price || 0), 0) || 0

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.date}>
                    <Text>{order.createdAt}</Text>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text style={styles.title}>CRASITSKOGO</Text>

                        <View style={styles.contact}>
                            <Text>Телефон: +38 (093) 545-45-02</Text>
                            {/* <Text>Instagram: @moto.house.kiev</Text> */}
                        </View>

                        <View style={styles.workTime}>
                            <Text style={{textDecoration: 'underline'}}>Графік роботи: </Text>
                            <Text>Пн-Пт з 10 до 18 </Text>
                            <Text>Сб з 10 до 16</Text>
                        </View>
                    </View>

                    {/* <View>
                        <Image style={styles.img} src={logo}/>
                    </View> */}
                </View>

                <View style={{textAlign: 'center'}}>
                    <Text style={{...styles.orderName, textDecoration: 'underline'}}>
                        Наряд-замовлення № {order.orderNumber}
                    </Text>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.detailsCol}>
                        <Text style={styles.orderDetails}>
                            <Text
                                style={styles.boldText}>Клієнт:</Text> {order.client?.name || ''} {order.client?.phone || ''}
                        </Text>

                        <Text style={styles.orderDetails}>
                            <Text style={styles.boldText}>Транспортний
                                засіб:</Text> {order.vehicle?.brand} {order.vehicle?.model}
                        </Text>

                        <Text style={styles.orderDetails}>
                            <Text style={styles.boldText}>Пробіг:</Text> {order.mileage} км
                        </Text>

                    </View>

                    <View style={styles.detailsCol}>
                        <Text style={styles.orderDetails}>
                            <Text style={styles.boldText}>Держ. №:</Text> {order.vehicle?.plate || ''}
                        </Text>

                        <Text style={styles.orderDetails}>
                            <Text style={styles.boldText}>VIN код:</Text> {order.vehicle?.vin || ''}
                        </Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text>Перелік виконаних робіт:</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.rowIndex}>
                            <Text style={{...styles.boldText}}>№</Text>
                        </View>

                        <Text style={{...styles.rowName, ...styles.boldText}}>Найменування робіт</Text>

                        <View style={styles.rowPrice}>
                            <Text style={{...styles.boldText}}>Сума, грн</Text>
                        </View>
                    </View>

                    {order.works?.map((item, index) => <TableRow
                        key={index}
                        index={index}
                        name={item.name || ''}
                        price={item.price || 0}
                    />)}

                    <View style={styles.tableRow}>
                        <View style={styles.totalLabel}>
                            <Text style={{...styles.boldText}}>
                                Всього за виконані роботи:
                            </Text>
                        </View>

                        <View style={styles.rowPrice}>
                            <Text style={{...styles.boldText}}>{moneyMask(worksTotal)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text>Використані запчастини (матеріали), що оплачуються замовником:</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.rowIndex}>
                            <Text style={{...styles.boldText}}>№</Text>
                        </View>
                        <Text style={{...styles.rowName, ...styles.boldText}}>Найменування запчастини (матеріалу)</Text>

                        <View style={styles.rowPrice}>
                            <Text style={{...styles.boldText}}>Сума, грн</Text>
                        </View>
                    </View>

                    {order.materials?.map((item, index) => <TableRow
                        key={index}
                        index={index}
                        name={item.name || ''}
                        price={item.price || 0}
                    />)}

                    <View style={styles.tableRow}>
                        <View style={styles.totalLabel}>
                            <Text style={{...styles.boldText}}>
                                Всього за використані запчастини (матеріали):
                            </Text>
                        </View>

                        <View style={styles.rowPrice}>
                            <Text style={{...styles.boldText}}>{moneyMask(materialsTotal)}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.totalLabel}>
                            <Text style={{...styles.boldText}}>
                                Всього до сплати:
                            </Text>
                        </View>

                        <View style={styles.rowPrice}>
                            <Text style={{...styles.boldText}}>
                                {moneyMask(materialsTotal + worksTotal)}
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>)
}

const TableRow = ({index, name = '', price = 0}: { index: number, name: string, price: number }) => <View
    style={styles.tableRow}
>
    <View style={styles.rowIndex}>
        <Text>{index + 1}</Text>
    </View>
    <Text style={styles.rowName}>{name}</Text>

    <View style={styles.rowPrice}>
        <Text>{moneyMask(price)}</Text>
    </View>
</View>