import ds18b20 from "ds18b20";

export function getTemperaturePromise(sensorId) {
  return 0;
  return new Promise((resolve, reject) => {
    ds18b20.temperature(sensorId, {"parser": "hex"}, (err, val) => {
      if (err) {
        reject(err);
      }
      resolve(val + 0.3);
    });
  });
}
