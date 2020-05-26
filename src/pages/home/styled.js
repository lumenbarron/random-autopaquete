import styled from 'styled-components';

export const StyledHome = styled.div`
    .title {
        font-weight: 700 !important;
        font-size: 2.6rem;
    }

    .text {
        font-size: 1.5rem;
    }
    .ntext {
        font-size: 1.2rem;
    }

    .responsive {
        height: auto;
        max-width: 100%;
    }

    .button {
        background-color: #ab0000;
        color: white;
    }

    .tmedium {
        width: 120px;
        height: 120px;
        align-items: center;
    }
    //Inicio carrousel logos
    .backsilder {
        background: #f4f4f4;
    }

    div h1.nclients {
        font-size: 3rem;
        font-weight: 600;
        text-align: center;
        padding-top: 8rem;
    }
    .wrapper {
        width: auto;
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slider {
        width: 1000px;
        height: 150px;
        position: relative;
        box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0, 2);
        //overflow: hidden;
    }

    .slide {
        height: 100px;
        display: flex;
        align-items: center;
        animation: slideshow 12s linear infinite;
    }

    .slide img {
        height: 200px;
        padding: 0 50px 0 50px;
    }

    @keyframes slideshow {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-100%);
        }
    }
    //Fin carrousel logos
`;
