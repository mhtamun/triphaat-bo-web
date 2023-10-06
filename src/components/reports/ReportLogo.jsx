import React from 'react';
import { Image, View, StyleSheet } from '@react-pdf/renderer';
// import logo from '../../assets/icons/logo.png';

const styles = StyleSheet.create({
    logo: {
        width: 'auto',
        height: '100px',
        marginBottom: 6,
    },
});

const ReportLogo = ({ src }) => <View>{<Image style={styles.logo} src={src} />}</View>;

export default ReportLogo;
