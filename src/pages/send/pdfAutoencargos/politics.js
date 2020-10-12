import React from 'react';
import { View, Text, Link } from '@react-pdf/renderer';
import styles from './styles';

export default function Politics() {
    return (
        <View>
            <Text style={[styles.politics, { textAlign: 'center' }]}>
                TÉRMINOS Y CONDICIONES DE ESTA CARTA DE PORTE APLICABLES AL SERVICIO LOCAL DE
                MENSAJERÍA Y PAQUETERÍA.
            </Text>
            <Text style={styles.politics}>
                1. Aceptación de estos términos y condiciones. Al entregarnos los documentos y/o
                paquetes indicados, Usted acepta expresamente los términos y condiciones que
                aparecen en nuestra página Web: autoencargos.com/terminos-y-condiciones misma que
                usted acepta conocer y haber consultado. Ninguna persona está autorizada para
                modificar dichos términos y condiciones por cuenta o en representación de
                AUTOENCARGOS. 2. Artículos prohibidos. Usted declara bajo protesta de decir verdad
                que el contenido del envío ha sido correctamente declarado en el presente documento
                y que el mismo no contiene ninguno de los artículos que a continuación se señalan
                (en lo sucesivo "envíos prohibidos"): billetes o anuncios de lotería extranjera o de
                juegos de azar prohibidos; materiales o residuos a los que hace referencia el
                Reglamento para el Transporte Terrestre de Materiales y Residuos Peligrosos, salvo
                que se obtenga la autorización correspondiente de la autoridad competente; drogas,
                psicotrópicos y estupefacientes, salvo que su posesión o traslado sea lícito
                conforme a las disposiciones legales aplicables; armas de fuego o explosivos;
                animales o perecederos, cuando no se cumplan las condiciones de higiene y seguridad
                adecuadas, de acuerdo con los ordenamientos aplicables; dinero o títulos de crédito
                al portador o negociables; cualquier otro bien cuyo tránsito requiera de permiso
                específico o bien lo restringa alguna ley en particular, sin que se cuente con dicho
                permiso específico. 3. Limitación de nuestra responsabilidad. El límite de nuestra
                responsabilidad por daños ocasionados al contenido del envío o por pérdida de éste,
                por daños y perjuicios no ajenos a AUTOENCARGOS, se limita a una cantidad
                equivalente a 30 (treinta) días de salario mínimo diario general aplicable en la
                Ciudad de México, a menos que: (a) Usted haya declarado expresamente y nosotros
                hubiésemos aceptado una declaración de valor adicional en el renglón correspondiente
                en este documento al momento de su entrega a AUTOENCARGOS; y (b) Usted haya pagado a
                AUTOENCARGOS los cargos correspondientes a la declaración de valor adicional. En
                todo caso, será necesario que Usted compruebe en forma fehaciente el monto de los
                daños y perjuicios efectivamente causados y presente su reclamación a AUTOENCARGOS
                dentro del plazo de la factura. AUTOENCARGOS no proporciona ningún seguro, lo que
                Usted acepta expresamente. Excepto por lo antes señalado, AUTOENCARGOS no asume
                ninguna otra responsabilidad por los daños y perjuicios que Usted llegue a sufrir.
                4. Derecho de inspección. AUTOENCARGOS se reserva el derecho de inspeccionar el
                envío en cualquier momento, así como permitir a las autoridades competentes a llevar
                a cabo las inspecciones que consideren adecuadas. Asimismo, AUTOENCARGOS se reserva
                el derecho a rechazar o suspender el porte de cualquier envío prohibido o que
                contenga materiales que dañen o puedan dañar otros envíos o que puedan constituir un
                riesgo al equipo o empleados de AUTOENCARGOS o de sus prestadores de servicios.
            </Text>
            <View style={styles.contactContainer}>
                <Text style={[styles.politics, { textAlign: 'center', paddingBottom: 10 }]}>
                    TÉRMINOS Y CONDICIONES DE ESTA CARTA DE PORTE APLICABLES AL SERVICIO LOCAL DE
                    MENSAJERÍA Y PAQUETERÍA.
                </Text>
            </View>
            <View style={[styles.contactContainer, styles.section, { borderWidth: 1 }]}>
                <View
                    style={[
                        styles.dataContainer,
                        styles.contactContainer,
                        { borderRightWidth: 1, width: '60%' },
                    ]}
                >
                    <Text style={[styles.politics, { textAlign: 'center', marginTop: 0 }]}>
                        TELÉFONO
                    </Text>
                    <Text style={[styles.politics, { textAlign: 'center' }]}>
                        Teléfono: 01 (33) 1542 1033
                    </Text>
                    <Text style={[styles.politics, { textAlign: 'center' }]}>
                        WhatsApp: +52 (33) 1973 5237
                    </Text>
                    <Text style={[styles.politics, { textAlign: 'center' }]}>CORREO</Text>
                    <Link style={[styles.politics, { textAlign: 'center' }]}>
                        {' '}
                        soporte.logistica1@autopaquete.com
                    </Link>
                </View>
                <View style={[styles.dataContainer, styles.contactContainer, { width: '40%' }]}>
                    <Text style={[styles.politics, { textAlign: 'center', marginTop: 0 }]}>
                        HORARIO
                    </Text>
                    <Text style={[styles.politics, { textAlign: 'center' }]}>
                        Lunes - Viernes: 9am - 5pm{' '}
                    </Text>
                    <Text style={[styles.politics, { textAlign: 'center' }]}>
                        Guadalajara, Jalisco
                    </Text>
                </View>
            </View>
        </View>
    );
}
