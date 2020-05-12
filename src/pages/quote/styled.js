import styled from 'styled-components';

export const StyledQuote = styled.div`
          .formulario {
        max-width: 500px;
        margin: 2rem auto;
        padding: 2rem;
      }

      label {
        display: block;
        padding: 1rem 0 0.25rem;
        font-size: 14px;
      }

      input {
        display: block;
        width: 100%;
        border: 2px solid #B2B2B2;
        padding: 0.5rem;
        font-size: 18px;
        border-radius: 5px;
      }

      .boton {
        border: 0;
        background: #ab0000;
        border-radius: 20px;
        padding: 0.5rem;
        color: white;
        margin: 1rem 0;
        width: auto;
        text-transform: uppercase;
        cursor: pointer;
        transition: 0.3s background ease;
      }

      img {
        float: right;
      }
      .title,
      .description {
        text-align: center;
        font-size: 3em;
      }
      }
      .title {
        color: #bb4b46;
        text-decoration: none;
        text-aline: center;
        font-weight: 600;
      }
      .flexbox {
        display: flex;
      }
      .flexbox div {
        width: 50%;
      }
`;
