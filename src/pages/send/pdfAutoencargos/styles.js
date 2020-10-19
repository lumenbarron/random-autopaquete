import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Montserrat',
    src: 'http://fonts.gstatic.com/s/montserrat/v6/zhcz-_WihjSQC0oHJ9TCYC3USBnSvpkopQaUR-2r7iU.ttf',
});

Font.register({
    family: 'Montserrat-bold',
    src: 'http://fonts.gstatic.com/s/montserrat/v6/IQHow_FEYlDC4Gzy_m8fcvEr6Hm6RMS0v1dtXsGir4g.ttf',
});

const styles = StyleSheet.create({
    viewer: {
        width: 900,
        height: 750,
        padding: 10,
    },
    page: {
        padding: 10,
    },
    section: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    sectionLogo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#005502',
        borderBottomStyle: 'solid',
        width: '100%',
        paddingVertical: 5,
    },
    image: {
        width: 180,
        height: 45,
    },
    titleHeaders: {
        fontFamily: 'Montserrat-bold',
        fontSize: 12,
        paddingTop: 5,
    },
    titles: {
        fontFamily: 'Montserrat-bold',
        fontSize: 12,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    container: {
        paddingHorizontal: 10,
        paddingTop: 10,
        flexDirection: 'column',
    },
    canva: {
        height: '37%',
        border: 1,
        borderStyle: 'solid',
        borderColor: '#005502',
        borderRadius: 10,
    },
    notes: {
        fontFamily: 'Montserrat',
        fontSize: 6,
        paddingLeft: 0,
        paddingTop: 10,
        textAlign: 'center',
    },
    politics: {
        fontFamily: 'Montserrat',
        fontSize: 7,
        textAlign: 'justify',
        color: 'gray',
        lineHeight: 1.6,
        marginTop: 10,
    },
    inputs: {
        fontFamily: 'Montserrat',
        fontSize: 9,
        border: 1,
        borderStyle: 'solid',
        borderColor: '#005502',
        borderRadius: 7,
        padding: 5,
        marginTop: 5,
    },
    contactContainer: {
        borderStyle: 'dashed',
        borderColor: '#005502',
    },
    dataContainer: {
        padding: 10,
        flexDirection: 'column',
    },
});

export default styles;
