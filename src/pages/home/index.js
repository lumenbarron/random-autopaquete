import React from 'react';
import { Button } from 'react-rainbow-components';
import { StyledHome } from './styled';

const HomePage = () => {
    return (
        <StyledHome>
            <div>
                <div>
                    <h1>La plataforma que te permite una excelente logística de envíos.</h1>
                    <p>
                        Autopaquete es la plataforma gratuita que te permitirá gestionar tus envíos
                        al mejor precio y de una manera muy sencilla.
                    </p>
                    <Button className="button" shaded label="¡Comienza ya!" />
                </div>
                <div>
                    <img
                        src="./assets/intro-img.png"
                        alt="La plataforma que te permite una excelente logística de envíos"
                    />
                </div>
            </div>
            <div>
                <div>
                    <img src="./assets/truck-2.png" alt="Nosotros" />
                </div>
                <div>
                    <h1>Nosotros</h1>
                    <p>
                        Somos una empresa 100% mexicana con más de 3 años de experiencia en el medio
                        de transporte y paquetería, conocemos la importancia de un servicio
                        personalizado y adecuado a las necesidades específicas de usted y su
                        empresa, con nosotros encontrará diferentes opciones para sus envíos a un
                        mejor precio.
                    </p>
                </div>
            </div>
            <div>
                <img src="./assets/check-table.png" alt="Guías a crédito" />
                <p>Guías a crédito</p>
                <img src="./assets/box-check.png" alt="Soluciones logísticas" />
                <p>Soluciones logísticas</p>
                <img src="./assets/pin-check.png" alt="Convenios corporativos" />
                <p>Convenios corporativos</p>
            </div>
            <div>
            <h1>Nuestros clientes</h1>
                <div className="wrapper">
                    <div className="slider"> 
                        <div className="slide">
                            <img src="./assets/logo-rappi.png" alt="" />
                            <img src="./assets/logo-sello-rojo.png" alt="" />
                            <img src="./assets/logo-cloe.png" alt="" />
                            <img src="./assets/logo-chai.png" alt="" />
                            <img src="./assets/logo-artmosfera.png" alt="" />
                            <img src="./assets/logo-linguatectv.png" alt="" />
                            <img src="./assets/logo-peter-piper.png" alt="" />
                            <img src="./assets/logo-nine-west.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </StyledHome>
    );
};

export default HomePage;
