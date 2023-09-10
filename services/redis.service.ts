import recordingsModel from "../components/recordings/recordings";
import redisConect from "./redis.client";
import cron from "node-cron";

const client = new redisConect();



async function syncInfoMongoDB() {
    setInterval(async () => {
        const resRedis = await client.connectRedis();
        const keys = await resRedis.keys("*");
        let tmpKeyInfo: any;
        keys.map(async (item) => {
            const infoKeys = item.split("-");
            const id_xtam = parseInt(infoKeys[0]);
            const date = new Date(infoKeys[1]);
            tmpKeyInfo = await resRedis.get(item);
            const recording = JSON.parse(tmpKeyInfo);
            const cameras = recording[0]["cameras"];
            let response: any = await recordingsModel.findOneAndUpdate(
                { id_xtam: id_xtam, date: date },
                { $set: { cameras: cameras } }
            );
            if (response === null) {
                response = await recordingsModel.create(recording);
                console.log("redis in create  mongo !!", response);
                resRedis.del(item);
                return true;
            }
            resRedis.del(item);
            console.log("redis in updated mongo  !!", response);
        });
    }, 1800000);
}

async function deleteMongo() {
    cron.schedule("0 0 23 * * *", async () => {
        const date = new Date();
        const daysToDeletion = 60;
        const dateToday = new Date().toISOString();
        const deletionDate = new Date(
            date.setDate(date.getDate() - daysToDeletion)
        ).toISOString();
        const delet: any = await recordingsModel.deleteMany({
            createdAt: { $gte: deletionDate, $lt: dateToday },
        });
        console.log("date delete from mongo ", delet);
    });
}

export default { syncInfoMongoDB, deleteMongo };
