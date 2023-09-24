import { Response, Request } from "express";
import errorHandle from "../../utils/error.handle"
import service from "./updateRecordings.service"


async function add({ body }: Request, res: Response) {
    try {
        const response = await service.updateCreate(body)
        return res.status(200).send({ data: response })

    } catch (error) {
        console.log("e", error);

        errorHandle.hadleHttp(res, "error added a new data  to database")
    }
}
async function updateDate({ params,body }: Request, res: Response) {
    try {
        const id = Number(params.id_cam) 
        const dateTmp = body.dateUpdate
        const response = await service.updateDate(id ,dateTmp)
        console.log("update date in to database");
        return res.status(200).send({ data: response })

    } catch (error) {
        console.log("e", error);

        errorHandle.hadleHttp(res, "error added a new data  to database")
    }
}

async function getOne({ params,body }: Request, res: Response) {
    try {
        const id = Number(params.id_cam)
        const response = await service.oneRecordingDate(id)
        console.log("get one date");
        return res.status(200).send({ data: response })

    } catch (error) {
        console.log("e", error);

        errorHandle.hadleHttp(res, "error added a new data  to database")
    }
}

export default{
    add,
    updateDate,
    getOne
}