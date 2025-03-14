import express from 'express';
import {publicRouter} from "../route/public-api.js";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {protectedRouter} from "../route/api.js";

export const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(publicRouter);
app.use(protectedRouter)

app.use(errorMiddleware);
