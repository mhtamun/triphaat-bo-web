import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '93px',
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

const ReportNumber = ({ number, date, status }) => (
    <View style={styles.container}>
        <View style={styles.labelContainer}>
            <Text style={styles.label}>No: </Text>
            <Text style={styles.label}>Date: </Text>
            <Text style={styles.label}>Status: </Text>
        </View>
        <View style={styles.valueContainer}>
            <Text style={styles.value}>{number}</Text>
            <Text style={styles.value}>{date}</Text>
            <Text style={styles.value}>{status}</Text>
        </View>
    </View>
);

export default ReportNumber;
