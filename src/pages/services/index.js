import React from 'react';
import ReactPlayer from 'react-player';
import { StyledServices } from './styled';

const ServicesPage = () => {
    return (
        <StyledServices>
            <div>
                <ReactPlayer className="videotwo" url="./assets/videos/video.mp4" playing />
                <div className="white-space" />
                <h1> Nuestros servicios</h1>
                <div className="white-space" />
                <h2>Paqueterías para empresas + de 20 envíos</h2>
                <div className="white-space" />
                <div className="flex-container">
                    <div>
                        <img src="./assets/box-check.png" alt="Plataforma fácil de usar" />
                        <p>Plataforma fácil de usar</p>
                    </div>
                    <div>
                        <img src="./assets/world.png" alt="Tus envíos a mejor precio" />
                        <p>Tus envíos a mejor precio</p>
                    </div>
                    <div>
                        <img
                            src="/assets/warehouse.png"
                            alt="Organiza y controla tus envíos fácilmente"
                        />
                        <p>Organiza y controla tus envíos fácilmente</p>
                    </div>
                    <div>
                        <img src="/assets/truck.png" alt="Recolección sin costo" />
                        <p>Recolección sin costo</p>
                    </div>
                </div>
                <div className="white-space" />
                <h2>Paqueterías para - de 20 envíos</h2>
                <div className="white-space" />

                <div className="flex-container2">
                    <div>
                        <img
                            src="./assets/box-swap.png"
                            alt="Compara y elije la mejor opción de envío"
                        />
                        <p>Compara y elijela mejor opción de envío</p>
                    </div>

                    <div>
                        <img src="./assets/box-safe.png" alt="Genera tu guía fácil y rápido" />
                        <p>Genera tu guía fácil y rápido</p>
                    </div>
                </div>
                <div className="white-space" />
                <div className="white-space" />
            </div>
        </StyledServices>
    );
};

export default ServicesPage;
