import recordingsModel from "./recordings";
import { recordings } from "./recordings.interface";
import { redisdata } from "../../services/redis.interface";
import redisConect from "../../services/redis.client"
import axios from "axios";
import "dotenv/config"
import moment from "moment";
const client = new redisConect();


const RedisCache = async (data: redisdata) => {

    const KEYNAME = `${data.ID_XTAM}-${data.DATE}`
    const updateInfoCam = {
        id_camera: data.ID_CAMERA,
        ts_name: data.TSNAME,
        size: data.SIZE,
        data_time_start: data.DATATIMESTART,
        data_time_finish: data.DATATIMEFINISH
    }
    let infoFolder = data.FOLDER_RECORD.split("camera")

    let numberFolder = parseInt(infoFolder[1])

    let infoCams = {
        camera1: {
            recordings: []
        },
        camera2: {
            recordings: []
        },
        camera3: {
            recordings: []
        },
        camera4: {
            recordings: []
        }
    }

    const newInfoCam = {
        id_xtam: data.ID_XTAM,
        date: data.DATE,
        cameras: infoCams
    }


    const resRedis = await client.connectRedis();
    let redisGetInfo = await resRedis.get(KEYNAME)

    if (typeof (redisGetInfo) === 'string') {
        let tmpData = JSON.parse(redisGetInfo)
        let dataCameras = tmpData[0].cameras
        let estructureInfo = Object.values(dataCameras)
        let infoTmpCam: any = []
        infoTmpCam = estructureInfo[numberFolder - 1]
        infoTmpCam["recordings"].push(updateInfoCam)
        resRedis.set(KEYNAME, JSON.stringify(tmpData))
        //await recordingsModel.create(tmpData)
        const reponse = "new data created in redis"
        return reponse;

    } else {

        let tmpInfo = newInfoCam.cameras
        let estructureInfo = Object.values(tmpInfo)
        let infoTmpCam: any = []
        infoTmpCam = estructureInfo[numberFolder - 1]["recordings"]
        infoTmpCam.push(updateInfoCam)
        resRedis.set(KEYNAME, JSON.stringify([newInfoCam]))

        const reponse = "new data created in redis"
        return reponse;


    }

}

/*const RedisCache1 = async (data: redisdata) => {

    const KEYNAME = `${data.ID_XTAM}-${data.ID_CAMERA}-${data.DATE}`
    const updateInfoCam = {
        ts_name: data.TSNAME,
        size: data.SIZE,
        data_time_start: data.DATATIMESTART,
        data_time_finish: data.DATATIMEFINISH
    }

    const newInfoCam = {
        id_xtam:data.ID_XTAM,
        id_camera: data.ID_CAMERA,
        date: data.DATE,
        recordings: [
            updateInfoCam
        ]
    }
    
    const resRedis = await client.connectRedis();
    let redisGetInfo = await resRedis.get(KEYNAME)

    if (typeof (redisGetInfo) === 'string') {

        let tmpData = JSON.parse(redisGetInfo)
        let dataCameras = tmpData[0].recordings
        dataCameras.push(updateInfoCam)
        resRedis.set(KEYNAME, JSON.stringify(tmpData))
        const reponse = "new data created in redis"
        return reponse;

    } else {
        resRedis.set(KEYNAME, JSON.stringify([newInfoCam]))
        const reponse = "new data created in redis"
        return reponse;


    }

}*/


const insertRecordings = async (recording: recordings) => {

    const reponse = await recordingsModel.create(recording)
    return reponse;



}

const getRecordings = async () => {
    const reponse = await recordingsModel.find({})
    return reponse;
}

const getAndUpdateRecording = async (id_xtam: string, date: Date, recording: recordings) => {
    const response = await recordingsModel.findOneAndUpdate({ id_xtam: id_xtam, date: date }, recording)
    return response;
}

const getRecordingsOne = async (id_xtam: string, date: Date) => {
    const response = await recordingsModel.findOne({ id_xtam: id_xtam, date: date })

    return response
}

const updateRecordings = async (id: string, recording: recordings) => {
    const response = await recordingsModel.findByIdAndUpdate({ _id: id }, recording, { new: true })
    return response
}

