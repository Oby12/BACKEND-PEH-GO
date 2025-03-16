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
        const data ={
            ...req.body,
            cover : req.files.cover[0].buffer,
            categoryId : categoryId,
            picture : req.files.picture ? req.files.picture.map(file => ({
                data : file.buffer
            })) : []
        };
        const result = await destinationService.create(req.user, data);
        res.status(201).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}
// const createDestination = async (req, res, next) => {
//     try {
//         const result = await destinationService.createDestination(req.body);
//         res.status(201).json({
//             data: result
//         });
//     } catch (e) {
//         next(e);
//     }
// };

const updateDestination = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);
        const result = await destinationService.updateDestination(destinationId, req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const deleteDestination = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);
        await destinationService.deleteDestination(destinationId);
        res.status(200).json({
            message: 'Destination deleted successfully'
        });
    } catch (e) {
        next(e);
    }
};

const getDestinations = async (req, res, next) => {
    try {
        const result = await destinationService.getDestinations();
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const getDestinationById = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);
        const result = await destinationService.getDestinationById(destinationId);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    uploadImage,
    //createDestination,
    updateDestination,
    deleteDestination,
    getDestinations,
    getDestinationById
};