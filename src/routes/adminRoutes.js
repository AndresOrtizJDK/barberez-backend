import express from "express";

import{
    getAdmins,
    crearAdmin,
    buscarAdmin,
    editarAdmin,
    eliminarAdmin,
    historialCitas,
    citasPendientes,
    citasConfirmadas
} from "../controllers/adminController.js"

const router = express.Router();

router.get("/", getAdmins);
router.get("/historialCitas", historialCitas);
router.get("/citasPendientes", citasPendientes);
router.get("/citasConfirmadas", citasConfirmadas);
router.get("/:cedula", buscarAdmin);
router.post("/", crearAdmin);
router.put("/:cedula", editarAdmin);
router.delete("/:cedula", eliminarAdmin);


export default router;