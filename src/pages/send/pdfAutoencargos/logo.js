import React from 'react';
import { View, Image } from '@react-pdf/renderer';

import styles from './styles';

export default function Logo() {
    return (
        <View style={styles.sectionLogo}>
            <Image style={styles.image} src="/assets/autoencar.png" />
        </View>
    );
}
