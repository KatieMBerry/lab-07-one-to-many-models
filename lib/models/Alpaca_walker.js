const pool = require('../utils/pool');
const Alpaca = require('./Alpaca');

module.exports = class Alpaca_walker {
    id;
    name;
    energyLevel;
    yearsOfExperience;

    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.energyLevel = row.energy_level;
        this.yearsOfExperience = row.years_of_experience;
    }

    static async insert({ name, energyLevel, yearsOfExperience }) {
        const { rows } = await pool.query(
            `INSERT INTO alpaca_walkers (name, energy_level, years_of_experience)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, energyLevel, yearsOfExperience]
        );
        return new Alpaca_walker(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query('SELECT * FROM alpaca_walkers');

        return rows.map(row => new Alpaca_walker(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT 
                alpaca_walkers.*,
                array_to_json(array_agg(alpacas.*)) AS alpacas
            FROM
                alpaca_walkers
            JOIN alpacas
            ON alpaca_walkers.id = alpacas.walker_id
            WHERE alpaca_walkers.id=$1
            GROUP BY alpaca_walkers.id
            `,
            [id]
        );

        if (!rows[0]) throw new Error(`There is no Alpaca_walker with id ${id}`);

        return {
            ...new Alpaca_walker(rows[0]),
            alpacas: rows[0].alpacas.map(alpaca => new Alpaca(alpaca))
        };
    }

    static async update(id, { name, energyLevel, yearsOfExperience }) {
        const { rows } = await pool.query(
            `UPDATE alpaca_walkers
            SET name=$1,
            energy_level=$2,
            years_of_experience=$3
            WHERE id=$4
            RETURNING * `,
            [name, energyLevel, yearsOfExperience, id]
        );

        if (!rows[0]) throw new Error(`There is no Alpaca_walker with id ${id}`);
        return new Alpaca_walker(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            'DELETE FROM alpaca_walkers WHERE id=$1 RETURNING *',
            [id]
        );

        return new Alpaca_walker(rows[0]);
    }
}