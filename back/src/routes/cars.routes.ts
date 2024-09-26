import {Router} from "express";
import {CarController} from "../controller/CarController";

const router = Router();
const carController = new CarController();

router.get('/', (req, res, next) => carController.findAll(req, res, next));
router.get('/:id', (req, res, next) => carController.findOne(req, res, next));
router.post('/', (req, res, next) => carController.createCar(req, res, next));
router.delete('/:id', (req, res, next) => carController.deleteCar(req, res, next));
router.post('/:id/like', (req, res, next) => carController.addLike(req, res, next));

export default router;