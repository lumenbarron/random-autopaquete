import React from 'react';
import { StyledQuote } from './styled';

const QuotePage = () => {
    return (
        <StyledQuote>
            <div>
                <h1 className="title">Solicitud de cotización</h1>
            </div>
            <div className="flexbox, container">
                <form
                    className="formulario"
                    action="https://incrementacrm.com/api/widget/web-form/c38333ae647c560bc985f8bcb1ecc96bea72c0fc"
                    method="post"
                    id="ClientWebFormForm"
                    acceptCharset="utf-8"
                >
                    <div>
                        <input type="hidden" name="_method" value="POST" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ClientFirstName">Nombre(s)</label>
                        <input
                            name="data[Client][first_name]"
                            className="form-control"
                            placeholder="Nombre(s)"
                            type="text"
                            id="ClientFirstName"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ClientCompanyName">Empresa</label>
                        <input
                            name="data[Client][company_name]"
                            className="form-control"
                            placeholder="Empresa"
                            type="text"
                            id="ClientCompanyName"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ClientPhone">Teléfono</label>
                        <input
                            name="data[Client][phone]"
                            className="form-control"
                            placeholder="TelÈfono"
                            type="tel"
                            id="ClientPhone"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ClientEmail">Email</label>
                        <input
                            name="data[Client][email]"
                            placeholder="Email"
                            type="email"
                            id="ClientEmail"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ClientRealizasMasDe20EnviosAlMes">
                            ¿Realizas más de 20 envÌos al mes?
                        </label>
                        <input
                            name="data[Client][realizas_mas_de_20_envios_al_mes]"
                            placeholder="¿Realizas m·s de 20 envÌos al mes?"
                            type="text"
                            id="ClientRealizasMasDe20EnviosAlMes"
                        />
                    </div>

                    <div className="submit">
                        <input className="boton" type="submit" value="Enviar" />
                    </div>
                </form>
            </div>
            <div>
                <img className="flexbox" src="./assets/quote.png" alt="Cotización.png" />
            </div>
        </StyledQuote>
    );
};

export default QuotePage;
