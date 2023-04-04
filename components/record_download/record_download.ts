import { Schema,model,Model,Types } from "mongoose";
import { recordInterface } from "./record_download.interface";


const recordSchema = new Schema<recordInterface>(
      {
        name:{
            type:String,
            required:true
        },
        format:{
            type:String,
            required:true
        },
        route:{
            type:String,
            required:true
        },
        download_status:{
            type:String,
            required:false
        }
      },
      {
        timestamps:true,
        versionKey:false
      }
)

const recordModel = model('record',recordSchema)

export default recordModel