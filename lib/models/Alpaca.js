const pool = require('../utils/pool');

module.exports = class Alpaca {
    id;
    name;
    age;
    disposition;
    walkerId;

    constructor(row) {
        this.id = String(row.id);
        this.name = row.name;
        this.age = row.age;
        this.disposition = row.disposition;
        this.walkerId = String(row.walker_id);
    }

    static async insert({ name, age, disposition, walkerId }) {
        const { rows } = await pool.query(
            `INSERT INTO alpacas
            (name, age, disposition, walker_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [name, age, disposition, walkerId]
        );
        return new Alpaca(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query('SELECT * FROM alpacas',
        );
        return rows.map(row => new Alpaca(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT * FROM alpacas
            WHERE id=$1
            `,
            [id]
        );
        if (!rows[0]) throw new Error(`No alpacas by id ${id}.`);
        return new Alpaca(rows[0]);
    }

}

