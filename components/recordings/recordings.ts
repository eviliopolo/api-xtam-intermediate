import { Schema,model,Model,Types } from "mongoose";
import { recordings } from "./recordings.interface";


const recordingsSchema = new Schema<recordings>(
      {
        id_xtam:{
            type:Number,
            required:true
        },
        date:{
            type:Date,
            required:true
        },
        cameras:{
            type:Array,
            required:true
        }
      },
      {
        timestamps:true,
        versionKey:false
      }
)

const recordingsModel = model('recordings',recordingsSchema)

export default recordingsModel
