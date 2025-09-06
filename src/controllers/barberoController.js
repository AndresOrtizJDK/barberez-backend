import * as Barbero from "../models/barberoModel.js"

export const getBarberos = async (req, res) => {
    const listBarberos = await Barbero.getBarberos();
    res.status(200).json(listBarberos);
};


export const crearBarbero = async (req, res) => {
    const nuevoBarbero = await Barbero.crearBarbero(req.body);
    res.status(200).json(nuevoBarbero);
};

export const buscarBarbero = async (req, res) => {

    const barbero = await Barbero.buscarBarbero(req.params.cedula);

    if (!barbero) {
        return res.status(404).json({ message: `No se encontró al Barbero con Cedula: ${req.params.cedula}` });
    }

    // Devolver un único objeto JSON que incluya el mensaje y los datos del barbero
    return res.status(200).json({ message: `Barbero encontrado con éxito`, barbero });
};

export const editarBarbero = async (req, res) => {

    const barberoActualizado = await Barbero.editarBarbero(req.params.cedula, req.body);

    res.status(200).json(barberoActualizado)
};

export const eliminarBarbero = async (req, res) => {

    const barberoEliminado = await Barbero.eliminarBarbero(req.params.cedula);

    if (!barberoEliminado) {
        return res.status(404).json({ message: `No se pudo Eliminar al Barbero con Cedula: ${req.params.cedula}` })
    }

    return res.status(200).json({ message: `Se Elimino al Barbero con Cedula: ${req.params.cedula} con Exito!` })

};