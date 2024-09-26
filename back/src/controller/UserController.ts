
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/user"
import {UserDto} from "../dto/user.dto";
import {PasswordService} from "../services/password.service";
import {AppDataSource} from "../index";

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async findAll(request: Request, response: Response, next: NextFunction) {
        const users: User[] = await this.userRepository.find()
        const usersDto: UserDto[] = users.map(user => UserDto.fromEntity(user));

        return response.json(
            usersDto
        );
    }

    async findOne(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            response.status(404)
            return response.json({ message: "User not found" })
        }

        response.status(200)
        return response.json(UserDto.fromEntity(user));
    }

    async createUser(request: Request, response: Response, next: NextFunction) {
        const { pseudo, firstname, lastname, email, password } = request.body;

        const userForMail = await this.userRepository.findOne({
            where: { email }
        })

        if (userForMail) {
            response.status(400)
            return response.json({ message: "this email is already used" })
        }

        const userForPseudo = await this.userRepository.findOne({
            where: { pseudo }
        })

        if (userForPseudo) {
            response.status(400)
            return response.json({ message: "pseudo is already used" })
        }

        const user = new User(pseudo, firstname, lastname, email, await PasswordService.hashPassword(password));
        const userCreate = await this.userRepository.save(user)

        response.status(200)
        return response.json(UserDto.fromEntity(userCreate));
    }

    async deleteUser(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            response.status(404)
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        response.status(200)
        return response;
    }
}