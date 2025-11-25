import request from 'supertest';
import {
    cleanupTestData,
    createTestTeam,
    deleteAuthUser
} from '../helpers/testHelpers';
import { app } from '../setup';

let testTeam: any;
let authUserId: string;

beforeAll(async () => {
    testTeam = await createTestTeam('Auth Test Team', 'Test Region');
});

afterAll(async () => {
    await cleanupTestData();
    if (authUserId) {
        await deleteAuthUser(authUserId);
    }
});

describe('Authentication API Endpoints', () => {
    const testEmail = `authtest${Date.now()}@example.com`;
    const testPassword = 'testpassword123';

    describe('POST /api/auth/register', () => {
        it('should register a new user and player', async () => {
            const registerData = {
                email: testEmail,
                password: testPassword,
                player_name: 'Auth Test Player',
                date_of_birth: '1995-06-15',
                curp: `AUTHTEST${Date.now().toString().slice(-8)}`,
                team_id: testTeam.id,
                federation_id: parseInt(Date.now().toString().slice(-6)),
                phone_number: '+525512345678',
                category: 'Senior'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(registerData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.player).toBeDefined();
            expect(response.body.data.user.email).toBe(testEmail);

            authUserId = response.body.data.user.id;
        });

        it('should fail with duplicate email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: testEmail,
                    password: 'different123',
                    player_name: 'Duplicate Player',
                    date_of_birth: '1995-01-01',
                    curp: `DUP${Date.now().toString().slice(-13)}`,
                    team_id: testTeam.id,
                    federation_id: parseInt(Date.now().toString().slice(-6))
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ email: 'incomplete@test.com' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.player).toBeDefined();
        });

        it('should fail with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/me', () => {
        let authToken: string;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({ email: testEmail, password: testPassword });

            authToken = loginResponse.body.data.token;
        });

        it('should return current user with valid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.player).toBeDefined();
        });

        it('should fail without token', async () => {
            const response = await request(app).get('/api/auth/me');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({ email: testEmail, password: testPassword });

            const authToken = loginResponse.body.data.token;

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
