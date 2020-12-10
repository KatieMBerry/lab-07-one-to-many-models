const pool = require('../utils/pool');

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
            `SELECT * FROM alpaca_walkers
            WHERE id=$1`,
            [id]
        );

        if (!rows[0]) throw new Error(`There is no Alpaca_walker with id ${id}`)
        return new Alpaca_walker(rows[0]);
    }
}