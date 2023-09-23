import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = 'black';
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
    description: {
        width: '60%',
        ...tableHeaderBaseCSS,
        ...tableHeaderBorderCSS,
        textAlign: 'center',
    },
    amount: {
        width: '20%',
        ...tableHeaderBaseCSS,
        ...tableHeaderBorderCSS,
        textAlign: 'center',
    },
};

const styles = StyleSheet.create({
    ...tableCSS,
});

const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>DESCRIPTION</Text>
        <Text style={styles.amount}>NUMBER OF TRAVELER(S)</Text>
        <Text style={styles.amount}>PRICE PER PERSON</Text>
    </View>
);

export default InvoiceTableHeader;
