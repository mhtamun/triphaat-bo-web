import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { tableCSS } from './ReportTableHeader';

const styles = StyleSheet.create({
    container: { ...tableCSS.container, borderBottom: 'none' },
    title: {
        ...tableCSS.description,
        width: '75%',
        textAlign: 'right',
    },
    value: {
        ...tableCSS.amount,
        textAlign: 'left',
    },
});

const InvoiceTableFooter = ({ title, value, multipleBy = 1, currency = 'BDT' }) => (
    <Fragment>
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>
                {!currency
                    ? Number.parseFloat(value).toFixed(2) * multipleBy
                    : `${currency} ${Number.parseFloat(value).toFixed(2) * multipleBy}`}
            </Text>
        </View>
    </Fragment>
);
export default InvoiceTableFooter;
