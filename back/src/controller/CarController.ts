import { NextFunction, Request, Response } from "express";
import { Car } from "../entity/car";
import { AppDataSource } from "../index";
import {User} from "../entity/user";
import {CarLike} from "../entity/car-like";

export class CarController {
    private carRepository = AppDataSource.getRepository(Car);
    private carLikeRepository = AppDataSource.getRepository(CarLike);

    async findAll(request: Request, response: Response, next: NextFunction) {
        const cars: Car[] = await this.carRepository.find({ relations: ["comments", "likes", "likes.user"] });
        const result = cars.map(car => ({
            ...car,
            likes: car.likes.map(like => ({
                id: like.id,
                type: like.type,
                userId: like.user ? like.user.id : null
            }))
        }));
        return response.json(result);
    }

    async findOne(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const car = await this.carRepository.findOne({ where: { id }, relations: ["comments", "likes", "likes.user"] });

        if (!car) {
            response.status(404);
            return response.json({ message: "Car not found" });
        }

        const result = {
            ...car,
            likes: car.likes.map(like => ({
                id: like.id,
                type: like.type,
                userId: like.user ? like.user.id : null
            }))
        };

        response.status(200);
        return response.json(result);
    }

    async createCar(request: Request, response: Response, next: NextFunction) {
        console.log(request.body);
        const { make, model, year, category, drive, transmission, cylinders, consumption, fuel } = request.body;
        const car = new Car(make, model, year, category, drive, transmission, cylinders, consumption, fuel);

        const carCreate = await this.carRepository.save(car);
        response.status(200);
        return response.json(carCreate);
    }

    async updateCar(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const { make, model, year, category, drive, transmission, cylinders, consumption, fuel } = request.body;

        let carToUpdate = await this.carRepository.findOne({ where: { id } });

        if (!carToUpdate) {
            response.status(404);
            return response.json({ message: "Car not found" });
        }

        carToUpdate.make = make;
        carToUpdate.model = model;
        carToUpdate.year = year;
        carToUpdate.category = category;
        carToUpdate.drive = drive;
        carToUpdate.transmission = transmission;
        carToUpdate.cylinders = cylinders;
        carToUpdate.consumption = consumption;
        carToUpdate.fuel = fuel;

        const updatedCar = await this.carRepository.save(carToUpdate);
        response.status(200);
        return response.json(updatedCar);
    }

    async deleteCar(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let carToRemove = await this.carRepository.findOne({ where: { id } });

        if (!carToRemove) {
            response.status(404);
            return response.json({ message: "Car not found" });
        }

        await this.carRepository.remove(carToRemove);
        response.status(200);
        return response.json({ message: "Car deleted successfully" });
    }

    async addLike(request: Request, response: Response, next: NextFunction) {
        const carId = parseInt(request.params.id);
        const userId = parseInt(request.body.user);

        if (isNaN(carId) || isNaN(userId)) {
            response.status(400);
            return response.json({ message: "Invalid car or user ID" });
        }

        const type = request.body.type;

        const car = await this.carRepository.findOne({ where: { id: carId } });
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });

        if (!car || !user) {
            response.status(404);
            return response.json({ message: "Car or User not found" });
        }

        const carLike = new CarLike(user, car, type);
        const savedLike = await this.carLikeRepository.save(carLike);

        response.status(200);
        return response.json(savedLike);
    }
}