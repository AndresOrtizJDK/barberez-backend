import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Obtener todos los Admins (sin devolver la contraseña)
export const getAdmins = async () => {
    const sqlGetAdmins = "SELECT p.nombre, p.apellido, p.correo, p.telefono FROM persona p JOIN admin c ON c.id_persona = p.id_persona;";
    const [rows] = await pool.query(sqlGetAdmins);
    return rows;
};

//Crear admin
export const crearAdmin = async (admin) => {
    const { cedula, nombre, apellido, correo, password, telefono, } = admin;


    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    const [resultPersona] = await pool.query(
        "INSERT INTO persona (cedula, nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?);",
        [cedula, nombre, apellido, correo, telefono]
    );

    const [resultadmin] = await pool.query(
        "INSERT INTO admin (id_persona, password) VALUES (?, ?);",
        [resultPersona.insertId, hashedPassword]
    );

    return { id_persona: resultPersona.insertId, id_admin: resultadmin.insertId, cedula, nombre, apellido, correo, telefono };
};

//buscar admin por 
export const buscarAdmin = async (cedula) => {

    const [rows] = await pool.query(
        `SELECT p.id_persona, p.nombre, p.cedula, p.apellido, p.correo, p.telefono
         FROM persona p JOIN admin c ON c.id_persona = p.id_persona
         WHERE p.cedula = ?;`,
        [cedula]
    );

    if (!rows || rows.length === 0) {
        return null;
    }

    // Devolver solo el primer registro (objeto) en lugar del array
    return rows[0];

};

export const editarAdmin = async (cedula, admin) => {
    const { nombre, apellido, correo, password, telefon } = admin;

    if (password) {

        const hashedNewPassword = await bcrypt.hash(password, 10);

        await pool.query(`UPDATE admin c 
        JOIN persona p ON c.id_persona = p.id_persona SET
        p.nombre = ?, p.apellido = ?, p.correo = ?, c.password = ?, p.telefono = ?
        WHERE p.cedula = ?;`,
            [nombre, apellido, correo, hashedNewPassword, telefono, cedula]);
        return { cedula, nombre, apellido, correo, telefono, password: `Password cambiada con exito!` }
    } else {

        await pool.query(`UPDATE admin c 
        JOIN persona p ON c.id_persona = p.id_persona SET
        p.nombre = ?, p.apellido = ?, p.correo = ?, p.telefono = ? 
        WHERE p.cedula = ?;`,
            [nombre, apellido, correo, telefono, cedula]);
        return { cedula, nombre, apellido, correo, telefono, }
    }
}

export const eliminarAdmin = async (cedula) => {

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

export const historialCitas = async () => {
    const [citas] = await pool.query(`
        SELECT p.cedula AS cedula_cliente, p.nombre AS nombre_cliente, p.apellido AS apellido_cliente,
               c.id_cita, c.id_barbero, c.fecha, c.hora, c.estado,
               pb.cedula AS cedula_barbero, pb.nombre AS nombre_barbero, pb.apellido AS apellido_barbero
        FROM persona p
        JOIN cliente cl ON p.id_persona = cl.id_persona
        JOIN cita c ON c.id_cliente = cl.id_cliente
        JOIN barbero b ON c.id_barbero = b.id_barbero
        JOIN persona pb ON b.id_persona = pb.id_persona
        order by c.fecha DESC, c.hora DESC;
        `);

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
export const citasPendientes = async () => {
    const [citas] = await pool.query(`
        SELECT p.cedula AS cedula_cliente, p.nombre AS nombre_cliente, p.apellido AS apellido_cliente,
               c.id_cita, c.id_barbero, c.fecha, c.hora, c.estado,
               pb.cedula AS cedula_barbero, pb.nombre AS nombre_barbero, pb.apellido AS apellido_barbero
        FROM persona p
        JOIN cliente cl ON p.id_persona = cl.id_persona
        JOIN cita c ON c.id_cliente = cl.id_cliente
        JOIN barbero b ON c.id_barbero = b.id_barbero
        JOIN persona pb ON b.id_persona = pb.id_persona
        WHERE c.estado = "pendiente"
        order by c.fecha DESC, c.hora DESC;
        `);

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
export const citasConfirmadas = async () => {
    const [citas] = await pool.query(`
          SELECT p.cedula AS cedula_cliente, p.nombre AS nombre_cliente, p.apellido AS apellido_cliente,
               c.id_cita, c.id_barbero, c.fecha, c.hora, c.estado,
               pb.cedula AS cedula_barbero, pb.nombre AS nombre_barbero, pb.apellido AS apellido_barbero
        FROM persona p
        JOIN cliente cl ON p.id_persona = cl.id_persona
        JOIN cita c ON c.id_cliente = cl.id_cliente
        JOIN barbero b ON c.id_barbero = b.id_barbero
        JOIN persona pb ON b.id_persona = pb.id_persona
        WHERE c.estado = "confirmada"
        order by c.fecha DESC, c.hora DESC;
        `);

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