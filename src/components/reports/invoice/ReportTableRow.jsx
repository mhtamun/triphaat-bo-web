import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { tableCSS } from './ReportTableHeader';

const styles = StyleSheet.create({
    ...tableCSS,
});

const ReportTableRow = ({ items }) => {
    const rows = items.map((item, index) => (
        <View style={styles.container} key={index}>
            <Text style={styles.serial}>{index + 1}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.description}>Demo</Text>
            <Text style={styles.amount}>{item.amount.toFixed(2)}</Text>
        </View>
    ));

    return <Fragment>{rows}</Fragment>;
};

export default ReportTableRow;
