import { Card } from 'react-rainbow-components';
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

    .timeline-header {
      text-align:center;
      margin:2rem;
    }

    .timeline {
        position: relative;
        margin: 50px auto;
        padding: 40px 0;
        width: 90%;
        max-width:1200px;
    }

    .timeline: before {
        content: '';
        position: absolute;
        left: 50%
        width: 8px;
        height:80%;
        background: #E8E8E8;
    }

    .timeline ul {
        margin: 0;
        padding: 0;
    }

    .timeline ul li {
      display:flex;
    }

    .timeline ul li:nth-child(odd){

    }

    .timeline ul li:nth-child(even){
      flex-direction:row-reverse;
    }

    .tcontent {
      background:linear-gradient(45deg, #bb1b1f, #7c0004);
      margin: 1rem 5rem;
      padding: 1rem 3rem;
      text-align: center;
      flex: 1 1;
      border-radius: 1rem;
      position:relative;
    }

    li:nth-child(odd) .tcontent::after {
        content: url(/assets/timeline-dot.svg);
        position: absolute;
        top: 33%;
        right: -6.85rem;
    }

    li:nth-child(even) .tcontent::before {
        content: url(/assets/timeline-dot.svg);
        position: absolute;
        top: 33%;
        left: -6.45rem;
        transform: rotate(180deg);
    }

    .timeline li:not(:first-child) .tcontent  {
      margin: 3rem 5rem;
    }

    ..timeline li:not(:first-child) .tcontent + div {
      margin: 3rem 5rem;
    }

    .tcontent + div {
      float: left;
      margin: 1rem 5rem;
      flex: 1 1;
      padding: 1rem 3rem;
      text-align: center;
    }
    .tcontent + div img {
      width:90%;
    }

    & .tcontent h3 {
      color:white;
      font-size: 1rem;
      font-weight: 600;
    }

    & .tcontent p {
      color:white;
      font-size:0.75rem;
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
        overflow: hidden;
    }

    .slider {
        width: 1000px;
        height: 10px;
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

    & .nback {
      padding:5rem;
      background: rgb(242,242,242);
    }

    @keyframes slideshow {
        0% {
            transform: translateX(-10%);
        }
        100% {
            transform: translateX(-110%);
        }
    }
    //Fin carrousel logos
`;

export const StyledCard = styled(Card)`
    flex: 1 1;
    padding-left: 3rem;
    padding-right: 3rem;
    min-width: 195px;
    margin: 1rem;

    & img {
        margin: 1rem auto;
    }

    & h4 {
        font-weight: bold;
        color: crimson;
        text-align: center;
        font-size: 1rem !important;
    }
    & ul {
        font-size: 0.7rem;
        list-style: circle;
        line-height: 1rem;
        margin-left: 1rem;
    }
    & li {
        margin-bottom: 0.5rem;
    }
`;
