import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Wrapper from './Wrapper';

library.add(faTimesCircle);

const PopUp = (props) => {
	return (
		<Wrapper {...props}>
      <div className="popup-body">
        <div className="popup-content">
          {props.content}
        </div>
        {props.close ? (<button className="popup-close-btn" onClick={props.onClose}>
            <FontAwesomeIcon sz="lg" className={'specific-icon'} icon={['fas', 'times-circle']} />
          </button>) : null}
      </div>
		</Wrapper>
	)
};

export default PopUp;