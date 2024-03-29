import { DataSource } from "typeorm";
import { Question } from "./entity/Question";
import { Choice } from "./entity/Choice";
import { User } from "./entity/User";
import { Submission } from "./entity/Submission";
import { Record } from "./entity/Record";

export const appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "sn1892000",
    database: "test2",
    synchronize: true,
    logging: false,
    entities: [User, Question, Choice, Record, Submission],
    migrations: [],
    subscribers: [],
});
