import * as express from "express"
import * as bodyParser from "body-parser"
import { createNewAppDataSource} from "./data-source"
import { config } from 'dotenv';
import * as path from "path"

let configPath = path.join(__dirname, "../.env")
config({path: configPath});
export const AppDataSource: DataSource = createNewAppDataSource();

import useRouter from './routes';
import {DataSource} from "typeorm";

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()
    app.use(bodyParser.json())

    // setup express app here
    // ...

    // start express server
    const PORT = 3000
    app.listen(PORT)

    app.use(useRouter);

    console.log("Express server has started on port 3000. Open http://localhost:"+PORT+"/users to see results")

}).catch(error => console.log(error))
