import express from "express";
import {CronJob} from "cron";
import {deleteOldEntries, getGrowth, getLastDays, init, Timeline} from "./db.mjs";
import {getTemperaturePromise} from "./sensor.mjs";
import {Server} from "socket.io";

async function main() {
  await init();
  const app = express();
  app.use(express.static(process.env.WEB || "../ui/dist/spa"));

  const server = app.listen(3000, () => {
    console.log("Listening on port 3000");
  });

  const io = new Server(server, {});

  io.on("connection", (socket => {
    socket.on("get-data", async () => {
      const history = await getLastDays(2);
      const growth = await getGrowth();
      io.emit("new-data", {history, growth});
    })
  }));

  const historyJob = new CronJob("0 * * * * *", async () => {
    const waterTemperature = await getTemperaturePromise(process.env.WATER_SENSOR_ID);
    const ambientTemperature = await getTemperaturePromise(process.env.AMBIENT_SENSOR_ID);
    const time = new Date();
    await Timeline.create({waterTemperature, ambientTemperature, time});

    const history = await getLastDays(2);
    const growth = await getGrowth();
    io.emit("new-data", {history, growth});
  });

  const deletionJob = new CronJob("* * * 1 * *", async () => {
    await deleteOldEntries(30);
  });

  historyJob.start();
  deletionJob.start();
}

// noinspection JSIgnoredPromiseFromCall
main();
