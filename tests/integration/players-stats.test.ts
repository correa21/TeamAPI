import request from 'supertest';
import {
    cleanupTestData,
    createTestTeam,
    createTestPlayer,
    createTestSeason,
    createTestAdmin
} from '../helpers/testHelpers';
import { app } from '../setup';

let testTeam: any;
let testPlayer: any;
let testSeason: any;

beforeAll(async () => {
    testTeam = await createTestTeam();
    testPlayer = await createTestPlayer(testTeam.id);
    testSeason = await createTestSeason();
});

afterAll(async () => {
    await cleanupTestData();
});

describe('Player API Endpoints', () => {
    describe('GET /api/players', () => {
        it('should return all players', async () => {
            const response = await request(app).get('/api/players');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/players/:id', () => {
        it('should return a specific player', async () => {
            const response = await request(app).get(`/api/players/${testPlayer.id}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.player_id).toBe(testPlayer.id);
        });
    });

    describe('GET /api/players/team/:teamId', () => {
        it('should return players by team', async () => {
            const response = await request(app).get(`/api/players/team/${testTeam.id}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });
});

describe('Season API Endpoints', () => {
    describe('GET /api/seasons', () => {
        it('should return all seasons', async () => {
            const response = await request(app).get('/api/seasons');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('POST /api/seasons', () => {
        it('should create a new season', async () => {
            const { token } = await createTestAdmin();
            const newSeason = {
                name: `Test Season ${Date.now()}`,
                modality: '7s'
            };

            const response = await request(app)
                .post('/api/seasons')
                .set('Authorization', `Bearer ${token}`)
                .send(newSeason);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(newSeason.name);
            expect(response.body.data.modality).toBe(newSeason.modality);
        });
    });
});

describe('Stats API Endpoints', () => {
    let testStats: any;

    describe('POST /api/stats', () => {
        it('should create player stats', async () => {
            const { token } = await createTestAdmin();
            const statsData = {
                player_id: testPlayer.id,
                season_id: testSeason.id,
                yellow_card: 0,
                red_card: 0,
                try: 3,
                conversion: 2,
                drop: 0,
                penalty_scored: 1,
                points: 21
            };

            const response = await request(app)
                .post('/api/stats')
                .set('Authorization', `Bearer ${token}`)
                .send(statsData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.try).toBe(statsData.try);
            expect(response.body.data.points).toBe(statsData.points);

            testStats = response.body.data;
        });
    });

    describe('GET /api/stats/player/:playerId', () => {
        it('should return stats for a player', async () => {
            const response = await request(app).get(`/api/stats/player/${testPlayer.id}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/stats/season/:seasonId', () => {
        it('should return stats for a season', async () => {
            const response = await request(app).get(`/api/stats/season/${testSeason.id}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});
