import styled from 'styled-components';

export const StyledConditions = styled.div`
    padding-bottom: 6rem;

    main {
        padding: 5rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
    }

    main p {
        text-align: left;
    }

    .title a:hover,
    .title a:focus,
    .title a:active {
    }

    .title {
        margin: 0;
        line-height: 1.15;
        font-size: 3rem;
        font-weight: 600;
    }

    .title,
    .description {
        text-align: center;
    }

    .description {
        line-height: 1.5;
        font-size: 1.5rem;
        color: #6b6b6b;
    }

    .white-space {
        height: 50px;
    }
`;
