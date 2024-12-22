import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req:Request , res:Response, next:NextFunction) => {
    if(req.user.role !== 'Admin') {
        res.status(403).json({message: 'Unauthorized'});
        return;
    }
    next();

    const header = req.headers.authorization; // Bearer token
    const token = header?.split(' ')[1];

    if(!token) {
        res.status(403).json({message: 'Unauthorized'});
        return;
    }

    try {
        const decoded = jwt.verify(token,JWT_SECRET) as {role: string, userId: string};
        req.userId = decoded.userId;
        next()
    } catch(err) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
}