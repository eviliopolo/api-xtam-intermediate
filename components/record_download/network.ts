import express from "express";
const router = express.Router();
import controller from "./controller";


router.post('/',controller.add)
router.get('/',controller.list)
router.get('/:name',controller.getOne)

export default router