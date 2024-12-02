import { Response, Request, NextFunction } from 'express';
import { verify, sign, JwtPayload } from 'jsonwebtoken';
import { RequestWithUser } from './RequestWithUser';
import { AppDataSource } from '../index';
import { User } from '../entity/user';

export const authenticateJWT = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    const userRepository = AppDataSource.getRepository(User);

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        // L'acess token est expiré on va essayer de rafraîchr ce token si le refresh token n'ext pas expiré non plus
        try {
            // On va récupérer le refreshToken de l'utilisateur
            const userToken = verify(token, process.env.JWT_SECRET!, { ignoreExpiration: true }) as JwtPayload;
            const user = await userRepository.findOne({ where: { id: userToken.id } });

            // S'il existe un refreshToken, on va vérifier si il n'est pas expiré pour générer un nouveau token
            if (user && user.refreshToken) {
                try {
                    // Vérifier si le refreshToken est valide
                    verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET!);

                    // Générer un nouveau token
                    const newAccessToken = sign(
                        { id: user.id, email: user.email },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );

                    // On va mettre à jour le cookie contenant le token
                    res.cookie('accessToken', newAccessToken, { 
                        httpOnly: true,
                        secure: process.env.ENV === 'PRD',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 1000 // 1h de validité pour le cookie
                    });

                    req.user = { id: user.id, email: user.email };
                    next();
                } catch {
                    // Le refreshToken a expiré
                    // On va vider le refreskToken au niveau de l'utilisateur
                    user.refreshToken = null;
                    await userRepository.save(user);
                    
                    req.user = null;
                    next();
                }
            } else {
                // Il n'existe pas de refreskToken pour l'utilisateur
                req.user = null;
                next();
            }
        } catch {
            req.user = null;
            next();
        }
    }
};

export const requireAuthentication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    const userRepository = AppDataSource.getRepository(User);

    if (!token) {
        return res.status(401).json({ message: "Problème d'authentification" });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: "Problème d'authentification" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        try {
            const userToken = verify(token, process.env.JWT_SECRET!, { ignoreExpiration: true }) as JwtPayload;
            const user = await userRepository.findOne({ where: { id: userToken.id } });

            if (user && user.refreshToken) {
                try {
                    verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET!);

                    const newAccessToken = sign(
                        { id: user.id, username: user.pseudo },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' } // 1h avant l'expiration du token
                    );

                    // Mettre à jour le cookie avec le nouveau token
                    res.cookie('accessToken', newAccessToken, { 
                        httpOnly: true,
                        secure: process.env.ENV === 'PRD',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 1000 // 1h de validité pour le cookie
                    });

                    req.user = { id: user.id, email: user.email };
                    next();
                } catch {
                    // Le refreshToken a expiré
                    // On va vider le refreskToken au niveau de l'utilisateur
                    user.refreshToken = null;
                    await userRepository.save(user);

                    return res.status(401).json({ message: "Token expiré" });
                }
            } else {
                return res.status(401).json({ message: "Problème d'authentification" });
            }
        } catch {
            return res.status(401).json({ message: "Token invalide" });
        }
    }
};
