import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Obtener todos los clientes (sin devolver la contraseña)
export const getClientes = async () => {
    const sqlGetClientes = "SELECT p.nombre, p.apellido, p.correo, p.telefono, c.fecha_nacimiento FROM persona p JOIN cliente c ON c.id_persona = p.id_persona;";
    const [rows] = await pool.query(sqlGetClientes);
    return rows;
};

//Crear Cliente 
export const crearCliente = async (cliente) => {
    const { cedula, nombre, apellido, correo, password, telefono, fecha_nacimiento } = cliente;


    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    const [resultPersona] = await pool.query(
        "INSERT INTO persona (cedula, nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?);",
        [cedula, nombre, apellido, correo, telefono]
    );

    const [resultCliente] = await pool.query(
        "INSERT INTO cliente (id_persona, fecha_nacimiento, password) VALUES (?, ?, ?);",
        [resultPersona.insertId, fecha_nacimiento, hashedPassword]
    );

    return { id_persona: resultPersona.insertId, id_cliente: resultCliente.insertId, cedula, nombre, apellido, correo, telefono, fecha_nacimiento };
};

//buscar cliente por 
export const buscarCliente = async (cedula) => {

    const [rows] = await pool.query(
        `SELECT p.id_persona, p.nombre, p.cedula, p.apellido, p.correo, p.telefono, c.fecha_nacimiento
         FROM persona p JOIN cliente c ON c.id_persona = p.id_persona
         WHERE p.cedula = ?;`,
        [cedula]
    );

    if (!rows || rows.length === 0) {
        return null;
    }

    // Devolver solo el primer registro (objeto) en lugar del array
    return rows[0];

};

export const editarCliente = async (cedula, cliente) => {
    const { nombre, apellido, correo, password, telefono, fecha_nacimiento } = cliente;

    if (password) {

        const hashedNewPassword = await bcrypt.hash(password, 10);

        await pool.query(`UPDATE cliente c 
        JOIN persona p ON c.id_persona = p.id_persona SET
        p.nombre = ?, p.apellido = ?, p.correo = ?, c.password = ?, p.telefono = ?, c.fecha_nacimiento = ? 
        WHERE p.cedula = ?;`,
            [nombre, apellido, correo, hashedNewPassword, telefono, fecha_nacimiento, cedula]);
        return { cedula, nombre, apellido, correo, telefono, fecha_nacimiento, password: `Password cambiada con exito!` }
    } else {

        await pool.query(`UPDATE cliente c 
        JOIN persona p ON c.id_persona = p.id_persona SET
        p.nombre = ?, p.apellido = ?, p.correo = ?, p.telefono = ?, c.fecha_nacimiento = ? 
        WHERE p.cedula = ?;`,
            [nombre, apellido, correo, telefono, fecha_nacimiento, cedula]);
        return { cedula, nombre, apellido, correo, telefono, fecha_nacimiento }
    }




}