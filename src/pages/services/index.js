import React from 'react';

const ServicesPage = () => {
    return (
        <div>
            <video src="./assets/videos/video.mp4" autoPlay="" muted="" loop="" />
            <h1> Nuestros servicios</h1>

            <h2>Paqueterías para empresas + de 20 envíos</h2>

            <div>
                <img height="100px" src="./assets/box-check.png" alt="Plataforma fácil de usar" />
                <p>Plataforma fácil de usar</p>
            </div>

            <div>
                <img height="100px" src="./assets/world.png" alt="Tus envíos a mejor precio" />
                <p>Tus envíos a mejor precio</p>
            </div>

            <div>
                <img
                    height="100px"
                    src="/assets/warehouse.png"
                    alt="Organiza y controla tus envíos fácilmente"
                />
                <p>Organiza y controla tus envíos fácilmente</p>
            </div>

            <div>
                <img height="100px" src="/assets/truck.png" alt="Recolección sin costo" />
                <p>Recolección sin costo</p>
            </div>

            <div className="espacio-blanco" />
            <h2>Paqueterías para - de 20 envíos</h2>
            <div className="espacio-blanco" />

            <div>
                <img height="100px" src="./assets/box-check.png" alt="Plataforma fácil de usar" />
                <p>Plataforma fácil de usar</p>
            </div>

            <div className="flex-container2">
                <div>
                    <img
                        height="100px"
                        src="./assets/box-swap.png"
                        alt="Compara y elije la mejor opción de envío"
                    />
                    <p>Compara y elijela mejor opción de envío</p>
                </div>

                <div>
                    <img
                        height="100px"
                        src="./assets/box-safe.png"
                        alt="Genera tu guía fácil y rápido"
                    />
                    <p>Genera tu guía fácil y rápido</p>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
