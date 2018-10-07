import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const Wrapper = styled.div`
	padding: 0 40px;
	> table {
		width: 100%;
		> thead {
			> tr > th {
				text-align: left;
			}
		}
		> tbody {
			> tr > td.list-item-name {
				span:first-of-type {
					margin-right: 10px;
				}
			}
		}
		tr {
			height: 30px;
		}
	}
`;

const GeneralInformation = (props) => {
  return (
    <Wrapper className={`list-${props.name}`}>
			<table>
				{props.renderHeader()}
				{props.renderData()}
			</table>
    </Wrapper>
  )
};

export default GeneralInformation;
