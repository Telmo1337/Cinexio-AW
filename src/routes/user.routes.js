import {Router} from "express";
import { prisma } from "../db/prisma.js";
import { verifyToken, requireAdmin } from "../utils/auth.js";


const userRouter = Router();

//rota apenas para role ADMIN - ver todos os users
userRouter.get("/", verifyToken, requireAdmin, async(req,res, next)=>{
    try {
        //retornar apenas os campos seguros
        const users = await prisma.user.findMany({
            select: {id: true, firstName: true, lastName: true, nickName: true, email: true, createdAt: true},
        })

        res.status(200).json(users)

    }catch(err){
        next()
    }
})


export default userRouter;