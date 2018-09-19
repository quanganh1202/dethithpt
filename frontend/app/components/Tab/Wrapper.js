import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 15px;
  &.green-tab .title {
    background: #2FA538;
  }

  & .title {
    font-size: 0.9em;
    padding: 5px 0;
    margin: 0;
    text-align: center;
    color: ${props => props.color || '#fff'};
    background: ${props => props.theme.headerMenu};
  }

  & .content {
    font-size: 0.9em;
    padding: 10px 0;
    min-height: 50px;

    /*---Format List---*/
    li {
      padding: 0 1em;
      margin-bottom: 5px;
    }

    .list-color {
      border-left: 2px solid;
    }

    .list-quantity {
      font-size: 0.8em;
      font-weight: bold;
      background: #777777;
      padding: 0 5px;
      border-radius: 40%;
      color: #fff;
      margin-left: 5px;
    }

    a {
      color: ${props => props.theme.linkColor};
      text-decoration: none;

      :hover {
        text-decoration: underline;
      }
    }
  }
`;

export default Wrapper;
