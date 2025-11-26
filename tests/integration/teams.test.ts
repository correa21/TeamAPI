import request from 'supertest';
import {
    cleanupTestData,
    createTestTeam,
    createTestAdmin
} from '../helpers/testHelpers';
import { app } from '../setup';

let testTeam: any;

beforeAll(async () => {
    testTeam = await createTestTeam();
});

afterAll(async () => {
    await cleanupTestData();
});

describe('Team API Endpoints', () => {
    describe('GET /api/teams', () => {
        it('should return all teams', async () => {
            const team = await createTestTeam();

            const response = await request(app).get('/api/teams');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/teams', () => {
        it('should create a new team', async () => {
            const { token } = await createTestAdmin();
            const timestamp = Date.now();
            const newTeam = {
                name: `New Test Team ${timestamp}`,
                region: 'New Region'
            };

            const response = await request(app)
                .post('/api/teams')
                .set('Authorization', `Bearer ${token}`)
                .send(newTeam);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(newTeam.name);
            expect(response.body.data.region).toBe(newTeam.region);
        });

        it('should fail without required fields', async () => {
            const { token } = await createTestAdmin();
            const response = await request(app)
                .post('/api/teams')
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/teams/:id', () => {
        it('should return a specific team', async () => {
            const team = await createTestTeam();

            const response = await request(app).get(`/api/teams/${team.id}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(team.id);
        });

        it('should return 404 for non-existent team', async () => {
            const response = await request(app).get('/api/teams/00000000-0000-0000-0000-000000000000');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/teams/:id', () => {
        it('should update a team', async () => {
            const { token } = await createTestAdmin();
            const team = await createTestTeam();
            const timestamp = Date.now();
            const updates = { name: `Updated Team Name ${timestamp}` };

            const response = await request(app)
                .put(`/api/teams/${team.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updates);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(updates.name);
        });
    });

    describe('DELETE /api/teams/:id', () => {
        it('should delete a team', async () => {
            const { token } = await createTestAdmin();
            const team = await createTestTeam();

            const response = await request(app)
                .delete(`/api/teams/${team.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // Verify it's deleted
            const getResponse = await request(app).get(`/api/teams/${team.id}`);
            expect(getResponse.status).toBe(404);
        });
    });
});
