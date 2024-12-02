import {Router} from "express";
import {CarController} from "../controller/CarController";
import {CommentController} from "../controller/CommentController";
import { authenticateJWT, requireAuthentication } from "../middleware/authMiddleware";

const router = Router();
const carController = new CarController();
const commentController = new CommentController();

// Voitures
router.get('/search', carController.searchCars.bind(carController));
router.get('/:id', authenticateJWT, carController.findOne.bind(carController));
// router.post('/', carController.createCar.bind(carController));
// router.delete('/:id', carController.deleteCar.bind(carController));
router.post('/:id/vote', requireAuthentication, carController.toggleVote.bind(carController));

// Commentaires voiture
router.get('/:id/comments', authenticateJWT, commentController.findVehiculeComments.bind(commentController));
router.post('/:id/comments', requireAuthentication, commentController.createComment.bind(commentController));
router.post('/:id/comments/:commentId/vote', requireAuthentication,commentController.toggleVote.bind(commentController));

export default router;