const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD${timestamp}${random}`;
};

const generateTicketNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `TKT${timestamp}${random}`;
};

const generateReturnNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `RET${timestamp}${random}`;
};

module.exports = {
  generateOrderNumber,
  generateTicketNumber,
  generateReturnNumber,
};
