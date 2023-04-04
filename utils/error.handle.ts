import { Response } from "express";


async function hadleHttp(res:Response,err:string,errorRaw?:any) {
    console.log(errorRaw)
    res.status(500);
    res.send({err})
    
}

export  default{hadleHttp}