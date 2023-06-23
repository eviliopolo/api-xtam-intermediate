import express, { json }  from "express";
import cors from "cors"
import helmet from "helmet";
import "dotenv/config"
import db from "./config/db"
import routes from "./network";
import redisService from "./services/redis.service";


const PORT = process.env.PORT || 3005
const app = express()

app.use(cors())
app.use(json())
db().then(()=>console.log("Conexion ready !!!"))
redisService.syncInfoMongoDB()
//app.use(helmet())
app.use('/api',routes)s

app.listen(PORT,()=>{
    console.log("LISTINIG FOR PORT  =>  ",PORT);
    
})