import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/user"
import * as fs from "node:fs";
import {Car} from "./entity/car";

export const createNewAppDataSource = (): DataSource => {
    return new DataSource({
        type: "postgres",
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: true,
        logging: false,
        "entities": [
            "src/entity/*.ts"
        ],
        migrations: [],
        subscribers: [],
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync("./certs/ca.pem").toString(),
        },
    });
}
