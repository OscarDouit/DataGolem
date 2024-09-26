import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./user";
import { Car } from "./car";
import {TypeLike} from "../types/type-like";

@Entity()
@Unique(["user", "car"])
export class CarLike {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Car, car => car.likes, { nullable: false })
    @JoinColumn({ name: "carId" })
    car: Car;

    @Column({ type: "enum", enum: ["like", "dislike"], nullable: false })
    type: TypeLike;

    constructor(user: User, car: Car, type: TypeLike) {
        this.user = user;
        this.car = car;
        this.type = type;
    }
}