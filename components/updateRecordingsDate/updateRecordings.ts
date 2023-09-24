import { Schema,model,Model,Types } from "mongoose";
import { IupdateInterface } from "./updateRecordings.interface";


const updateRecordingsSchema = new Schema<IupdateInterface>(
      {
        id_cam:{
            type:Number
        },
        dateUpdate:{
            type:Date,
            required:true
        }
      },
      {
        timestamps:true,
        versionKey:false
      }
)
const updateRecordingsModel = model('updateRecordings',updateRecordingsSchema)

export default updateRecordingsModel
