import { JWT_SECRET } from "../config";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({
                message:"Unauthorized"
            })
            return
        }

        const payload = jwt.verify(token,JWT_SECRET) as JwtPayload;

        if(payload) {
            req.body.userId = payload.id;
            next();
        } else {
            res.status(401).json({
                message:"Unauthorized"
            })
            return
        }
    }
    catch (error:any) {
        console.log("Error: ",error.message);
        res.status(401).json({
            message:"Unauthorized"
        })
        return
    }
};