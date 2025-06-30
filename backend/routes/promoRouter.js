const express = require('express');
const { validatePromo } = require('../controllers/promocontroller');

const promoRouter = express.Router();
promoRouter.get('/validate', validatePromo);

module.exports = promoRouter;
