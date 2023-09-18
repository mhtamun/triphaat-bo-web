import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import ReportTableHeader from './ReportTableHeader';
import ReportTableRow from './ReportTableRow';
import ReportTableFooter from './ReportTableFooter';
// import theme from '../../../data/theme';
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

const InvoiceItemsTable = ({ items, subtotal, discountAmount, advanceAmount, dueAmount, netTotalAmount }) => (
    <View style={styles.container}>
        <View style={styles.tableContainer}>
            <ReportTableHeader />
            <ReportTableRow items={items} />
        </View>
        <View style={styles.accountContainer} wrap={false}>
            <ReportTableFooter title={'SUBTOTAL'} value={subtotal} />
            <ReportTableFooter title={'DISCOUNT AMOUNT'} value={discountAmount} currency={'BDT'} />
            <ReportTableFooter title={'NET TOTAL'} value={netTotalAmount} currency={'BDT'} />
            <ReportTableFooter title={'ADVANCE AMOUNT'} value={advanceAmount} currency={'BDT'} />
            <ReportTableFooter title={'DUE AMOUNT'} value={dueAmount} currency={'BDT'} />
        </View>
    </View>
);

export default InvoiceItemsTable;
