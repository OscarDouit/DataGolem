import { NextFunction, Request, Response } from "express";
import { Car } from "../entity/car";
import { AppDataSource } from "../index";
import { Comment } from "../entity/comment";
import { CommentDto } from "../dto/comment.dto";
import { userDtoFactory } from "../dto/user.dto";
import { CommentLike } from "../entity/comment-like";

export class CommentController {
    private carRepository = AppDataSource.getRepository(Car);
    private carCommentRepository = AppDataSource.getRepository(Comment);

    async findVehiculeComments(request: Request, response: Response, next: NextFunction) {
        const carId = parseInt(request.params.id);
        
        const comments = await this.carCommentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.likes', 'likes')
            .leftJoinAndSelect('likes.user', 'likeUser')
            .where('comment.car.id = :carId', { carId })
            .orderBy('comment.createdAt', 'DESC')
            .getMany();

        const result: CommentDto[] = comments.map(comment => ({
            id: comment.id,
            content: comment.text,
            user: {
                id: comment.user.id,
                pseudo: comment.user.pseudo,
                email: comment.user.email
            },
            likes: comment.likes.filter(like => like.type === 'like').length,
            dislikes: comment.likes.filter(like => like.type === 'dislike').length,
            userVote: comment.likes.find(like => like.user?.id === request.user?.id)?.type,
            createdAt: comment.createdAt
        }));

        return response.json(result);
    }

    async createComment(request: Request, response: Response, next: NextFunction) {
        const { content } = request.body;
        const carId = parseInt(request.params.id);
        const user = request.user;
        
        const car = await this.carRepository.findOneBy({ id: carId });

        if (!car) {
            response.status(404);
            return response.json({ message: "Car not found" });
        }

        const comment = new Comment(content, user, car);
        const savedComment = await this.carCommentRepository.save(comment);

        // Récupérer le commentaire avec l'utilisateur
        const commentWithUser = await this.carCommentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .where('comment.id = :id', { id: savedComment.id })
            .getOne();

        const result: CommentDto = {
            id: commentWithUser.id,
            content: commentWithUser.text,
            user: {
                id: commentWithUser.user.id,
                pseudo: commentWithUser.user.pseudo,
                email: commentWithUser.user.email
            },
            likes: 0,
            dislikes: 0,
            userVote: null,
            createdAt: commentWithUser.createdAt
        };

        response.status(201);
        return response.json(result);
    }

    async toggleVote(request: Request, response: Response, next: NextFunction) {
        try {
            const commentId = parseInt(request.params.commentId);
            const carId = parseInt(request.params.id);
            const userId = request.user.id;
            const { type } = request.body;

            if (!['like', 'dislike'].includes(type)) {
                return response.status(400).json({ message: "Type de vote invalide" });
            }

            // Vérification que le commentaire appartient bien à la voiture (carId)
            const comment = await this.carCommentRepository.findOne({
                where: {
                    id: commentId,
                    car: { id: carId }
                },
                relations: ['car']
            });

            if (!comment) {
                return response.status(404).json({ 
                    message: "Commentaire non trouvé ou n'appartient pas à cette voiture" 
                });
            }

            const commentLikeRepository = AppDataSource.getRepository(CommentLike);
            
            // Gestion du vote
            const existingVote = await commentLikeRepository.findOne({
                where: {
                    comment: { id: commentId },
                    user: { id: userId }
                }
            });

            if (existingVote) {
                if (existingVote.type === type) {
                    await commentLikeRepository.remove(existingVote);
                } else {
                    existingVote.type = type;
                    await commentLikeRepository.save(existingVote);
                }
            } else {
                const newVote = commentLikeRepository.create({
                    comment: { id: commentId },
                    user: { id: userId },
                    type
                });
                await commentLikeRepository.save(newVote);
            }

            // On va récupérer les informations du commntaire
            const updatedComment = await this.carCommentRepository
                .createQueryBuilder('comment')
                .leftJoinAndSelect('comment.user', 'user')
                .leftJoinAndSelect('comment.likes', 'likes')
                .leftJoinAndSelect('likes.user', 'likeUser')
                .where('comment.id = :commentId', { commentId })
                .getOne();

            if (!updatedComment) {
                return response.status(404).json({ message: "Commentaire non trouvé" });
            }

            const commentDto: CommentDto = {
                id: updatedComment.id,
                content: updatedComment.text,
                user: {
                    id: updatedComment.user.id,
                    pseudo: updatedComment.user.pseudo,
                    email: updatedComment.user.email
                },
                likes: updatedComment.likes.filter(like => like.type === 'like').length,
                dislikes: updatedComment.likes.filter(like => like.type === 'dislike').length,
                userVote: updatedComment.likes.find(like => like.user?.id === userId)?.type,
                createdAt: updatedComment.createdAt
            };

            return response.json(commentDto);

        } catch (error) {
            console.error('Erreur lors du vote:', error);
            return response.status(500).json({ message: "Erreur lors du vote" });
        }
    }
}