import { UserModel } from "../models/user.js";

export class UserController{
    
    constructor() {
        this.userModel = UserModel;
    }

    signIn = async (req, res) => {
        try {
            console.log(req.body)
            const { email, password } = req.body;
            if(!email || !password) return res.status(400).json({ msg: "No se han llenado todos los campos" });
            const {user,token} = await this.userModel.signIn({ email, password });
            if (!user || !token) return res.status(400).json({ msg: "Usuario o Contraseña no validos" });
            res.status(200).json({user,token});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    signinAsimetrico = async (req, res) => {
        try {
            console.log(req.body)
            const { email, password } = req.body;
            if(!email || !password) return res.status(400).json({ msg: "No se han llenado todos los campos" });
            const {user,token} = await this.userModel.signinAsimetrico({ email, password });
            if (!user || !token) return res.status(400).json({ msg: "Usuario o Contraseña no validos" });
            res.status(200).json({user,token});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    signUp = async (req, res) => {
        try {
            console.log(req.body)
            const { name, email, password, phone } = req.body;
            const {user,msg} = await this.userModel.signUp({ name, email, password, phone });
            if (!user) return res.status(400).json({ msg: msg })
            res.status(201).json({ msg: "Usuario creado" });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
    }

    signupAsimetrico = async (req, res) => {
        try {
            console.log(req.body)
            const { name, email, password, phone } = req.body;
            const {user,msg} = await this.userModel.signupAsimetrico({ name, email, password, phone });
            if (!user) return res.status(400).json({ msg: msg })
            res.status(201).json({ msg: "Usuario creado" });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
    }
}