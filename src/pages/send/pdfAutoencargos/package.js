import React from 'react';
import { View, Text, Canvas } from '@react-pdf/renderer';
import styles from './styles';

export default function Package({ assurance, company, content }) {
    return (
        <View style={styles.section}>
            <View style={[styles.container, { width: '50%' }]}>
                <Text style={styles.titles}>Valor Declarado</Text>
                {assurance ? <Text style={styles.inputs}>{assurance}</Text> : null}
                <Text style={[styles.titles, { marginTop: 5 }]}>Contenido </Text>
                {content ? <Text style={styles.inputs}>{content}</Text> : null}
                <Text style={[styles.titles, { marginTop: 5 }]}>Razón Social </Text>
                {company ? <Text style={styles.inputs}>{company}</Text> : null}
            </View>
            <View style={[styles.container, { width: '50%' }]}>
                <Text
                    style={[styles.titles, { textAlign: 'center', marginLeft: 0, marginBottom: 5 }]}
                >
                    Acuse de Entrega
                </Text>
                <Canvas style={styles.canva}></Canvas>
                <Text style={styles.notes}>NOMBRE Y FIRMA DE RECIBIDO</Text>
            </View>
        </View>
    );
}
