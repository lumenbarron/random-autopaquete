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

    //Time line

    .timeline {
        position: relative;
        margin: 50px auto;
        padding: 40px 0;
        whith: 1000px;
    }

    .timeline: before {
        content: '';
        position: absolute;
        left: 50%
        width: 8px;
        height:100%;
        background: #E8E8E8;
    }

    .timeline ul {
        margin: 0;
        padding: 0;
    }

    .timeline ul li {
        list-style: none;
        position: relative;
        width: 50%;
        padding: 20px 40px;
        box-sizing: border-box;
    }

    .timeline ul li:nth-child(odd){
        float: left;
        text-align: center;

    }
    .timeline ul li:nth-child(even){
        float: left;
        text-align: center;

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
