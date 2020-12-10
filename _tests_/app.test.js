const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Alpaca_walker = require('../lib/models/Alpaca_walker');
const Alpaca = require('../lib/models/Alpaca')



describe('app routes', () => {

    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

    afterAll(() => {
        return pool.end();
    });

    //alpaca_walkers routes
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

    it('finds an alpaca_walker by ID and associated alpacas via GET', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const alpacas = await Promise.all([
            {
                name: 'Blossom',
                age: 5,
                disposition: 'sunny',
                walkerId: alpaca_walker.id
            },
            {
                name: 'Darcy',
                age: 3,
                disposition: 'shy',
                walkerId: alpaca_walker.id
            },
            {
                name: 'Sebastian',
                age: 8,
                disposition: 'spitty',
                walkerId: alpaca_walker.id
            }
        ].map(alpaca => Alpaca.insert(alpaca)));

        const res = await request(app)
            .get(`/alpaca-walkers/${alpaca_walker.id}`);

        expect(res.body).toEqual({
            ...alpaca_walker,
            alpacas: expect.arrayContaining(alpacas)
        });
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

    it('deletes one alpaca_walkers by ID via DELETE, and returns it', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'upbeat',
            yearsOfExperience: 2
        });

        const res = await request(app)
            .delete(`/alpaca-walkers/${alpaca_walker.id}`);

        expect(res.body).toEqual(alpaca_walker);
    });

    //alpacas routes
    it('creates a new alpaca via POST', async () => {

        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const res = await request(app)
            .post('/alpacas')
            .send({
                name: 'Blossom',
                age: 5,
                disposition: 'sunny',
                walkerId: '1'
            });

        expect(res.body).toEqual({
            id: '1',
            name: 'Blossom',
            age: 5,
            disposition: 'sunny',
            walkerId: '1'
        });
    });

    it('retrieves all alpacas via GET', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const alpacas = await Promise.all([
            {
                name: 'Blossom',
                age: 5,
                disposition: 'sunny',
                walkerId: 1
            },
            {
                name: 'Darcy',
                age: 3,
                disposition: 'shy',
                walkerId: 1
            },
            {
                name: 'Sebastian',
                age: 8,
                disposition: 'spitty',
                walkerId: 1
            }
        ].map(alpaca => Alpaca.insert(alpaca)));

        const res = await request(app)
            .get('/alpacas');

        expect(res.body).toEqual(expect.arrayContaining(alpacas));
        expect(res.body).toHaveLength(alpacas.length);
    });

    it('retrieves an alpaca by ID from the database via GET', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const alpaca = await Alpaca.insert({
            name: 'Darcy',
            age: 3,
            disposition: 'shy',
            walkerId: 1
        });

        const response = await request(app)
            .get(`/alpacas/${alpaca.id}`);

        expect(response.body).toEqual({
            id: alpaca.id,
            name: 'Darcy',
            age: 3,
            disposition: 'shy',
            walkerId: '1'
        });
    });

    it('updates an alpaca via PUT', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const alpaca = await Alpaca.insert({
            name: 'Darcy',
            age: 3,
            disposition: 'shy',
            walkerId: 1
        });

        const res = await request(app)
            .put(`/alpacas/${alpaca.id}`)
            .send({
                name: 'Darcy',
                age: 3,
                disposition: 'mean',
                walkerId: 1
            });

        expect(res.body).toEqual({
            id: alpaca.id,
            name: 'Darcy',
            age: 3,
            disposition: 'mean',
            walkerId: '1'
        });
    });


    it('deletes an alpaca by ID via DELETE, and returns it', async () => {
        const alpaca_walker = await Alpaca_walker.insert({
            name: 'Marco',
            energyLevel: 'apathetic',
            yearsOfExperience: 2
        });

        const alpaca = await Alpaca.insert({
            name: 'Darcy',
            age: 3,
            disposition: 'shy',
            walkerId: 1
        });

        const response = await request(app)
            .delete(`/alpacas/${alpaca.id}`)
            .send(alpaca)

        expect(response.body).toEqual({
            id: alpaca.id,
            name: 'Darcy',
            age: 3,
            disposition: 'shy',
            walkerId: '1'
        });
    });

});

