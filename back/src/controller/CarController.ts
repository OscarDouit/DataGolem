import { NextFunction, Request, Response } from "express";
import { Car } from "../entity/car";
import { AppDataSource } from "../index";
import {CarLike} from "../entity/car-like";
import { CarDto } from "../dto/car.dto";
import { Brackets } from "typeorm";

export class CarController {
    private carRepository = AppDataSource.getRepository(Car);
    private carLikeRepository = AppDataSource.getRepository(CarLike);

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
            image: car.image,
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
        const { make, model, year, category, drive, transmission, cylinders, consumption, fuel, image } = request.body;
        const car = new Car(make, model, year, category, drive, transmission, cylinders, consumption, fuel, image);

        const carCreate = await this.carRepository.save(car);
        response.status(200);
        return response.json(carCreate);
    }

    async updateCar(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const { make, model, year, category, drive, transmission, cylinders, consumption, fuel, image } = request.body;

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
        carToUpdate.image = image;

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
                image: car.image,
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

    public async searchCars(req: Request, res: Response) {
        try {
            const { q, make, model, year, category, transmission, fuel, minConsumption, maxConsumption } = req.query;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = 8;

            const queryBuilder = this.carRepository
                .createQueryBuilder("car")
                .select([
                    "car.id",
                    "car.make",
                    "car.model",
                    "car.year",
                    "car.category",
                    "car.transmission",
                    "car.fuel",
                    "car.consumption"
                ]);

            // Recherche fulltext si q est présent
            if (q) {
                queryBuilder.where(
                    "to_tsvector('french', COALESCE(car.make, '') || ' ' || " +
                    "COALESCE(car.model, '') || ' ' || " +
                    "COALESCE(car.year, '') || ' ' || " +
                    "COALESCE(car.category, '') || ' ' || " +
                    "COALESCE(car.transmission, '') || ' ' || " +
                    "COALESCE(car.fuel, '')) @@ plainto_tsquery('french', :q)",
                    { q: q.toString() }
                );
            }

            // Autres filtres
            if (make) {
                queryBuilder.andWhere("LOWER(car.make) = LOWER(:make)", { make: make.toString() });
            }
            if (model) {
                queryBuilder.andWhere("LOWER(car.model) LIKE :model", { model: `%${model.toString().toLowerCase()}%` });
            }
            if (year) {
                queryBuilder.andWhere("car.year = :year", { year: year.toString() });
            }
            if (category) {
                queryBuilder.andWhere("LOWER(car.category) = LOWER(:category)", { category: category.toString() });
            }
            if (transmission) {
                queryBuilder.andWhere("LOWER(car.transmission) = LOWER(:transmission)", { transmission: transmission.toString() });
            }
            if (fuel) {
                queryBuilder.andWhere("LOWER(car.fuel) = LOWER(:fuel)", { fuel: fuel.toString() });
            }
            if (minConsumption) {
                queryBuilder.andWhere("car.consumption >= :minConsumption", 
                    { minConsumption: parseFloat(minConsumption.toString()) });
            }
            if (maxConsumption) {
                queryBuilder.andWhere("car.consumption <= :maxConsumption", 
                    { maxConsumption: parseFloat(maxConsumption.toString()) });
            }

            const total = await queryBuilder.getCount();
            const cars = await queryBuilder
                .orderBy("car.make, car.model", "ASC")
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .getMany();

            return res.json({
                cars,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            });
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            return res.status(500).json({ message: "Erreur lors de la recherche des véhicules" });
        }
    }
}