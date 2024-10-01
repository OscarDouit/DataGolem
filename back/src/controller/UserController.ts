
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/user"
import {UserDto} from "../dto/user.dto";
import {PasswordService} from "../services/password.service";
import {AppDataSource} from "../index";
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { FindOptionsWhere, ObjectId } from "typeorm";


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

    async login(request: Request, response: Response, next: NextFunction) {

        const { username, password } = request.body;

        const user = await this.userRepository.findOne({ where: { pseudo: username } });

        if (!user) {
            return response.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        const isMatch = await PasswordService.comparePassword(password, user.password)

        if (!isMatch) {
            return response.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        const accessToken = sign(
            { id: user.id, username: user.pseudo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = sign(
            { id: user.id, username: user.pseudo, type: 'refresh' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        response.cookie('token', accessToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        });
    
        response.status(200).json({ message: 'Connexion réussie' });
    }

    async storeRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            user.refreshToken = refreshToken;
            await this.userRepository.save(user);
        }
    }
    
    async refreshToken(request: Request, response: Response) {
        const { token } = request.body;
    
        if (!token) {
            return response.sendStatus(401);
        }
    
        verify(token, process.env.JWT_SECRET, async (err: any, user: any) => {
            if (err) {
                return response.sendStatus(403);
            }
    
            const storedToken = await this.userRepository.findOne({ where: { id: user.id } });
            if (!storedToken || storedToken.refreshToken !== token) {
                return response.sendStatus(403);
            }
    
            const newAccessToken = sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            response.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
            response.json({ accessToken: newAccessToken });
        });
    }

    async logout(request: Request, response: Response) {
        const { refreshToken } = request.body;
    
        if (!refreshToken) {
            return response.status(400).json({ message: 'Refresh token est requis' });
        }
    
        let userId: string;
        
        try {
            const decoded = verify(refreshToken, process.env.JWT_SECRET) as JwtPayload;
            userId = decoded.id;
        } catch (error) {
            return response.status(401).json({ message: 'Refresh token invalide' });
        }
    
        await this.userRepository.update(userId, { refreshToken: null });
    
        response.clearCookie('accessToken');
        response.json({ message: 'Déconnexion réussie' });
    }
    
}