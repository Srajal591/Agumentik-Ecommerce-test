// Central route exports
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const ticketRoutes = require('./ticketRoutes');
const returnRoutes = require('./returnRoutes');
const uploadRoutes = require('./uploadRoutes');

module.exports = {
  authRoutes,
  userRoutes,
  categoryRoutes,
  productRoutes,
  orderRoutes,
  ticketRoutes,
  returnRoutes,
  uploadRoutes,
};
