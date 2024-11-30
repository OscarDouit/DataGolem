import { Response, Request, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { RequestWithUser } from './RequestWithUser';
import { AppDataSource } from '../index';
import { User } from '../entity/user';

export const authenticateJWT = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

export const requireAuthentication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Problème d'authentification" });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: "Problème d'authentification" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide" });
    }
};
