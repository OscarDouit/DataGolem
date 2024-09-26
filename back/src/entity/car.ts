import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Comment } from "./comment";
import { CarLike } from "./car-like";

@Entity()
export class Car {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    brand: string;

    @Column()
    image: string;

    @Column()
    video: string;

    @Column({ nullable: false })
    description: string;

    @OneToMany(() => Comment, comment => comment.car)
    comments: Comment[];

    @OneToMany(() => CarLike, like => like.car)
    likes: CarLike[];

    @Column({ nullable: false })
    characteristic: string;

    constructor(name: string, brand: string, description: string, characteristic: string, image: string, video: string) {
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.characteristic = characteristic;
        this.image = image;
        this.video = video;
    }
}