export const formatMoney = (amount) => {
  const options = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  };

  const formatter = Intl.NumberFormat("en-US", options);

  return formatter.format(amount);
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
