import React from 'react';

const Select = (props) => {
  return (
    <select {...props}>
      <option value="">{props.defaultText || '...'}</option>
      {(props.options || []).map((opt, index) => (
        <option key={index} value={opt.value}>{opt.text}</option>
      ))}
    </select>
  );
};

export default Select;