const deleteRecording = async (id: string) => {
    const response = await recordingsModel.findByIdAndRemove({ _id: id }, { new: true })
    return response
}

const estructureInfoApi = async (objetc: any, data: any) => {
    let arrayNameTs: any = []
    objetc.map((item: any) => {

        const tmInfo = item["recordings"]
        let searchInfo = tmInfo.filter((n: any) => n.data_time_start >= data.dateStart && n.data_time_finish <= data.dateFinish)
        searchInfo.map((item: any) => {
            console.log("hh");

            arrayNameTs.push(item.ts_name)
        })

    })
    const dataArr = new Set(arrayNameTs);
    let result = [...dataArr];
    console.log(result);
    
    
    let dataSend: any = {
        routerRecord: data.routerRecord,
        filesTs: result,
        folderRecord: data.folder_record,
        id:data.id
    }

    const resApi = await axios.post(`${process.env.URL_API_RECORDINGS}/api/stremingRecording/`, dataSend);
    const responseApi = resApi.data['patchStreming']

    

    return responseApi
}


const getRecordingsFilter = async (id_xtam: string, date: Date, data: any, dateRedis: string) => {
    //implment redist before the 30 minutes whith redis
    const dateToday = new Date();

    const dateTodayEstructure = moment(dateToday, "YYYY-MM-DD HH:mm:ss");
    const dateTodayFinish = moment(data.dateStart, "YYYY-MM-DD HH:mm:ss")
    const daysDiffe = dateTodayEstructure.diff(dateTodayFinish, 'minutes')
    if (daysDiffe < 30 && daysDiffe > 0) {
        let dateRedisTmp = dateRedis.split("'")
        const KEYNAME = `${id_xtam}-${dateRedisTmp[1]}`
        const resRedis = await client.connectRedis();
        let redisGetInfo: any = await resRedis.get(KEYNAME)
        let jsonRedis = JSON.parse(redisGetInfo)
        const cameras: any = Object.values(jsonRedis[0]["cameras"])
        let camaraTmp = data.folder_record
        let cam = camaraTmp.split('camara')
        const numberCam = parseInt(cam[1])
        let camerasInfoTmp: any = Object.values(cameras)
        const apiResponse = await estructureInfoApi(camerasInfoTmp, data)
        return apiResponse


    } else {
        // init about the geting and filter the dates 
        const response: any = await recordingsModel.findOne({ id_xtam: id_xtam, date: date })
        console.log(response);
        const cameras: any = Object.values(response["cameras"])
        let camaraTmp = data.folder_record
        let cam = camaraTmp.split('camara')
        const numberCam = parseInt(cam[1])
        let arrayNameTs: any = []
        let camerasInfoTmp: any = Object.values(cameras[numberCam - 1])
        const apiResponse = await estructureInfoApi(camerasInfoTmp, data)
        return apiResponse

    }


}

