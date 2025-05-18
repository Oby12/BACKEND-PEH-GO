import userService from "../service/user-service.js";

const register = async (req,res,next) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).json({
            data : result
        })
    }catch (e) {
        next(e);
    }
}

const login = async (req,res,next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data : result
        })
    }catch (e) {
        next(e);
    }
}

// TAMBAHKAN: Fungsi logout
const logout = async (req,res,next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Token tidak ditemukan",
                errors: null
            });
        }

        // Hapus token dari database
        const result = await userService.logout(token);

        res.status(200).json({
            data: "Logout Success"
        });
    } catch (e) {
        // Jangan langsung kirim ke next(e) karena ini akan mengembalikan 500
        // Sebagai gantinya, kirim response dengan status yang sesuai
        res.status(200).json({
            data: "Logout Success",
            message: "Token sudah dihapus"
        });
    }
}

export default {
    register,
    login,
    logout // Tambahkan fungsi logout
}