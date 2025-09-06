import * as Cliente from "../models/clienteModel.js"

export const getClientes = async (req, res) => {
    const clientes = await Cliente.getClientes();
    res.json(clientes)
};

export const crearCliente = async (req, res) => {
    const nuevoCliente = await Cliente.crearCliente(req.body);
    res.json(nuevoCliente);
};

export const buscarCliente = async (req,res) =>{

    const cliente = await Cliente.buscarCliente(req.params.cedula);

    if(!cliente){
        return res.status(404).json({ message: `No se encontró al cliente con Cedula: ${req.params.cedula}` });
    }

    // Devolver un único objeto JSON que incluya el mensaje y los datos del cliente
    return res.status(200).json({ message: `Usuario encontrado con éxito`, cliente });
};

export const editarCliente = async (req, res) =>{

    const clienteActualizado = await Cliente.editarCliente(req.params.cedula, req.body);

    res.status(200).json(clienteActualizado)



};