const timeAvailed = async (id_xtam: string, dateStart: any, dateFinish: any, folder_record: string) => {
    const dateInit = moment(dateStart, "YYYY-MM-DD HH:mm:ss");
    const dateEnd = moment(dateFinish, "YYYY-MM-DD HH:mm:ss");
    const daysDiff = dateEnd.diff(dateInit, 'days')
    /// the consult can't get over the 30 days
    if (daysDiff > 30) {
        let message = "the consult can't get over the 30 days"
        return message

    }
    if (daysDiff < 0) {
        console.log("second ");

    } else {
        const response: any = await recordingsModel.find({
            id_xtam: id_xtam, $and: [
                { date: { $gte: dateInit } },
                { date: { $lte: dateEnd } }
            ]
        })
        let minutesTotal: number = 0;
        let dataRow = {}
        let recording: any = []
        let dataMaps: any = []
        let dateInitSearch: any = ""
        response.map((item: any, index: any) => {
            dateInitSearch = item.date
            const cameras: any = Object.values(item["cameras"])
            let camaraTmp = folder_record
            let cam = camaraTmp.split('camara')
            let numberCam = parseInt(cam[1])

            let camerasInfoTmp: any = Object.values(cameras)
            camerasInfoTmp.map((item: any, index: any) => {
                const tmInfo = Object.values(item)
                let infoCamsArray: any = tmInfo[numberCam - 1]
                let minutes: number = infoCamsArray["recordings"].length
                recording = infoCamsArray["recordings"]
                dataRow = {
                    minutes: minutes,
                    date: dateInitSearch
                }
                dataMaps.push(dataRow)
                minutesTotal = minutes + minutesTotal
                console.log("sum total", minutesTotal);
            })

        })

        let allDates: any = [];
        if (dateInit != undefined && dateEnd != undefined) {

            while (dateInit.isSameOrBefore(dateEnd)) {
                let tmpDteRow: string = ""
                let dateRow: any = dateInit.format('YYYY-MM-DD')
                tmpDteRow = `${dateRow}`
                allDates.push(tmpDteRow);
                dateInit.add(1, 'days');
            }

        }
        let arrayDate: any = [];
        allDates.forEach((date: any) => {
            var jsonData: any = {};
            var dateCheck = false;
            dataMaps.forEach((row: any) => {

                const dateFromDb = moment(row.date).format('YYYY-MM-DD');

                if (dateFromDb == date) {

                    console.log(dateFromDb, date);
                    jsonData["date"] = dateFromDb;
                    jsonData["minutesAvailables"] = row.minutes
                    arrayDate.push(jsonData);
                    dateCheck = true;
                }

            });

            if (!dateCheck) {

                jsonData["date"] = date;
                jsonData["minutesAvailables"] = "0"
                arrayDate.push(jsonData);
                dateCheck = true;

            }


        });

        let tmpRta = {
            recordings: recording,
            histogram: arrayDate
        }

        return tmpRta




    }




}

const timeAvailedForDay = async (id_xtam: string, dateStart: any, dateFinish: any, folder_record: string) => {
    console.log("entre");

    const dateInit = moment(dateStart, "YYYY-MM-DD HH:mm:ss");
    const dateEnd = moment(dateFinish, "YYYY-MM-DD HH:mm:ss");

    let start = "00:00:00"
    let finish = "23:59:59"
    let arraySendToHistogram: any = []
    let sumMinutes = 0
    let minutes = 0

    const dateInitStar: any = moment(start, "HH:mm:ss");
    const dateEndFinish = moment(finish, "HH:mm:ss");

    const daysDiff = dateEnd.diff(dateInit, 'days')
    let allDates: any = [];

    if (dateInit != undefined && dateEnd != undefined) {
        while (dateInitStar.isSameOrBefore(dateEndFinish)) {
            let tmpDteRow: string = ""
            let dateRow: any = dateInitStar.format('HH:mm:ss')
            tmpDteRow = `${dateRow}`
            allDates.push(tmpDteRow);
            dateInitStar.add(1, 'hours');
        }
    }
    const dateDay: any = await recordingsModel.find({
        id_xtam: id_xtam, date: dateInit
    })
    const cameras: any = Object.values(dateDay[0]["cameras"])
    let camaraTmp = folder_record
    let cam = camaraTmp.split('camara')
    let numberCam = parseInt(cam[1])
    let camerasInfoTmp: any = Object.values(cameras[0])
    let camaresHistTmp: any = camerasInfoTmp[numberCam - 1]
    const tmpHisto = camaresHistTmp["recordings"]
    allDates.map(async (element: any, index: any) => {

        let searchInfo = tmpHisto.filter((n: any) => n.data_time_start.slice(11, 17) >= allDates[index] && n.data_time_finish.slice(11, 17) <= allDates[index + 1])
        if (searchInfo.length > 0) {
            console.log(allDates[index], allDates[index + 1], searchInfo);

        }
        let dateMinutesOne = {
            date: allDates[index],
            dateEnd: allDates[index + 1],

        }
        let dateMinutesSend = {
            ...dateMinutesOne,
            minutesAvailables: searchInfo.length
        }
        arraySendToHistogram.push(dateMinutesSend)


    })
    let tmpRta = {
        recordings: tmpHisto,
        histogram: arraySendToHistogram
    }

    return tmpRta

}



export default {
    insertRecordings,
    getRecordings,
    getRecordingsOne,
    updateRecordings,
    deleteRecording,
    RedisCache,
    getAndUpdateRecording,
    getRecordingsFilter,
    timeAvailed,
    timeAvailedForDay

}