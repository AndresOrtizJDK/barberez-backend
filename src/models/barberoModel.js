import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Obtener todos los Barberos (sin devolver la contraseña)
export const getBarberos = async () => {
    const sqlGetBarberos = "SELECT p.nombre, p.apellido, p.correo, p.telefono FROM persona p JOIN barbero c ON c.id_persona = p.id_persona;";
    const [rows] = await pool.query(sqlGetBarberos);
    return rows;
};

//Crear Barbero
export const crearBarbero = async (barbero) => {
    const { cedula, nombre, apellido, correo, password, telefono,} = barbero;


    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    const [resultPersona] = await pool.query(
        "INSERT INTO persona (cedula, nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?);",
        [cedula, nombre, apellido, correo, telefono]
    );

    const [resultBarbero] = await pool.query(
        "INSERT INTO barbero (id_persona, password) VALUES (?, ?);",
        [resultPersona.insertId, hashedPassword]
    );

    return { id_persona: resultPersona.insertId, id_barbero: resultBarbero.insertId, cedula, nombre, apellido, correo, telefono };
};

//buscar Barbero por 
export const buscarBarbero = async (cedula) => {

    const [rows] = await pool.query(
        `SELECT p.id_persona, p.nombre, p.cedula, p.apellido, p.correo, p.telefono
         FROM persona p JOIN barbero c ON c.id_persona = p.id_persona
         WHERE p.cedula = ?;`,
        [cedula]
    );

    if (!rows || rows.length === 0) {
        return null;
    }

    // Devolver solo el primer registro (objeto) en lugar del array
    return rows[0];

};

export const editarBarbero = async (cedula, barbero) => {
    const { nombre, apellido, correo, password, telefon } = barbero;

    if (password) {

        const hashedNewPassword = await bcrypt.hash(password, 10);

        await pool.query(`UPDATE barbero c 
        JOIN persona p ON c.id_persona = p.id_persona SET
        p.nombre = ?, p.apellido = ?, p.correo = ?, c.password = ?, p.telefono = ?
        WHERE p.cedula = ?;`,
            [nombre, apellido, correo, hashedNewPassword, telefono, cedula]);
        return { cedula, nombre, apellido, correo, telefono, password: `Password cambiada con exito!` }
    } else {

        await pool.query(`UPDATE barbero c 
        JOIN persona p ON c.id_persona = p.id_persona SET
        p.nombre = ?, p.apellido = ?, p.correo = ?, p.telefono = ? 
        WHERE p.cedula = ?;`,
            [nombre, apellido, correo, telefono, cedula]);
        return { cedula, nombre, apellido, correo, telefono, }
    }
}

export const eliminarBarbero = async (cedula) => {

    let eliminado = null;
    try {
        await pool.query(`DELETE FROM persona WHERE cedula = ?`, [cedula]);
        eliminado = true;
        return eliminado;
    } catch (error) {
        eliminado = false;
        return eliminado;
    }

};