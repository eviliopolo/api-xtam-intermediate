import { Response, Request } from "express";
import errorHandle from "../../utils/error.handle"
import service from "./Recordings.service"


async function add({ body }: Request, res: Response) {
    try {
        const response = await service.RedisCache(body)
        return res.status(200).send({ data: response })

    } catch (error) {
        console.log("e", error);

        errorHandle.hadleHttp(res, "error added a new data  to database")
    }
}

async function list({ body }: Request, res: Response) {
    try {
        const response = await service.getRecordings()
        return res.status(200).send({ data: response })
    } catch (error) {
        errorHandle.hadleHttp(res, "error in database for geting data")
    }
}


async function oneRecording({ params, body }: Request, res: Response) {
    try {        
        const id_xtam = params.id_xtam
        const date = new Date(body.date)
        const dateRedis = body.date
        let data = {
            dateStart: body.dateStart,//
            dateFinish :body.dateFinish,//
            routerRecord : body.routeRecord,//
            folder_record:body.folder_record//
        }
        const response = await service.getRecordingsFilter(id_xtam, date,data,dateRedis)
        return res.status(200).send({ data: response })
    } catch (error) {
        errorHandle.hadleHttp(res, "error in database for geting data")
    }
}



async function updateRecording({ body, params }: Request, res: Response) {
    try {
        const id = params.id
        const response = await service.updateRecordings(id, body)
        return res.status(200).send({ data: response })

    } catch (error) {
        errorHandle.hadleHttp(res, "error in database for update data")
    }
}

async function deleteRecording({ body, params }: Request, res: Response) {
    try {
        const id = params.id
        const response = await service.deleteRecording(id)
        return res.status(200).send({ data: response, message: "deleted successfull item in the database" })

    } catch (error) {
        errorHandle.hadleHttp(res, "error in database for delete info ")
    }
}

async function histogramTime({body}:Request,res:Response){
     
     const  dateStart = body.dateStart
     const dateEnd = body.dateEnd
     const id_xtam = body.id_xtam
     const folder_record  = body.folder_record

     const response = await service.timeAvailed(id_xtam,dateStart,dateEnd,folder_record)

     return res.status(200).json(response);
    
}

async function histogramTimeForDay({body}:Request,res:Response){
     
    const  dateStart = body.dateStart
    const dateEnd = body.dateEnd
    const id_xtam = body.id_xtam
    const folder_record  = body.folder_record

    const response = await service.timeAvailedForDay(id_xtam,dateStart,dateEnd,folder_record)

    return res.status(200).json(response);
   
}


export default {
    add,
    list,
    updateRecording,
    deleteRecording,
    oneRecording,
    histogramTime,
    histogramTimeForDay
}