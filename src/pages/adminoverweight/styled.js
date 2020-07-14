import styled from 'styled-components';

export const StyledAdminoverweight = styled.div`
    width: 70%;
    margin: 5rem;
    padding: 2rem;
    //border-radius: 3rem;

    color: crimson;

    -webkit-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
    //-moz-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
    //box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);

    h1 {
        font-weight: 700;
        font-size: 1.5rem;
    }

    .btn-confirmar {
        background: crimson;
        color: #fff;
    }

    .btn-import {
        background-color: #eff1f5;
    }

    .app-spacer{
        height: 1rem;

        &.height-1 {
            height: 1rem;
        }

        &.height-2 {
            height: 2rem;
        }

        &.height-2-5 {
            height: 2.5rem;
        }

        &.height-3 {
            height: 3rem;
        }

        &.height-3-5 {
            height: 3.5rem;
        }
    }

    @media (max-width: 1408px) {

    .empty-espace{
        display:none;
    }
  }
}

`;
