import express from "express";

import{
    getAdmins,
    crearAdmin,
    buscarAdmin,
    editarAdmin,
    eliminarAdmin
} from "../controllers/adminController.js"

const router = express.Router();

router.get("/", getAdmins);
router.post("/", crearAdmin);
router.get("/:cedula", buscarAdmin);
router.put("/:cedula", editarAdmin);
router.delete("/:cedula", eliminarAdmin);

export default router;