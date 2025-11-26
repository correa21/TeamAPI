import request from 'supertest';
import express from 'express';

/**
 * Create test app instance
 */
export async function createTestApp() {
    // Import app setup (we'll need to export app from src/index.ts)
    const app = express();
    // This will be updated once we modify index.ts to export the app
    return app;
}

/**
 * Make authenticated request
 */
export function makeAuthRequest(app: express.Application, token: string) {
    return {
        get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
        post: (url: string) => request(app).post(url).set('Authorization', `Bearer ${token}`),
        put: (url: string) => request(app).put(url).set('Authorization', `Bearer ${token}`),
        delete: (url: string) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
    };
}
