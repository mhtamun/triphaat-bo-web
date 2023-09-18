import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
// import theme from 'data/theme';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        maxWidth: '40%',
    },
    title: {
        fontSize: 14,
        color: 'black',
        textTransform: 'uppercase',
    },
    subtitle: { fontSize: 12, textTransform: 'uppercase' },
});

const To = ({ name, address, phone, email }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Invoice To</Text>
        <Text style={styles.subtitle}>{name}</Text>
        <Text>{address}</Text>
        <Text>{'P: ' + phone}</Text>
        <Text>{'E: ' + email}</Text>
    </View>
);

export default To;
