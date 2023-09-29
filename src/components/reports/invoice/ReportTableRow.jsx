import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { tableCSS } from './ReportTableHeader';

const styles = StyleSheet.create({
    ...tableCSS,
});

const ReportTableRow = ({ items }) => {
    const rows = items.map((item, index) => (
        <View style={styles.container} key={index}>
            <Text style={styles.description}>
                <Text>{item.description.tripName}</Text>
                {', '}
                <Text>{item.description.tripLocation}</Text>
                {', '}
                <Text>{item.description.tripDuration}</Text>
            </Text>
            <Text style={styles.amount}>{item.numberOfTravelers}</Text>
            <Text style={styles.amount}>{item.pricePerPerson}</Text>
        </View>
    ));

    return <Fragment>{rows}</Fragment>;
};

export default ReportTableRow;
