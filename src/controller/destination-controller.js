import destinationService from "../service/destination-service.js";

const createDestination = async (req, res, next) => {
    try {
        const result = await destinationService.createDestination(req.body);
        res.status(201).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

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
    createDestination,
    updateDestination,
    deleteDestination,
    getDestinations,
    getDestinationById
};