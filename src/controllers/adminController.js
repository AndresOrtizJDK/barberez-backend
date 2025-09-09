import * as Admin from "../models/adminModel.js"

export const getAdmins = async (req, res) => {
    const listAdmins = await Admin.getAdmins();
    res.status(200).json(listAdmins);
};


export const crearAdmin = async (req, res) => {
    const nuevoAdmin = await Admin.crearAdmin(req.body);
    res.status(200).json(nuevoAdmin);
};

export const buscarAdmin = async (req, res) => {

    const Admin = await Admin.buscarAdmin(req.params.cedula);

    if (!Admin) {
        return res.status(404).json({ message: `No se encontró al Admin con Cedula: ${req.params.cedula}` });
    }

    // Devolver un único objeto JSON que incluya el mensaje y los datos del Admin
    return res.status(200).json({ message: `Admin encontrado con éxito`, Admin });
};

export const editarAdmin = async (req, res) => {

    const AdminActualizado = await Admin.editarAdmin(req.params.cedula, req.body);

    res.status(200).json(AdminActualizado)
};

export const eliminarAdmin = async (req, res) => {

    const AdminEliminado = await Admin.eliminarAdmin(req.params.cedula);

    if (!AdminEliminado) {
        return res.status(404).json({ message: `No se pudo Eliminar al Admin con Cedula: ${req.params.cedula}` })
    }

    return res.status(200).json({ message: `Se Elimino al Admin con Cedula: ${req.params.cedula} con Exito!` })

};