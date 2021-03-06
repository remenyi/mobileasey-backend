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
 *           type: object
 *           properties:
 *             equipment:
 *               $ref: '#/components/schemas/EquipmentDTO'
 *             user:
 *               $ref: '#/components/schemas/UserDTO'
 *             from:
 *               type: string
 *               description: Reserved from (iso8601)
 *             to:
 *               type: string
 *               description: Reserved until (iso8601)
 *             reservationID:
 *               type: string
 *               description: Reservation ID
 *             reservationCode:
 *               type: string
 *               description: Reservation code (QR code)
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
const getAllReservationsMW = require('../middleware/reservationMWs/getAllReservationsMW');
const getReservationMW = require('../middleware/reservationMWs/getReservationMW');
const startMW = require('../middleware/reservationMWs/startMW');
const endMW = require('../middleware/reservationMWs/endMW');
const authorizeAdminMW = require('../middleware/authorizeAdminMW');

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
  app.post('/login', authenticateMW);

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
  app.get('/reservations', authorizeMW, getAllReservationsMW, (req, res) => {
    
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
  app.get('/reservations/:reservationID', authorizeMW, getReservationMW, (req, res) => {
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
  app.post('/reservations/:reservationID/start', authorizeMW, authorizeAdminMW, startMW, (req, res) => {
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
  app.post('/reservations/end', authorizeMW, authorizeAdminMW, endMW, (req, res) => {
  });
}