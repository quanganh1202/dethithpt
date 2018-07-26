import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default styled(Link)`
  display: inline-flex;
  padding: 1em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;

  &:active {
    background: #41addd;
    color: #fff;
  }

  &:hover {
    background: #41addd;
    color: #fff;
  }
`;
