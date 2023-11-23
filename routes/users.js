import { Router } from "express";
import { UserController } from "../controllers/users.js";

// export const userRouter = ({ userModel }) => {
    
// }
export const userRouter = () => {
    const userRouter = Router();
    const userController = new UserController();

    userRouter.post('/signin', userController.signIn);
    userRouter.post('/signup', userController.signUp);
    userRouter.post('/signupAsimetrico', userController.signupAsimetrico);
    userRouter.post('/signinAsimetrico', userController.signinAsimetrico);


    return userRouter;
}