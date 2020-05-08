import React from 'react';

const ServicesPage = () => {
    return (
        <div>
            <video src="./assets/videos/video.mp4" autoPlay="" muted="" loop="" />
            <h1> Nuestros servicios</h1>

            <h2>Paqueterías para empresas + de 20 envíos</h2>

            <div>
                <img height="100px" src="/static/img/ser-1.png" alt="Plataforma fácil de usar" />
                <p>Plataforma fácil de usar</p>
            </div>

            <div>
                <img height="100px" src="/static/img/ser-2.png" alt="Tus envíos a mejor precio" />
                <p>Tus envíos a mejor precio</p>
            </div>

            <div>
                <img
                    height="100px"
                    src="/static/img/ser-3.png"
                    alt="Organiza y controla tus envíos fácilmente"
                />
                <p>Organiza y controla tus envíos fácilmente</p>
            </div>
            <div>
                <img height="100px" src="/static/img/ser-4.png" alt="Recolección sin costo" />
                <p>Recolección sin costo</p>
            </div>
            <div className="espacio-blanco" />
            <h2>Paqueterías para - de 20 envíos</h2>
            <div className="espacio-blanco" />
        </div>
    );
};

export default ServicesPage;
