import recordModel from "./record_download";
import { recordInterface } from "./record_download.interface";


const insertRecord = async (record:  recordInterface) => {

    const reponse = await recordModel.create(record)
    return reponse;

}
const getRecords = async () => {
    const reponse = await recordModel.find({})
    return reponse;
}

const getRecordOne = async (name: string) => {
    const response = await recordModel.findOne({ name:name})

    return response
}

export default {
    insertRecord,
    getRecords,
    getRecordOne
}