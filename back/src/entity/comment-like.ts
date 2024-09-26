import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";
import {TypeLike} from "../types/type-like";

@Entity()
@Unique(["user", "comment"])
export class CommentLike {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Comment, comment => comment.likes, { nullable: false })
    @JoinColumn({ name: "commentId" })
    comment: Comment;

    @Column({ type: "enum", enum: ["like", "dislike"], nullable: false })
    type: TypeLike;

    constructor(user: User, comment: Comment, type: TypeLike) {
        this.user = user;
        this.comment = comment;
        this.type = type;
    }
}