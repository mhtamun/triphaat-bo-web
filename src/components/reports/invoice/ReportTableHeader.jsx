import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
// import theme from '../../../data/theme';

const borderColor = 'rgba(255,255,255,0)';
export const tableHeaderBaseCSS = {
    padding: '8px',
    textAlign: 'center',
    fontStyle: 'bold',
};
export const tableHeaderBorderCSS = {
    borderRightColor: borderColor,
    borderRightWidth: 1,
};

export const tableCSS = {
    container: {
        flexDirection: 'row',
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
    },
    serial: {
        width: '5%',
        ...tableHeaderBaseCSS,
        ...tableHeaderBorderCSS,
        textAlign: 'center',
    },
    description: {
        width: '35%',
        ...tableHeaderBaseCSS,
        ...tableHeaderBorderCSS,
        textAlign: 'center',
    },
    amount: {
        width: '25%',
        ...tableHeaderBaseCSS,
        textAlign: 'center',
    },
};

const styles = StyleSheet.create({
    ...tableCSS,
});

const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.serial}>#</Text>
        <Text style={styles.description}>DESCRIPTION</Text>
        <Text style={styles.description}>EVENT</Text>
        <Text style={styles.amount}>AMOUNT</Text>
    </View>
);

export default InvoiceTableHeader;
