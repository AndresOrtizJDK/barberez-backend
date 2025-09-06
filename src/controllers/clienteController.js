import * as Cliente from "../models/clienteModel.js"

export const getClientes = async (req, res) => {
    const clientes = await Cliente.getClientes();
    res.json(clientes)
};

export const crearCliente = async (req, res) => {
    const nuevoCliente = await Cliente.crearCliente(req.body);
    res.json(nuevoCliente);
};