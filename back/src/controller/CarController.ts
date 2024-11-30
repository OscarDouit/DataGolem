import { NextFunction, Request, Response } from "express";
import { Car } from "../entity/car";
import { AppDataSource } from "../index";
import {CarLike} from "../entity/car-like";
import { CarDto } from "../dto/car.dto";

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

        const result: CarDto = {
            id: car.id,
            make: car.make,
            model: car.model,
            year: car.year,
            category: car.category,
            drive: car.drive,
            transmission: car.transmission,
            cylinders: car.cylinders,
            consumption: car.consumption,
            fuel: car.fuel,
            likes: car.likes.filter(like => like.type === 'like').length,
            dislikes: car.likes.filter(like => like.type === 'dislike').length,
            userVote: car.likes.find(like => like.user?.id === request.user?.id)?.type,
        };

        response.status(200);
        return response.json(result);
    }

    async createCar(request: Request, response: Response, next: NextFunction) {
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

    async toggleVote(request: Request, response: Response, next: NextFunction) {
        try {
            const carId = parseInt(request.params.id);
            const userId = request.user.id;
            const { type } = request.body; // like ou dislike

            if (!['like', 'dislike'].includes(type)) {
                return response.status(400).json({ message: "Type de vote invalide" });
            }

            const carLikeRepository = AppDataSource.getRepository(CarLike);
            
            // On récupère le vote existant pour savoir s'il faut le supprimer, le créer ou le mettre à jour
            const existingVote = await carLikeRepository.findOne({
                where: {
                    car: { id: carId },
                    user: { id: userId }
                }
            });

            // Si le vote exite, suppression ou mise à jour
            if (existingVote) {
                if (existingVote.type === type) {
                    // Le vote est identique et il existe, on va le supprimer
                    await carLikeRepository.remove(existingVote);
                } else {
                    // On met à jour le vote
                    existingVote.type = type;
                    await carLikeRepository.save(existingVote);
                }
            } else {
                // Création d'un nouveau vote
                const newVote = carLikeRepository.create({
                    car: { id: carId },
                    user: { id: userId },
                    type
                });
                await carLikeRepository.save(newVote);
            }

            // On récupère la voiture avec les votes mis à jour
            const car = await this.carRepository.findOne({ where: { id: carId }, relations: ["comments", "likes", "likes.user"] });

            if (!car) {
                response.status(404);
                return response.json({ message: "Voiture non trouvée" });
            }
    
            const result: CarDto = {
                id: car.id,
                make: car.make,
                model: car.model,
                year: car.year,
                category: car.category,
                drive: car.drive,
                transmission: car.transmission,
                cylinders: car.cylinders,
                consumption: car.consumption,
                fuel: car.fuel,
                likes: car.likes.filter(like => like.type === 'like').length,
                dislikes: car.likes.filter(like => like.type === 'dislike').length,
                userVote: car.likes.find(like => like.user?.id === request.user?.id)?.type,
            };
    
            response.status(200);
            return response.json(result);            
        } catch (error) {
            console.error('Erreur lors du vote:', error);
            return response.status(500).json({ message: "Erreur lors du vote" });
        }
    }
}