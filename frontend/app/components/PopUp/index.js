import React from 'react';
import Wrapper from './Wrapper';

const PopUp = (props) => {
	return (
		<Wrapper {...props}>
			<div className="popup-content">
        {props.close ? <button className="close-btn" onClick={props.onClose}>X</button> : null}
        {props.content}
      </div>
		</Wrapper>
	)
};

export default PopUp;