import bcrypt from "bcrypt";
import { findUserByEmail } from "../models/authModel.js";

export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        if (!correo || !password) return res.status(400).json({ message: "Correo y password requeridos" });

        const user = await findUserByEmail(correo);


        if (!user) return res.status(401).json({ message: "Usuario NO existe" });

        const nombre = user.nombre;

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Credenciales inválidas" });


        // Devolver solo datos públicos
        return res.status(200).json({ message: `Bienvenido ${nombre}` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno" });
    }
};

