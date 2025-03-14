const errorMiddleware = async (err,req,res,next) => {

    //jika tidak ada error akan di lanjutkan
    if(!err){
        next();
        return;
    }

    //jika ada error dari validasi
    if(err instanceof Error){
        res.status(err.status).json({
            errors : err.message
        }).end();
    }else{
        res.status(500).json({
            errors : err.message
        }).end();
    }
}

export {
    errorMiddleware
}