import {DataTypes, Sequelize, Op} from "sequelize";
import {DateTime} from "luxon";

const db = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_FILE_PATH || "db.sqlite"
});

export const Timeline = db.define("Timeline", {
  waterTemperature: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ambientTemperature: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  unixTime: {
    type: DataTypes.VIRTUAL,
    get() {
      return Math.round(this.time.getTime() / 1000)
    },
    set(value) {
      throw new Error('Do not try to set the `unixTime` value!');
    }
  }
}, {timestamps: false});

export async function init() {
  await db.sync();
}

export async function getLastDays(days) {
  return await Timeline.findAll({
    where: {
      time: {
        [Op.gte]: DateTime.now().minus({days}).toJSDate()
      }
    }
  });
}

export async function deleteOldEntries(olderThanDays) {
  return await Timeline.destroy({
    where: {
      time: {
        [Op.lt]: DateTime.now().minus({days: olderThanDays}).toJSDate()
      }
    }
  });
}

export async function getGrowth() {
  const data = await Timeline.findAll({
    where: {
      time: {
        [Op.gte]: DateTime.now().minus({hour: 1}).toJSDate()
      }
    },
    raw: true
  });
  const growthStack = data.map(entry => entry.waterTemperature)
  if (data.length < 2) {
    return 0;
  }
  const avg1 = growthStack.slice(0, growthStack.length - 1).reduce((a, b) => a + b) / growthStack.length - 1;
  const avg2 = growthStack.slice(1, growthStack.length).reduce((a, b) => a + b) / growthStack.length - 1;
  const avg_hour = (avg2 - avg1) * 60;
  return Math.round(avg_hour * 100) / 100;
}
