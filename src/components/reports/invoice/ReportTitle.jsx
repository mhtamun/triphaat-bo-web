import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
// import theme from '../../../data/theme';

const styles = StyleSheet.create({
    container: {
        paddingLeft: '10px',
        paddingTop: '10px',
        paddingRight: '10px',
        backgroundColor: 'red',
    },
    title: {
        fontSize: 18,
        color: 'black',
        textTransform: 'uppercase',
    },
});

const Title = ({ title }) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

export default Title;
