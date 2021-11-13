/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: "User email"
 *         password:
 *           type: string
 *           description: "User password"
 *       example:
 *          email: "employeename@companyname.com"
 *          password: "7Hdnv4hvGlV2"
 *     EquipmentList:
 *       type: object
 *       required:
 *         - equipments
 *       properties:
 *         equipments:
 *           type: array
 *           description: "List of equipment names"
 *           items: 
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Equipment name"
 *               equipmentId:
 *                 type: integer
 *                 description: "Equipment ID"
 *       example:
 *         equipments:
 *           - name: "Lenovo ThinkPad T480"
 *             equipmentId: 912834
 *           - name: "Lenovo ThinkPad T495"
 *             equipmentId: 27384
 *     EquipmentDetails:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - reservations
 *       properties:
 *         name:
 *           type: string
 *           description: "Equipment name"
 *         type:
 *           type: string
 *           description: "Equipment type"
 *         reservations:
 *            type: array
 *            items:
 *              $ref: '#components/schemas/Reservation'
 *       example:
 *          name: "Lenovo ThinkPad T480"
 *          type: "Laptop"
 *          reservations:
 *            - from: "2021-01-01 16:23:41"
 *              to: "2022-01-01 16:23:41"
 *              booker: "John Doe"
 *     Reservation:
 *       type: object
 *       required:
 *         - from
 *         - to
 *         - equipmentId
 *       properties:
 *         from:
 *           type: date
 *           description: "Reserved from"
 *         to:
 *           type: date
 *           description: "Reserved until"
 *         equipmentId:
 *            type: integer
 *            description: "Equipment ID"
 *       example:
 *          from: "2021-01-01 16:23:41"
 *          to: "2022-01-01 16:23:41"
 *          equipmentId: 6156913
 *     ReservationList:
 *       type: object
 *       required:
 *         - device
 *         - booker
 *         - from
 *         - reservationId
 *       properties:
 *         device:
 *           type: string
 *           description: "Device name"
 *         booker:
 *            type: string
 *            description: "Name of booker"
 *         from:
 *           type: date
 *           description: "Reserved from"
 *         reservationId:
 *           type: integer
 *           description: "Reservation ID"
 *       example:
 *          from: "2021-01-01 16:23:41"
 *          device: "Lenovo ThinkPad T480"
 *          booker: "John Doe"
 *          reservationId: 7498762
 *     ReservationStatus:
 *       type: object
 *       required:
 *         - reservationStatus
 *       properties:
 *         reservationStatus:
 *           type: string
 *           enum: [successful, failed]
 *       example:
 *         reservationStatus: "successful"
 *     ReservationChange:
 *       type: object
 *       required:
 *         - reservationId
 *         - reservationCode
 *       properties:
 *         reservationId:
 *           type: integer
 *         reservationCode:
 *           type: interger
 *           describe: "Code read from QR-code"
 *       example:
 *         reservationId: 5861253
 *         reservationCode: 98654234
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
*/

module.exports = function(app) {

  /**
   * @swagger
   * /login:
   *  post:
   *    description: "Perform user authentication"
   *    requestBody:
   *      description: "User authentication with email and password"
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/User'
   *    responses:
   *      200:
   *        description: "Send JWT"
   *      401:
   *        description: "NOT authenticated"
   */
  app.get('/login', (req, res) => {
    res.send('login');
  });

  /**
   * @swagger
   * /equipment/list:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     description: "Get list of devices (authorized for the user)"
   *     responses:
   *       200:
   *         description: "List of devices"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/EquipmentList'
   *       401:
   *         description: NOT authenticated
   */
  app.get('/equipment/list', (req, res) => {
    res.send('list of devices');
  });

  /**
   * @swagger
   * /equipment/{equipmentId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     description: "Get device details (authorized for the user)"
   *     parameters:
   *       - in: path
   *         name: equipmentId
   *         schema:
   *           type: integer
   *         required: true
   *         description: "Numeric ID of the equipment to get"
   *     responses:
   *       200:
   *         description: "device details"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/EquipmentDetails'
   *       401:
   *         description: NOT authenticated
   */
  app.get('/equipment/:eid', (req, res) => {
    res.send('device details');
  });

  /**
   * @swagger
   * /equipment/reserve:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     description: "Reserve equipment (authorized for the user)"
   *     requestBody:
   *       description: "Reservation details"
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Reservation'
   *     responses:
   *       200:
   *         description: "Device reservation status"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ReservationStatus"
   *       401:
   *         description: NOT authenticated
   */
  app.put('/equipment/reserve/', (req, res) => {
    res.send('equipment reserved');
  });

  /**
   * @swagger
   * /reservation/list:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     description: "Get list of reservations (authorized for the admin)"
   *     responses:
   *       200:
   *         description: "List of reservations"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ReservationList'
   *       401:
   *         description: NOT authenticated
   */
  app.get('/reservation/list/', (req, res) => {
    res.send('list of reservations');
  });

  /**
   * @swagger
   * /reservation/start:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     description: "Start the reservation (authorized for the admin)"
   *     requestBody:
   *       description: "Pair the reservation with the QR-code"
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReservationChange'
   *     responses:
   *       200:
   *         description: "Device reservation status"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ReservationStatus"
   *       401:
   *         description: NOT authenticated
   */
  app.put('/reservation/start/', (req, res) => {
      res.send('reservation started');
  });

  /**
   * @swagger
   * /reservation/end:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     description: "End the reservation (authorized for the admin)"
   *     requestBody:
   *       description: "Unpair the reservation with the QR-code"
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReservationChange'
   *     responses:
   *       200:
   *         description: "Device reservation status"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ReservationStatus"
   *       401:
   *         description: NOT authenticated
   */
  app.put('/reservation/end/', (req, res) => {
    res.send('reservation ended');
  });
}