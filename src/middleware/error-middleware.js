// const errorMiddleware = async (err,req,res,next) => {
//
//     //jika tidak ada error akan di lanjutkan
//     if(!err){
//         next();
//         return;
//     }
//
//     //jika ada error dari validasi
//     if(err instanceof Error){
//         res.status(err.status).json({
//             errors : err.message
//         }).end();
//     }else{
//         res.status(500).json({
//             errors : err.message
//         }).end();
//     }
// }
//
// export {
//     errorMiddleware
// }

const errorMiddleware = async (err, req, res, next) => {
    //jika tidak ada error akan di lanjutkan
    if(!err){
        next();
        return;
    }

    //log error untuk debugging
    console.error(err);

    //jika ada error dari ResponseError
    if(err.status) {  // Cek apakah err memiliki properti status
        res.status(err.status).json({
            errors : err.message
        }).end();
    } else {
        res.status(500).json({
            errors : err.message || 'Internal Server Error'
        }).end();
    }
}

export {
    errorMiddleware
}