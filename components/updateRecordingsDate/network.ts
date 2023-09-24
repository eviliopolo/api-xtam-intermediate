import express, { Router } from "express";
const router = express.Router()
import controller from "./controller";

router.post('/',controller.add)
router.get('/getOne/:id_cam',controller.getOne)
router.put('/:id_cam',controller.updateDate)
export default router