import updateRecordingsModel from "./updateRecordings"
import { IupdateInterface } from "./updateRecordings.interface"


const updateCreate = async(data:IupdateInterface)=>{
    const response = await updateRecordingsModel.create(data)
    return response
}
const updateDate = async(id_cam:number,data:any) =>{
    const response = await updateRecordingsModel.findOneAndUpdate(
        { id_cam: id_cam},
        {dateUpdate:data}
        
    )
    return response
}
const oneRecordingDate = async (id_cam:any)=>{
    const response = await updateRecordingsModel.findOne({id_cam:id_cam})
    return response
}

export default{
    updateCreate,
    updateDate,
    oneRecordingDate
}