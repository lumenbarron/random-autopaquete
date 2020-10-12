import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import styles from './styles';

export default function DataContact({ noGuia, service, date }) {
    console.log(noGuia, service, date);
    return (
        <View style={styles.section}>
            <View style={[styles.container, { width: '50%' }]}>
                <Text style={styles.titles}>Número de Guía</Text>
                {noGuia ? <Text style={styles.inputs}>{noGuia}</Text> : null}
            </View>
            <View style={[styles.container, { width: '25%' }]}>
                <Text style={styles.titles}>Servicio</Text>
                {service ? <Text style={styles.inputs}>{service}</Text> : null}
            </View>
            <View style={[styles.container, { width: '25%' }]}>
                <Text style={styles.titles}>Fecha</Text>
                {date ? <Text style={styles.inputs}>{date}</Text> : null}
            </View>
        </View>
    );
}
