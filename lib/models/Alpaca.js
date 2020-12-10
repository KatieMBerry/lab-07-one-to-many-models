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
            `INSERT INTO alpacas (name, age, disposition, walker_id) VALUES ($1, $2, $3, $4)
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

    static async update(id, { name, age, disposition, walkerId }) {
        const { rows } = await pool.query(
            `UPDATE alpacas
            SET name=$1,
            age=$2,
            disposition=$3,
            walker_id=$4
            WHERE id=$5
            RETURNING * `,
            [name, age, disposition, walkerId, id]
        );

        if (!rows[0]) throw new Error(`There is no Alpaca with id ${id}`);
        return new Alpaca(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM alpacas
            WHERE id=$1
            RETURNING *
            `,
            [id]
        );

        if (!rows[0]) throw new Error(`No alpacas by id ${id}.`);
        return new Alpaca(rows[0]);
    }
}

