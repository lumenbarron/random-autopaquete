import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import styles from './styles';

export default function Destination({ origin, name, adress, phone, reference }) {
    return (
        <View>
            <View style={styles.sectionLogo}>
                <Text style={styles.titleHeaders}>{origin}</Text>
            </View>
            <View style={styles.section}>
                <View style={[styles.container, { width: '30%' }]}>
                    <Text style={styles.titles}>Nombre</Text>
                    {name ? <Text style={styles.inputs}>{name}</Text> : null}
                </View>
                <View style={[styles.container, { width: '70%' }]}>
                    <Text style={styles.titles}>Dirección </Text>
                    {adress ? <Text style={styles.inputs}>{adress}</Text> : null}
                </View>
            </View>
            <View style={styles.section}>
                <View style={[styles.container, { width: '30%' }]}>
                    <Text style={styles.titles}>Télefono</Text>
                    {phone ? <Text style={styles.inputs}>{phone}</Text> : null}
                </View>
                <View style={[styles.container, { width: '70%' }]}>
                    <Text style={styles.titles}>Referencias adicionales </Text>
                    {reference ? <Text style={styles.inputs}>{reference}</Text> : null}
                </View>
            </View>
        </View>
    );
}
