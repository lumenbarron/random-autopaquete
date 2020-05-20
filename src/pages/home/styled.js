import styled from 'styled-components';

export const StyledHome = styled.div`



    .responsive{
        height: auto;
        max-width: 100%;
    }

    .button {
    background-color: #ab0000;
    color: white;
    }
    
    //Inicio carrousel logos
    .wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F3F3F3;
    }

    .slider{
        width: 1000px;
        height: 150px;
        position: relative;
        box-shadow: 0 10px 20px -10px rgba(0,0,0,0,2);
        //overflow: hidden;
    }

    .slide {
        height: 100px;
        display: flex;
        align-items: center;
        animation: slideshow 12s linear infinite;
    }

    .slide img{
        height: 200px;
        padding: 0 50px 0 50px;
    }

    @keyframes slideshow {
    0% {transform: translateX(0);}
    100% {transform: translateX(-100%);}
    }
    //Fin carrousel logos
`;
