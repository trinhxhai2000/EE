import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { AppRouter } from "./AppRouter";
import "./controllers/LoginController";
import "./controllers/TaskController";
import "./controllers/QuestionController";
import "./controllers/UserController";
import "./controllers/ChoiceController";
import "./controllers/CloudShootController";

import { errorHandlerMiddleware } from "./middlewares/errorHandler";
import "reflect-metadata";

dotenv.config();

import cookieParser from "cookie-parser";
import { appDataSource } from "./db/data-source";
import { userRepositoryController } from "./db/repository/UserRepository";
import { seedQuestionData } from "./SeedingData";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:4000",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(AppRouter.getInstance());

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await appDataSource
            .initialize()
            .then(() => {
                // here you can start to work with your database
                console.log("Success initialize AppDataSource");

            })
            .catch((error) => console.log(error));

        await userRepositoryController.init();

        // await seedData();

        app.listen(port, () => {
            console.log(`app is listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();


