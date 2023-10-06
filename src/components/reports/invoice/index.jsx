import React from 'react';
import { Page, Document, View, StyleSheet } from '@react-pdf/renderer';
import ReportLogo from '../ReportLogo';
import ReportTo from './ReportTo';
import ReportFrom from './ReportFrom';
import ReportTitle from './ReportTitle';
import ReportNumber from './ReportNumber';
import ReportTable from './ReportTable';
import ReportSignature from './ReportSignature';
import _ from 'lodash';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 60,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    logo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    title: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    infoSection: {
        marginTop: '30px',
    },
});

const PurchaseOrderPDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={{ ...styles.header }}>
                <View style={{ ...styles.logo }}>
                    <ReportLogo src={data.logo} />
                </View>
                <View style={{ ...styles.title }}>
                    <ReportTitle title="Invoice" />
                    <ReportNumber {...data.report} />
                </View>
            </View>
            <View style={{ ...styles.header, ...styles.infoSection }}>
                <ReportTo name={data.to.name} address={data.to.address} phone={data.to.phone} email={data.to.email} />
                <ReportFrom
                    name={data.from.name}
                    address={data.from.address}
                    phone={data.from.phone}
                    email={data.from.email}
                />
            </View>
            <ReportTable items={data.items} amount={data.amount} />
            {/* <ReportSignature /> */}
        </Page>
    </Document>
);

export default PurchaseOrderPDF;
