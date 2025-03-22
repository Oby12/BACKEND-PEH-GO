import destinationService from "../service/destination-service.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage : storage });

//middle ware untuk upload
const uploadImage = upload.fields([
    { name : 'cover', maxCount : 1 },
    { name : 'picture', maxCount : 3 }
]);


const create = async (req, res, next) => {
    try {
        // req.files akan berisi file yang diupload
        // req.body akan berisi data teks

        const categoryId = parseInt(req.params.categoryId);
        const data = {
            ...req.body,
            cover : req.files.cover[0].buffer,
            categoryId : categoryId,
            picture : req.files.picture ? req.files.picture.map(file => ({
                data : file.buffer
            })) : []
        };
        const result = await destinationService.create(data);
        res.status(201).json({
            // message : "create new destination success"
            data : result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);
        const result = await destinationService.get(categoryId, destinationId);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const list = async (req, res, next) => {
    try{

        const categoryId = req.params.categoryId;

        const result = await destinationService.list(categoryId);

        res.status(200).json({
            data : result
        })
    }catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);

        // Pastikan ID valid
        if (isNaN(categoryId) || isNaN(destinationId)) {
            return res.status(400).json({
                errors: "Invalid ID parameters"
            });
        }

        // Siapkan data request
        const requestData = {
            ...req.body,
            id: destinationId,
            categoryId: categoryId
        };

        // Tambahkan informasi file jika ada
        if (req.files) {
            if (req.files.cover && req.files.cover.length > 0) {
                requestData.cover = req.files.cover[0].buffer;
            }

            if (req.files.picture && req.files.picture.length > 0) {
                requestData.pictures = req.files.picture.map(file => ({
                    data: file.buffer
                }));
            }
        }

        const result = await destinationService.update(categoryId, requestData);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};


const remove = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);

        await destinationService.remove(categoryId, destinationId);
        res.status(200).json({
            message: 'Destination deleted successfully'
        });
    } catch (e) {
        next(e);
    }
};



export default {
    create,
    uploadImage,
    list,
    get,
    update,
    remove
    //createDestination,
    //updateDestination,


};