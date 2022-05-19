const express = require('express');
const validate = require('../../middlewares/validate');
const cardValidation = require('../../validations/card.validation');
const cardController = require('../../controllers/card.controller');
const whitelist = require('../../middlewares/whitelist');

const router = express.Router();

router.route('/').get(cardController.getCards);

router
  .route('/collection')
  .get(validate(cardValidation.getCardsByUserEmail), cardController.getCardsByUserEmail)
  .post(whitelist, validate(cardValidation.updateUserCards), cardController.updateUserCards);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Cards retrieval
 */

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get all cards
 *     tags: [Cards]
 *     security:
 *     parameters:
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

/**
 * @swagger
 * /cards/collection:
 *   get:
 *     summary: Get all cards owned by a user
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *
 *   post:
 *     summary: Update the list of cards of a user
 *     description: Must be accessed from a whitelisted IP
 *     tags: [Cards]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - cards
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               cards:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      card_id:
 *                        type: string
 *                      count:
 *                        type: integer
 *             example:
 *               email: fake@example.com
 *               password: password1
 *               cards:
 *                   card_id: 5ebac534954b54139806c112
 *                   count: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/IncorrectPassword'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
