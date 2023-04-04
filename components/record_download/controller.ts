import { Response, Request } from "express";
import errorHandle from "../../utils/error.handle"
import service from "./record_download.service"

async function add({ body }: Request, res: Response) {
    try {
        const response = await service.insertRecord(body)
        return res.status(200).send({ data: response })

    } catch (error) {
        console.log("e", error);

        errorHandle.hadleHttp(res, "error added a new data  to database")
    }
}

async function list({body}:Request,res:Response) {
    try {
      const response = await service.getRecords()
      return res.status(200).send({data:response})
        
    } catch (err) {
        console.log("errorr", err);
        errorHandle.hadleHttp(res,"error geting your request in database")
        
    }
    
}

async function getOne({body,params}:Request,res:Response) {
 try {
      const response = await service.getRecordOne(params.name)
      return res.status(200).send({data:response})
 } catch (error) {
    console.log("error",error)
    errorHandle.hadleHttp(res,"error geting info about database")
    
 }
    

}

export default {
    add,
    list,
   getOne
}