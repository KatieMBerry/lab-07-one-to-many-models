const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Alpaca_walker = require('../lib/models/Alpaca_walker')


describe('app routes', () => {

    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

    afterAll(() => {
        return pool.end();
    });

    it('creates a new alpaca_walker via POST', async () => {
        const res = await request(app)
            .post('/alpaca-walkers')
            .send({
                name: 'Jill',
                energyLevel: 'fiesty',
                yearsOfExperience: 5
            });

        expect(res.body).toEqual({
            id: '1',
            name: 'Jill',
            energyLevel: 'fiesty',
            yearsOfExperience: 5
        });
    });

    it('retrieves all alpaca_walkers via GET', async () => {
        const alpaca_walkers = await Promise.all([
            {
                name: 'Jill',
                energyLevel: 'fiesty',
                yearsOfExperience: 5
            },
            {
                name: 'Ron',
                energyLevel: 'mellow',
                yearsOfExperience: 20
            },
            {
                name: 'Marco',
                energyLevel: 'apathetic',
                yearsOfExperience: 2
            }
        ].map(alpaca_walker => Alpaca_walker.insert(alpaca_walker)));

        const res = await request(app)
            .get('/alpaca-walkers');

        expect(res.body).toEqual(expect.arrayContaining(alpaca_walkers));
        expect(res.body).toHaveLength(alpaca_walkers.length);
    });

    it('retrieves one alpaca_walkers by ID via GET', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const res = await request(app)
            .get(`/alpaca-walkers/${alpaca_walker.id}`);

        expect(res.body).toEqual(alpaca_walker);
    });

    it('updates one alpaca_walkers by ID via PUT, and returns it', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const res = await request(app)
            .put(`/alpaca-walkers/${alpaca_walker.id}`)
            .send({
                name: 'Marco',
                energyLevel: 'upbeat',
                yearsOfExperience: 2
            });

        expect(res.body).toEqual({
            id: alpaca_walker.id,
            name: 'Marco',
            energyLevel: 'upbeat',
            yearsOfExperience: 2
        });
    });
});

