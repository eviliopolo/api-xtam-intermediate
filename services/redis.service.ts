import recordingsModel from "../components/recordings/recordings";
import redisConect from "./redis.client"

const client = new redisConect();



async function syncInfoMongoDB() {

    setInterval(async () => {
        const resRedis = await client.connectRedis();
        const keys = await resRedis.keys('*')
        let tmpKeyInfo: any
        keys.map(async item => {
            console.log(item)
            const infoKeys = item.split("-")
            const id_xtam = parseInt(infoKeys[0])
            const date = new Date((infoKeys[1]+"-"+infoKeys[2]+"-"+infoKeys[3]))
       
            tmpKeyInfo = await resRedis.get(item)
            const recording = JSON.parse(tmpKeyInfo)
            const cameras = recording[0]["cameras"]
            try {
                const response = await recordingsModel.findOneAndUpdate(
                  { id_xtam: id_xtam, date: date },
                  { $set: { cameras: cameras } },
                  { upsert: true, new: true }
                );
                console.log("redis updated!!", response);
              } catch (error) {
                console.error("Error al actualizar en MongoDB:", error);
              }              

        })

    }, 60000)


}


export default { syncInfoMongoDB }