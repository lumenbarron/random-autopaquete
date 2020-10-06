import { StyleSheet } from '@react-pdf/renderer';
//import styled from '@react-pdf/styled-components';

// export const StyleHeaderImage = styled.div`
// display: flex;
// justify-content: center;
// `;

// export const StyleContentData = styled.div`
// display: flex;
// justify-content: center;
// align-items: center;
// `;

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        color: 'blue',
        width: 500,
        height: 800,
    },
    titles: {
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'Montserrat',
    },
    text: {
        fontSize: 20,
        textAlign: 'justify',
        fontFamily: 'Montserrat',
    },
    image: {
        width: 185,
        height: 45,
    },
    data: {
        border: '1px solid green',
        borderRadius: 20,
    },
});

export default styles;
