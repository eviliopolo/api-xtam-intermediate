import recordingsModel from "../components/recordings/recordings";
import redisConect from "./redis.client"

const client = new redisConect();



async function syncInfoMongoDB() {

    setInterval(async () => {
        const resRedis = await client.connectRedis();
        const keys = await resRedis.keys('*')
        let tmpKeyInfo: any
        keys.map(async item => {
            const infoKeys = item.split("-")
            const id_xtam = parseInt(infoKeys[0])
            const date = new Date(infoKeys[1])
            tmpKeyInfo = await resRedis.get(item)
            const recording = JSON.parse(tmpKeyInfo)
            const cameras = recording[0]["cameras"]
            const response = await recordingsModel.findOneAndUpdate({ id_xtam: id_xtam, date: date }, { $set: { cameras: cameras } })
            console.log("redis updated  !!", response);

        })

    }, 60000)


}


export default { syncInfoMongoDB }