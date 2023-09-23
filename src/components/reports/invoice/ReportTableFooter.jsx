import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { tableCSS } from './ReportTableHeader';

const styles = StyleSheet.create({
    container: { ...tableCSS.container, borderBottom: 'none' },
    title: {
        ...tableCSS.description,
        width: '60%',
        textAlign: 'right',
    },
    value: {
        ...tableCSS.amount,
        width: '40%',
        textAlign: 'left',
    },
});

const ReportTableFooter = ({ title, value, currency = 'BDT' }) => (
    <Fragment>
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{currency + ' ' + value}</Text>
        </View>
    </Fragment>
);
export default ReportTableFooter;
