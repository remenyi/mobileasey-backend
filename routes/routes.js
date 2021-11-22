/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         email: employeename@companyname.com
 *         password: 7Hdnv4hvGlV2
 *         
 *     EquipmentDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Equipment name
 *         equipmentId:
 *           type: integer
 *           description: Equipment ID
 *         equipmentType:
 *           type: string
 *           description: Type of the equipment (eg. Laptop)
 *       example:
 *         equipments:
 *           - name: Lenovo ThinkPad T480
 *             equipmentId: 912834
 *             equipmentType: laptop
 *           - name: Lenovo ThinkPad T495
 *             equipmentId: 27384
 *             equipmentType: laptop
 *             
 *     ReservationDTO:
 *       type: object
 *       required:
 *         - device
 *         - booker
 *         - from
 *         - to
 *         - reservationId
 *       properties:
 *         deviceID:
 *           type: integer
 *           description: Device name
 *         bookerID:
 *           type: integer
 *           description: Name of booker
 *         from:
 *           type: string
 *           description: Reserved from (iso8601)
 *         to:
 *           type: string
 *           description: Reserved until (iso8601)
 *         reservationID:
 *           type: integer
 *           description: Reservation ID
 *         reservationCode:
 *           type: integer
 *           description: Reservation code (QR code)
 *       example:
 *         from: '2021-11-17T11:11:18Z'
 *         to: '2021-11-17T11:11:18Z'
 *         deviceID: 123123
 *         bookerID: 252342
 *         reservationId: 7498762
 *     
 *     ReserveDateDTO:
 *       type: object
 *       required:
 *       - from
 *       - to
 *       properties:
 *         from:
 *           type: string
 *           description: Reserved from (iso8601)
 *         to:
 *           type: string
 *           description: Reserved until (iso8601)
 *     ReservationCodeDTO:
 *       type: object
 *       required:
 *         - reservationCode
 *       properties:
 *         reservationCode:
 *           type: integer
 *       example:
 *         reservationCode: 98654234
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const authenticateMW = require('../middleware/authenticateMW');
const authorizeMW = require('../middleware/authorizeMW');
const getAllEquipmentMW = require("../middleware/equipmentMWs/getAllEquipmentMW");
const getReservedDatesMW = require('../middleware/equipmentMWs/getReservedDatesMW');
const reserveMW = require('../middleware/equipmentMWs/reserveMW');

module.exports = function(app) {

  /**
   * @swagger
   * /login:
   *  post:
   *    tags:
   *      - auth
   *    description: Perform user authentication
   *    requestBody:
   *      description: User authentication with email and password
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/LoginUserDTO'
   *    responses:
   *      '200':
   *        description: Send JWT
   *      '401':
   *        description: NOT authenticated
   */
  app.post('/login', async (req, res) => {
    const accessToken = await authenticateMW(req.body.email, req.body.password);
    if (!accessToken) {
      res.status(401).send();
      return;
    }
    res.json({accessToken: accessToken});
  });

  /**
   * @swagger
   * /equipments:
   *   get:
   *     tags:
   *       - equipment
   *     description: "Get list of devices (authorized for the user)"
   *     responses:
   *       200:
   *         description: "List of devices"
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/EquipmentDTO'
   *       401:
   *         description: NOT authenticated
   */
  app.get('/equipments', authorizeMW, getAllEquipmentMW, async (req, res, next) => {
  });

  /**
   * @swagger
   * /equipments/{equipmentID}/reservedDates:
   *     get:
   *       tags:
   *         - equipment
   *       description: "Get device details (authorized for the user)"
   *       parameters:
   *         - in: path
   *           name: equipmentID
   *           schema:
   *             type: integer
   *           required: true
   *           description: "Numeric ID of the equipment to get"
   *       responses:
   *         200:
   *           description: "device details"
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/ReserveDateDTO'
   *         401:
   *           description: NOT authenticated
   */
  app.get('/equipments/:equipmentID/reservedDates', authorizeMW, getReservedDatesMW, (req, res) => {
  });

  /**
   * @swagger
   * /equipments/{equipmentID}/reserve:
   *       post:
   *         tags:
   *           - equipment
   *         description: "Reserve equipment (authorized for the user)"
   *         parameters:
   *           - in: path
   *             name: equipmentID
   *             schema:
   *               type: integer
   *             required: true
   *             description: "Numeric ID of the equipment to get"
   *         requestBody:
   *           description: "Reservation details"
   *           required: true
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ReserveDateDTO'
   *         responses:
   *           200:
   *             description: "Newly created reservation"
   *             content:
   *               application/json:
   *                 schema:
   *                   $ref: "#/components/schemas/ReservationDTO"
   *           401:
   *             description: NOT authenticated
   */
  app.post('/equipments/:equipmentID/reserve', authorizeMW, reserveMW, (req, res) => {
  });

  /**
   * @swagger
   * /reservations:
   *     get:
   *       tags:
   *         - reservation
   *       description: "Get list of reservations (authorized for the admin)"
   *       responses:
   *         200:
   *           description: "List of reservations"
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/ReservationDTO'
   *         401:
   *           description: NOT authenticated
   */
  app.get('/reservations', (req, res) => {
    res.send('list of reservations');
  });

  /**
   * @swagger
   * /reservations/{reservationID}:
   *     get:
   *       tags:
   *         - reservation
   *       description: "Get reservation details"
   *       parameters:
   *         - in: path
   *           name: reservationID
   *           schema:
   *             type: integer
   *           required: true
   *           description: "Numeric ID of the reservation to get"
   *       responses:
   *         200:
   *           description: "reservation details"
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ReservationDTO'
   *         401:
   *           description: NOT authenticated
   */
  app.put('/reservations/:reservationID', (req, res) => {
      res.send('reservation started');
  });

  /**
   * @swagger
   * /reservations/{reservationID}/start:
   *   post:
   *     tags:
   *     - reservation
   *     description: "Start the reservation (authorized for the admin)"
   *     parameters:
   *       - in: path
   *         name: reservationID
   *         schema:
   *           type: integer
   *         required: true
   *         description: "Numeric ID of the reservation to get"
   *     requestBody:
   *       description: "Pair the reservation with the QR-code"
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReservationCodeDTO'
   */  
  app.post('/reservations/:reservationID/start', (req, res) => {
    res.send('reservation ended');
  });

  /**
   * @swagger
   * /reservations/end:
   *     post:
   *       tags:
   *       - reservation
   *       description: "Start the reservation (authorized for the admin)"
   *       requestBody:
   *         description: "Pair the reservation with the QR-code"
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ReservationCodeDTO'
   *       responses:
   *         200:
   *           description: OK
   *         400:
   *           description: Failed to finish reservation
   *         401:
   *           description: NOT authenticated
   */
  app.post('/reservations/end', (req, res) => {
    res.send('reservation ended');
  });
}