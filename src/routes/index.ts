import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import * as playerController from '../controllers/player.controller';
import * as playerNumberController from '../controllers/playerNumber.controller';
import * as affiliationController from '../controllers/affiliation.controller';
import * as paymentController from '../controllers/payment.controller';
import * as adminController from '../controllers/admin.controller';
import * as seasonController from '../controllers/season.controller';
import * as statsController from '../controllers/stats.controller';
import * as authController from '../controllers/auth.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

// ==================== AUTH ROUTES ====================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - player_name
 *               - date_of_birth
 *               - curp
 *               - team_id
 *               - federation_id
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               player_name:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               curp:
 *                 type: string
 *               team_id:
 *                 type: string
 *                 format: uuid
 *               federation_id:
 *                 type: integer
 *               phone_number:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/auth/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                     player:
 *                       type: object
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/auth/logout', authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *       401:
 *         description: Not authenticated
 */
router.get('/auth/me', authMiddleware, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post('/auth/forgot-password', authController.forgotPassword);

// ==================== TEAM ROUTES ====================

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of all teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 */
router.get('/teams', teamController.getAllTeams);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Team details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 */
router.get('/teams/:id', teamController.getTeamById);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - region
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Team
 *               region:
 *                 type: string
 *                 example: Ciudad de México
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 */
router.post('/teams', teamController.createTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               region:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 */
router.put('/teams/:id', teamController.updateTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Team deleted successfully
 */
router.delete('/teams/:id', teamController.deleteTeam);

// ==================== PLAYER ROUTES ====================

/**
 * @swagger
 * /api/players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: List of all players
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 */
router.get('/players', playerController.getAllPlayers);

/**
 * @swagger
 * /api/players/{id}:
 *   get:
 *     summary: Get player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 */
router.get('/players/:id', playerController.getPlayerById);

/**
 * @swagger
 * /api/players/team/{teamId}:
 *   get:
 *     summary: Get all players in a team
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of players in the team
 */
router.get('/players/team/:teamId', playerController.getPlayersByTeam);

/**
 * @swagger
 * /api/players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       201:
 *         description: Player created successfully
 */
router.post('/players', playerController.createPlayer);

/**
 * @swagger
 * /api/players/{id}:
 *   put:
 *     summary: Update a player
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       200:
 *         description: Player updated successfully
 */
router.put('/players/:id', playerController.updatePlayer);

/**
 * @swagger
 * /api/players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player deleted successfully
 */
router.delete('/players/:id', playerController.deletePlayer);

// ==================== PLAYER NUMBER ROUTES ====================

/**
 * @swagger
 * /api/player-numbers:
 *   get:
 *     summary: Get all player numbers
 *     tags: [Player Numbers]
 *     responses:
 *       200:
 *         description: List of all player numbers
 */
router.get('/player-numbers', playerNumberController.getAllPlayerNumbers);

/**
 * @swagger
 * /api/player-numbers/player/{playerId}:
 *   get:
 *     summary: Get player number by player ID
 *     tags: [Player Numbers]
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player number details
 */
router.get('/player-numbers/player/:playerId', playerNumberController.getPlayerNumberByPlayerId);

/**
 * @swagger
 * /api/player-numbers:
 *   post:
 *     summary: Assign a jersey number to a player
 *     tags: [Player Numbers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerNumber'
 *     responses:
 *       201:
 *         description: Player number assigned successfully
 */
router.post('/player-numbers', playerNumberController.createPlayerNumber);

/**
 * @swagger
 * /api/player-numbers/{id}:
 *   put:
 *     summary: Update player number
 *     tags: [Player Numbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player number updated
 */
router.put('/player-numbers/:id', playerNumberController.updatePlayerNumber);

/**
 * @swagger
 * /api/player-numbers/{id}:
 *   delete:
 *     summary: Delete player number
 *     tags: [Player Numbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player number deleted
 */
router.delete('/player-numbers/:id', playerNumberController.deletePlayerNumber);

// ==================== AFFILIATION ROUTES ====================

/**
 * @swagger
 * /api/affiliations:
 *   get:
 *     summary: Get all affiliations
 *     tags: [Affiliations]
 *     responses:
 *       200:
 *         description: List of all affiliations
 */
router.get('/affiliations', affiliationController.getAllAffiliations);

/**
 * @swagger
 * /api/affiliations/player/{playerId}:
 *   get:
 *     summary: Get affiliation by player ID
 *     tags: [Affiliations]
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Affiliation details
 */
router.get('/affiliations/player/:playerId', affiliationController.getAffiliationByPlayerId);

/**
 * @swagger
 * /api/affiliations:
 *   post:
 *     summary: Create player affiliation
 *     tags: [Affiliations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Affiliations'
 *     responses:
 *       201:
 *         description: Affiliation created
 */
router.post('/affiliations', affiliationController.createAffiliation);

/**
 * @swagger
 * /api/affiliations/{id}:
 *   put:
 *     summary: Update affiliation
 *     tags: [Affiliations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Affiliation updated
 */
router.put('/affiliations/:id', affiliationController.updateAffiliation);

/**
 * @swagger
 * /api/affiliations/{id}:
 *   delete:
 *     summary: Delete affiliation
 *     tags: [Affiliations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Affiliation deleted
 */
router.delete('/affiliations/:id', affiliationController.deleteAffiliation);

// ==================== PAYMENT ROUTES ====================

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payment records
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payments'
 */
router.get('/payments', paymentController.getAllPayments);

/**
 * @swagger
 * /api/payments/player/{playerId}:
 *   get:
 *     summary: Get payment record by player ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment details
 */
router.get('/payments/player/:playerId', paymentController.getPaymentByPlayerId);

/**
 * @swagger
 * /api/payments/debt:
 *   get:
 *     summary: Get all players with outstanding debt
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of players with debt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payments'
 */
router.get('/payments/debt', paymentController.getPlayersWithDebt);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create payment record
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payments'
 *     responses:
 *       201:
 *         description: Payment created
 */
router.post('/payments', paymentController.createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment record
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment updated
 */
router.put('/payments/:id', paymentController.updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete payment record
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment deleted
 */
router.delete('/payments/:id', paymentController.deletePayment);

// ==================== ADMIN ROUTES ====================

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: List of all admins
 */
router.get('/admins', adminController.getAllAdmins);

/**
 * @swagger
 * /api/admins/player/{playerId}:
 *   get:
 *     summary: Get admin by player ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin details
 */
router.get('/admins/player/:playerId', adminController.getAdminByPlayerId);

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Create admin role
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Admin created
 */
router.post('/admins', adminController.createAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Update admin role
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin updated
 */
router.put('/admins/:id', adminController.updateAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Remove admin role
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin deleted
 */
router.delete('/admins/:id', adminController.deleteAdmin);

// ==================== SEASON ROUTES ====================

/**
 * @swagger
 * /api/seasons:
 *   get:
 *     summary: Get all seasons
 *     tags: [Seasons]
 *     responses:
 *       200:
 *         description: List of all seasons
 */
router.get('/seasons', seasonController.getAllSeasons);

/**
 * @swagger
 * /api/seasons/{id}:
 *   get:
 *     summary: Get season by ID
 *     tags: [Seasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Season details
 */
router.get('/seasons/:id', seasonController.getSeasonById);

/**
 * @swagger
 * /api/seasons:
 *   post:
 *     summary: Create a new season
 *     tags: [Seasons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Season'
 *     responses:
 *       201:
 *         description: Season created
 */
router.post('/seasons', authMiddleware, adminMiddleware, seasonController.createSeason);

/**
 * @swagger
 * /api/seasons/{id}:
 *   put:
 *     summary: Update season
 *     tags: [Seasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Season updated
 */
router.put('/seasons/:id', authMiddleware, adminMiddleware, seasonController.updateSeason);

/**
 * @swagger
 * /api/seasons/{id}:
 *   delete:
 *     summary: Delete season
 *     tags: [Seasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Season deleted
 */
router.delete('/seasons/:id', authMiddleware, adminMiddleware, seasonController.deleteSeason);

// ==================== STATS ROUTES ====================

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get all stats
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: List of all stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stats'
 */
router.get('/stats', statsController.getAllStats);

/**
 * @swagger
 * /api/stats/{id}:
 *   get:
 *     summary: Get stats by ID
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stats details
 */
router.get('/stats/:id', statsController.getStatsById);

/**
 * @swagger
 * /api/stats/player/{playerId}:
 *   get:
 *     summary: Get all stats for a player
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player stats across all seasons
 */
router.get('/stats/player/:playerId', statsController.getStatsByPlayerId);

/**
 * @swagger
 * /api/stats/season/{seasonId}:
 *   get:
 *     summary: Get all stats for a season
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Season stats for all players
 */
router.get('/stats/season/:seasonId', statsController.getStatsBySeasonId);

/**
 * @swagger
 * /api/stats:
 *   post:
 *     summary: Create stats record
 *     tags: [Stats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stats'
 *     responses:
 *       201:
 *         description: Stats created
 */
router.post('/stats', statsController.createStats);

/**
 * @swagger
 * /api/stats/{id}:
 *   put:
 *     summary: Update stats record
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stats updated
 */
router.put('/stats/:id', statsController.updateStats);

/**
 * @swagger
 * /api/stats/{id}:
 *   delete:
 *     summary: Delete stats record
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stats deleted
 */
router.delete('/stats/:id', statsController.deleteStats);

export default router;
