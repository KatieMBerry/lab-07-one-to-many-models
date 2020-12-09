const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');

describe('app routes', () => {

    // beforeEach(() => {
    //     return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    // });

    // afterAll(() => {
    //     return pool.end();
    // });

    it('creates a new alpaca_walker via POST', async () => {
        const response = await request(app).get('/');
        expect(response.body).toEqual({ hello: 'world' });
    });

});

