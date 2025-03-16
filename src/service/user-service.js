import {validate} from "../validation/validation.js";
import {loginUserValidation, registerUserValidation} from "../validation/user-validation.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import {prismaClient} from "../application/database.js";
import {v4 as uuid }from "uuid"

const register = async (request) => {

    //validate data user
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where : {
            username : user.username
        }
    });

    //mengecek bahwa username yang diinputkan sudah ada atau belum
    if (countUser === 1) {
        throw new ResponseError(400, "Username already taken")
    }

    const existingUser = await prismaClient.user.findUnique({
        where: { email: user.email }
    });

    if(existingUser){
        throw new ResponseError(400, "Email already taken");
    }

    // user.role = "WISATAWAN";
    //
    // //menggunakan bcrypt untuk menghash password
    // user.password = await bcrypt.hash(user.password, 10);

    // Buat objek user baru dengan role WISATAWAN
    const userData = {
        username: user.username,
        name: user.name,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        //role: "ADMIN"  // Selalu set ke WISATAWAN
    };

    return prismaClient.user.create({
        data : userData,
        select : {
            username : true,
            email : true,
            name : true,
            role : true
        }
    });
}

const login  = async (request) => {

    //validate data user
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where : {
            email : loginRequest.email
        },
        select : {
            email : true,
            password : true
        }
    });

    //mengecek apakah user nya ada
    if(!user) {
        throw new ResponseError(400, "Email or password is wrong");
    }

    //mengecek password apakah sudah benar
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if(!isPasswordValid){
        throw new ResponseError(400, "Email or password is wrong");
    }

    const token = uuid().toString();

    // console.log("Generated Token:", token);
    // console.log("Updating user with email:", user.email);

    return prismaClient.user.update({
        data : {
            token : token
        },
        where : {
            email : user.email
        },
        select : {
            token : true
        }
    });
}

export default {
    register,
    login
}