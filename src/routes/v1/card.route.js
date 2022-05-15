const express = require('express');
const cardController = require('../../controllers/card.controller');

const router = express.Router();

router.route('/').get(cardController.getCards);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Cards retrieval
 */

/**
 * @swagger
 *   get:
 *     summary: Get all cards
 *     tags: [Cards]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
