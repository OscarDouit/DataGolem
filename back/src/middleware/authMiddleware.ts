import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { RequestWithUser } from './RequestWithUser';

export const authenticateJWT = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.sendStatus(401);
    }

    verify(token, process.env.JWT_SECRET!, (err: any, user: JwtPayload | string | undefined) => {
        if (err) {
            return res.sendStatus(401);
        }

        req.user = user;
        next();
    });
};
