import React from 'react';

const Select = ({
  defaultText,
  options,
  ...props,
}) => {
  return (
    <select {...props}>
      <option value="">{defaultText || '...'}</option>
      {(options || []).map((opt, index) => (
        <option key={index} value={opt.value}>{opt.text}</option>
      ))}
    </select>
  );
};

export default Select;
