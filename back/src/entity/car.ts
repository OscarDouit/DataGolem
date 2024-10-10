import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Comment } from "./comment";
import { CarLike } from "./car-like";

@Entity()
export class Car {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    make: string;

    @Column()
    model: string;

    @Column()
    year: string;

    @Column()
    category: string;

    @Column()
    drive: string;

    @Column()
    transmission: string;

    @Column()
    cylinders: string;

    @Column()
    consumption: string;

    @Column()
    fuel: string;

    @OneToMany(() => Comment, comment => comment.car)
    comments: Comment[];

    @OneToMany(() => CarLike, like => like.car)
    likes: CarLike[];

    constructor(make: string, model: string, year: string, category: string, drive: string, transmission: string, cylinders: string, consumption: string, fuel) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.category = category;
        this.drive = drive;
        this.transmission = transmission;
        this.cylinders = cylinders;
        this.consumption = consumption;
        this.fuel = fuel;
    }
}