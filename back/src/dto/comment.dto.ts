import { UserDto } from "./user.dto";

export interface CommentDto {
    id: number;
    content: string;
    user: UserDto;
    likes: number;
    dislikes: number;
    userVote?: 'like' | 'dislike' | null;
    createdAt: Date;
}

export interface CreateCommentDto {
    text: string;
    carId: number;
} 