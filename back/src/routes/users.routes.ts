import {Router} from "express";
import {UserController} from "../controller/UserController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();
const userController = new UserController();

router.get('/me', authenticateJWT, (req, res, next) => userController.findCurrentUser(req, res, next));
router.post('/', (req, res, next) => userController.createUser(req, res, next));
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.post('/logout', authenticateJWT,(req, res, next) => userController.logout(req, res));
router.post('/refreshToken', (req, res, next) => userController.refreshToken(req, res));
router.get('/me', authenticateJWT, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ isAuthenticated: false });
    }
    return res.json({
        isAuthenticated: true,
        user: {
            id: req.user.id,
            pseudo: req.user.pseudo,
            name: req.user.name
        }
    });
});

export default router;