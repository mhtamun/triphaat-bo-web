import React from 'react';
import { Image, View, StyleSheet } from '@react-pdf/renderer';
// import logo from '../../assets/icons/logo.png';

const styles = StyleSheet.create({
    logo: {
        width: 'auto',
        height: '40',
        marginBottom: 6,
    },
});

const ReportLogo = () => <View>{/* <Image style={styles.logo} src={logo} /> */}</View>;

export default ReportLogo;
