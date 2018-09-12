import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	background-color: ${props => props.background || 'white'};
	text-align: center;
	color: ${props => props.background ? 'white' : 'black'};
	cursor: pointer;
`;

const SocialButton = (props) => {
	return (
		<Wrapper {...props}>
			{props.text}
		</Wrapper>
	)
}

export default SocialButton;
