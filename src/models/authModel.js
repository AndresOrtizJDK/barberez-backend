
import pool from "../config/db.js";

export const findUserByEmail = async (correo) => {

    //busca por clientes

    const sqlClientes = `SELECT p.nombre, p.correo, c.password
							 FROM persona p
                             JOIN cliente c ON p.id_persona = c.id_persona
							 WHERE p.correo = ? LIMIT 1`;
    const [clientes] = await pool.query(sqlClientes, [correo]);

    if (clientes === 0) {

        //busca por barbero

        const sqlBarbero = `SELECT p.nombre, p.correo, c.password
							 FROM persona p
                             JOIN barbero c ON p.id_persona = c.id_persona
							 WHERE p.correo = ? LIMIT 1`;
        const [barberos] = await pool.query(sqlBarbero, [correo]);

        if (barberos === 0) {

            //busca por admin

            const sqlAdmin = `SELECT p.nombre, p.correo, c.password
							 FROM persona p
                             JOIN admin c ON p.id_persona = c.id_persona
							 WHERE p.correo = ? LIMIT 1`;
            const [admins] = await pool.query(sqlAdmin, [correo]);

            if(admins === 0){
                return null
            }else{
                return admins[0]
            }


        } else {
            return barberos[0];
        }


    } else {
        return clientes[0];
    }





};
