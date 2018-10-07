import styled from 'styled-components';

const Wrapper = styled.div`
	.news-text.is-invalid {
		border: 1px solid #f86c6b;
	}
	.news-text.is-invalid ~ .invalid-feedback {
		display: block;
	}
`;

export default Wrapper;
