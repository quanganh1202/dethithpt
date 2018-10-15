import styled from 'styled-components';

const Button = styled.button`
  background-color: ${(props) => props.color || 'blue'};
  color: white;
  border-radius: 5px;
  font-size: 1em;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
`;

export default Button;
