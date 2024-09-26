import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user";
import { CommentLike } from "./comment-like";
import { Car } from "./car";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    text: string;

    @OneToMany(() => CommentLike, like => like.comment)
    likes: CommentLike[];

    @ManyToOne(() => User, user => user.comments, { nullable: false })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Car, car => car.comments, { nullable: false })
    @JoinColumn({ name: "carId" })
    car: Car;

    constructor(text: string, user: User, car: Car) {
        this.text = text;
        this.user = user;
        this.car = car;
    }
}