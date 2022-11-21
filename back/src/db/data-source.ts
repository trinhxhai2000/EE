import { DataSource } from "typeorm";
import { Authorize } from "./entity/Authorize";
import { Question } from "./entity/Question";
import { User } from "./entity/User";

export const appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "sn1892000",
    database: "test2",
    synchronize: true,
    logging: false,
    entities: [User, Question, Authorize],
    migrations: [],
    subscribers: [],
});
