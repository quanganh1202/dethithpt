const moneyValidation = money => parseInt(money && money !== 'NaN' ? money : 0);

const numberWithCommas = x => {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

export {
    moneyValidation,
    numberWithCommas,
};
