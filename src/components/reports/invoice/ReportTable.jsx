import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import ReportTableHeader from './ReportTableHeader';
import ReportTableRow from './ReportTableRow';
import ReportTableFooter from './ReportTableFooter';
import _ from 'lodash';

const borderColor = '#000000';

const styles = StyleSheet.create({
    container: {
        borderColor,
        borderWidth: 1,
        marginTop: '30px',
        width: '100%',
    },
    tableContainer: {},
    accountContainer: {},
});

const InvoiceItemsTable = ({ items, amount }) => (
    <View style={styles.container}>
        <View style={styles.tableContainer}>
            <ReportTableHeader />
            <ReportTableRow items={items} />
        </View>
        <View style={styles.accountContainer} wrap={false}>
            <ReportTableFooter title={'AMOUNT'} value={amount} currency={'BDT'} />
        </View>
    </View>
);

export default InvoiceItemsTable;
