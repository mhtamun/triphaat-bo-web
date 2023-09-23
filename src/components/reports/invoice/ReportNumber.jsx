import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '170px',
        marginTop: '10px',
    },
    labelContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    valueContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    label: {
        fontStyle: 'bold',
    },
    value: { fontStyle: 'bold' },
});

const ReportNumber = ({
    invoiceNumber,
    invoiceDate,
    bookingStatus,
    bookingDate,
    paymentMethod,
    paymentStatus,
    paymentDate,
}) => (
    <View style={styles.container}>
        <View style={styles.labelContainer}>
            <Text style={styles.label}>Invoice No:</Text>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.label}>Booking Status:</Text>
            <Text style={styles.label}>Booking Date:</Text>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.label}>Payment Date:</Text>
        </View>
        <View style={styles.valueContainer}>
            <Text style={styles.value}>{invoiceNumber}</Text>
            <Text style={styles.value}>{invoiceDate}</Text>
            <Text style={styles.value}>{bookingStatus}</Text>
            <Text style={styles.value}>{bookingDate}</Text>
            <Text style={styles.value}>{paymentMethod}</Text>
            <Text style={styles.value}>{paymentStatus}</Text>
            <Text style={styles.value}>{paymentDate}</Text>
        </View>
    </View>
);

export default ReportNumber;
