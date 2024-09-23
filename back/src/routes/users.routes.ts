import {Router} from "express";
import {UserController} from "../controller/UserController";

const router = Router();
const userController = new UserController();

router.get('/', (req, res, next) => userController.findAll(req, res, next));
router.get('/:id', (req, res, next) => userController.findOne(req, res, next));
router.post('/', (req, res, next) => userController.createUser(req, res, next));
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

export default router;