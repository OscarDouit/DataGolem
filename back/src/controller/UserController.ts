
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/user"
import {UserDto, userDtoFactory} from "../dto/user.dto";
import {PasswordService} from "../services/password.service";
import {AppDataSource} from "../index";
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { userMeDtoFactory } from "../dto/userMe.dto";

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async findCurrentUser(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request?.user?.id)

        let user: User | null = null;

        if (id) {
            user = await this.userRepository.findOne({
                where: { id }
            });

            if (!user) {
                response.status(404)
                return response.json({ message: "User not found" })
            }
        }

        response.status(200)
        return response.json(userMeDtoFactory(user));
    }

    async createUser(request: Request, response: Response, next: NextFunction) {
        const { pseudo, firstname, lastname, email, password } = request.body;

        const userForMail = await this.userRepository.findOne({
            where: { email }
        })

        if (userForMail) {
            response.status(400)
            return response.json({ email: "this email is already used" })
        }

        const userForPseudo = await this.userRepository.findOne({
            where: { pseudo }
        })

        if (userForPseudo) {
            response.status(400)
            return response.json({ pseudo: "pseudo is already used" })
        }

        const user = new User(pseudo, firstname, lastname, email, await PasswordService.hashPassword(password));
        const userCreate = await this.userRepository.save(user)

        response.status(200)
        return response.json(userDtoFactory(userCreate));
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

    async login(request: Request, response: Response, next: NextFunction) {

        const { pseudoMail, password } = request.body;

        let user = await this.userRepository.findOne({ where: { pseudo: pseudoMail } });

        if (!user) {
            user = await this.userRepository.findOne({ where: { email: pseudoMail } });

            if (!user) {
                return response.status(401).json({message: "Utilisateur ou mot de passe incorrect"});
            }
        }

        const isMatch = await PasswordService.comparePassword(password, user.password)

        if (!isMatch) {
            return response.status(401).json({ message: "Utilisateur ou mot de passe incorrect" });
        }

        // On génère un acessToken
        const accessToken = sign(
            { id: user.id, username: user.pseudo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // 1h avant l'expiration du token
        );

        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.ENV === 'PRD',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1h de validité pour le cookie
        });

        // On génère un refreshToken
        const refreshToken = sign(
            { id: user.id, username: user.pseudo, type: 'refresh' },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: '7d' } // 7h davant l'expiration du refreshToken
        );

        // On va sauvegarder ce refreskToken pour l'utilisateur
        await this.storeRefreshToken(user.id, refreshToken);

        response.status(200).json({ message: 'Connexion réussie' });
    }

    async storeRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            user.refreshToken = refreshToken;
            await this.userRepository.save(user);
        }
    }

    async logout(request: Request, response: Response) {
        const userId = parseInt(request?.user?.id)

        if (!userId) {
            return response.sendStatus(400);
        }        

        const user = await this.userRepository.findOne({ where: { id: userId } });
 
        if (user) {
            user.refreshToken = null;
            await this.userRepository.save(user);
        }

        response.clearCookie('accessToken');
        response.json(200, { message: 'Déconnexion réussie' });
    }
}