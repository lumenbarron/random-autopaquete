import styled from 'styled-components';

export const StyledServices = styled.div`
    
        div{
          margin: 0;
          position: relative; 
        }

        div video{

          left: 0;
          width: 100%;
          height: 100%;
          object-fit;
          
        }

        .videotwo{
            left: 0;
          width: 100%;
          height: 100%;
          object-fit;
            
        }
        h1{
          text-align: center;
          font-size: 5rem;
          color: #C94141; 
        }

        h2{
          text-align: center;
          color: #6B6B6B;
        }

        p{
          font-size: 2rem;
          color: #C94141;
          text-align: center;
        }
        
        .flex-container, .flex-container2 {
          display: flex;
        }

        .flex-container > div {
          width: 25%;
          padding: 0 50px;
        }

        .flex-container2 > div {
          width: 50%;
          padding: 0 150px;
        }
        
        img{
          display:block;
          margin:auto;
          
        }

        .white-space{
          height: 50px;
        }

        @media (max-width: 600px) {
          .div {
            width: 100%;
            height: auto;
            flex-direction: column;
          }
`;
