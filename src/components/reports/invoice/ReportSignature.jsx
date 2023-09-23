import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = 'black';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 100,
    },
    text: {
        borderTopColor: borderColor,
        borderTopWidth: 1,
        paddingTop: 10,
    },
});

const InvoiceThankYouMsg = () => (
    <View style={styles.container}>
        <Text style={styles.text}>Customer Sign</Text>
        <Text style={styles.text}>Issued By</Text>
    </View>
);

export default InvoiceThankYouMsg;
