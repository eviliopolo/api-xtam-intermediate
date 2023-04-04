import express, { Router } from "express";
const router = express.Router()
import controller from "./controller";

router.post('/',controller.add)
router.get('/',controller.list)
router.post('/getOne/:id_xtam',controller.oneRecording)
router.put('/:id',controller.updateRecording)
router.delete('/:id',controller.deleteRecording)
router.post('/histogram/',controller.histogramTime)
router.post('/histogramday/',controller.histogramTimeForDay)
export default router