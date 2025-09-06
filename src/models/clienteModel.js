import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Obtener todos los clientes (sin devolver la contraseña)
export const getClientes = async () => {
    const sqlGetClientes = "SELECT p.nombre, p.apellido, p.correo, p.telefono, c.fecha_nacimiento FROM persona p JOIN cliente c ON c.id_persona = p.id_persona;";
    const [rows] = await pool.query(sqlGetClientes);
    return rows;
};

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
