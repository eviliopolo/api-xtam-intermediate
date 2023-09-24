import recordingsModel from "../components/recordings/recordings";
import redisConect from "./redis.client";
import cron from "node-cron";

const client = new redisConect();

async function syncInfoMongoDB() {
  setInterval(async () => {
    const resRedis = await client.connectRedis();
    const keys = await resRedis.keys("*");
    if (keys.length > 0) {
      let tmpKeyInfo: any;
      keys.map(async (item) => {
        const infoKeys = item.split("-");
        const id_xtam = parseInt(infoKeys[0]);
        const date = new Date(infoKeys[1]);
        tmpKeyInfo = await resRedis.get(item);
        const recording = JSON.parse(tmpKeyInfo);
        const cameras = recording[0]["cameras"];
        let responseCameras: any = await recordingsModel.findOne({
          id_xtam: id_xtam,
          date: date,
        });
        let response: any;
        let camerasMongo: any;
        let camerasRedis: any;
        if (responseCameras !== null) {
          camerasMongo = Object.values(responseCameras.cameras[0]);
          camerasRedis = Object.values(cameras);
          camerasMongo.map((cam: any, index: any) => {
            camerasRedis[index].recordings.map((item: any) => {
              cam.recordings.push(item);
            });
          });
        }
        response = await recordingsModel.findOneAndUpdate(
          { id_xtam: id_xtam, date: date },
          { $set: { cameras: responseCameras?.cameras[0] } }
        );
        if (responseCameras === null) {
          response = await recordingsModel.create(recording);
          console.log("redis in create  mongo !!", response);
          resRedis.del(item);
          return true;
        }
        resRedis.del(item);
        console.log("redis in updated mongo  !!", response);
      });
    } else {
      console.log("not exists data for update");
    }
  }, 360000);
}

async function deleteMongo() {
  cron.schedule("0 0 23 * * *", async () => {
    const date = new Date();
    const daysToDeletionOne = 60;
    const daysToDeletionTwo = 59;
    const dateToday = new Date(
      date.setDate(date.getDate() - daysToDeletionTwo)
    ).toISOString();
    const deletionDate = new Date(
      date.setDate(date.getDate() - daysToDeletionOne)
    ).toISOString();
    const delet: any = await recordingsModel.deleteMany({
      createdAt: { $gte: deletionDate, $lt: dateToday },
    });
    console.log("date delete from mongo ", delet);
  });
}

export default { syncInfoMongoDB, deleteMongo };
