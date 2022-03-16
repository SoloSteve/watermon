const express = require("express");
const ds18b20 = require("ds18b20");

const app = express();
const sensorIds = {water: "28-0114405c98aa", outside: "28-0114404149aa"};

class MaxStack {
  constructor(max) {
    this.max = max;
    this.stack = [];
  }

  push(val) {
    this.stack.push(val);
    if (this.stack.length > this.max) {
      this.stack.shift();
    }
  }

}

const growthStack = new MaxStack(60);
const historyStack = new MaxStack(48);

function getTemperaturePromise(sensorId) {
  return new Promise((resolve, reject) => {
    ds18b20.temperature(sensorId, {"parser": "hex"}, (err, val) => {
      if (err) {
        reject(err);
      }
      resolve(val);
    });
  });
}


app.get("/raw", async (req, res) => {
  try {
    const values = await Promise.all([getTemperaturePromise(sensorIds.water), getTemperaturePromise(sensorIds.outside)]);
    res.json({water: values[0], outside: values[1]});
  } catch {
    res.status(500).end();
  }
});

app.get("/growth", (req, res) => {
  res.json(getGrowth());
});

app.get("/history", (req, res) => {
  res.json(historyStack.stack);
});

app.get("/debug", (req, res) => {
  res.json({
    historyStack: historyStack.stack,
    growthStack: growthStack.stack,
    growth: getGrowth(),
    sensorIds
  });
});

// Jobs

function getGrowth() {
  if (growthStack.stack.length < 2) {
    return 0;
  }
  const avg1 = growthStack.stack.slice(0, growthStack.stack.length - 1).reduce((a, b) => a + b) / growthStack.stack.length - 1;
  const avg2 = growthStack.stack.slice(1, growthStack.stack.length).reduce((a, b) => a + b) / growthStack.stack.length - 1;
  const avg_hour = (avg2 - avg1) * 60;
  return Math.round(avg_hour * 100) / 100;
}

setInterval(async () => {
  try {
    const value = await getTemperaturePromise(sensorIds.water);
    growthStack.push(value);
  } catch (e) {
    console.error(e);
  }
}, 60 * 1000);

setInterval(async () => {
  try {
    const value = await getTemperaturePromise(sensorIds.water);
    historyStack.push({value, date: Date.now()});
  } catch (e) {
    console.error(e);
  }
}, 30 * 60 * 1000);

app.use(express.static("public"));

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
