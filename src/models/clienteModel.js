import pool from "../config/db.js";
import { buscarBarbero } from "../models/barberoModel.js"
import bcrypt from "bcrypt";

// Obtener todos los clientes (sin devolver la contraseña)
export const getClientes = async () => {
    try {
        const sqlGetClientes = "SELECT p.nombre, p.apellido, p.correo, p.telefono, c.fecha_nacimiento FROM persona p JOIN cliente c ON c.id_persona = p.id_persona;";
        const [rows] = await pool.query(sqlGetClientes);
        return rows;
    } catch (error) {
        console.error('Error en getClientes:', error);
        throw error;
    }
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
        `SELECT p.id_persona, p.nombre, p.cedula, p.apellido, p.correo, p.telefono, c.fecha_nacimiento, c.id_cliente
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

export const eliminarCliente = async (cedula) => {

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

// (cedula, id_barbero, fecha, hora) = datos
export const agendarCita = async (datos) => {
    const { cedula_cliente, cedula_barbero, fecha, hora, } = datos;
    const estado = 'pendiente';
    try {

        const barbero = await buscarBarbero(cedula_barbero);
        if (!barbero) {
            throw new Error('Barbero no existe');
        }

        const cliente = await buscarCliente(cedula_cliente);
        if (!cliente) {
            throw new Error('Cliente no existe');
        }

        const id_barbero = barbero.id_barbero;
        const id_cliente = cliente.id_cliente;

        // Validar que no exista cita en el rango de 30 minutos antes o después
        const [citas] = await pool.query(
            `SELECT * 
              FROM cita
              WHERE id_barbero = ?
              AND fecha = ?
              AND ABS(TIME_TO_SEC(hora) - TIME_TO_SEC(?)) / 60 < 30;`,
            [id_barbero, fecha, hora]
        );

        if (citas.length > 0) {
            throw new Error('El barbero ya tiene una cita en ese rango de 30 minutos');
        }

        // Insertar la cita
        const [result] = await pool.query(
            `INSERT INTO cita (id_cliente, id_barbero, fecha, hora, estado) VALUES (?, ?, ?, ?, ?);`,
            [id_cliente, id_barbero, fecha, hora, estado]
        );

        return { id_cita: result.insertId, id_cliente, id_barbero, fecha, hora, estado };
    } catch (error) {
        console.error('Error al agendar cita:', error);
        throw error;
    }
};

export const misCitas = async (cedula) => {
    const [citas] = await pool.query(`
        SELECT p.cedula AS cedula_cliente, p.nombre AS nombre_cliente, p.apellido AS apellido_cliente,
               c.id_cita, c.id_barbero, c.fecha, c.hora, c.estado,
               pb.cedula AS cedula_barbero, pb.nombre AS nombre_barbero, pb.apellido AS apellido_barbero
        FROM persona p
        JOIN cliente cl ON p.id_persona = cl.id_persona
        JOIN cita c ON c.id_cliente = cl.id_cliente
        JOIN barbero b ON c.id_barbero = b.id_barbero
        JOIN persona pb ON b.id_persona = pb.id_persona
        WHERE p.cedula = ?`,
        [cedula]);

    if (citas.length > 0) {
        const citasFormateadas = citas.map((cita) => ({
            id_cita: cita.id_cita,
            datos_cliente: {
                cedula: cita.cedula_cliente,
                nombre: `${cita.nombre_cliente} ${cita.apellido_cliente}`,
            },
            datos_barbero: {
                cedula: cita.cedula_barbero,
                nombre: `${cita.nombre_barbero} ${cita.apellido_barbero}`,
            },
            datos_cita: {
                fecha: cita.fecha,
                hora: cita.hora,
                estado: cita.estado,
            }
        }));

        return citasFormateadas;
    }

    return [];
};

