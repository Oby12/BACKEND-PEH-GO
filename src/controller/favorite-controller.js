// src/controller/favorite-controller.js
import favoriteService from "../service/favorite-service.js";

const toggleFavorite = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.destinationId);
        const username = req.user.username;

        const result = await favoriteService.toggleFavorite(destinationId, username);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
};

const checkIsFavorite = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.destinationId);
        const username = req.user.username;

        const result = await favoriteService.checkIsFavorite(destinationId, username);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
};

const getUserFavorites = async (req, res, next) => {
    try {
        const username = req.user.username;
        const favorites = await favoriteService.getUserFavorites(username);

        res.status(200).json({
            data: favorites
        });
    } catch (e) {
        next(e);
    }
};

export default {
    toggleFavorite,
    checkIsFavorite,
    getUserFavorites
};