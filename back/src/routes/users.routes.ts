import {Router} from "express";
import {UserController} from "../controller/UserController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();
const userController = new UserController();

router.get('/me', authenticateJWT, (req, res, next) => userController.findCurrentUser(req, res, next));
router.post('/', (req, res, next) => userController.createUser(req, res, next));
// router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.post('/logout', authenticateJWT,(req, res, next) => userController.logout(req, res));

export default router;