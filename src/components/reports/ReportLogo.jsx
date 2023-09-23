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

const ReportLogo = () => (
    <View>
        {
            <Image
                style={styles.logo}
                src={`https://images.pexels.com/photos/1337384/pexels-photo-1337384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
            />
        }
    </View>
);

export default ReportLogo;
