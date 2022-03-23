<template>
  <div class="all">
    <div class="timestamp">{{lastUpdate}}</div>
    <div class="gauges">
      <WaterTemperatureGauge :temperature="waterTemperature"></WaterTemperatureGauge>
      <TemperatureChangeGauge :rate="rate"/>
      <OutsideTemperatureGauge :temperature="ambientTemperature"></OutsideTemperatureGauge>
    </div>
    <div class="chart-container">
      <Timeline
        :water-history="waterHistory"
        :ambient-history="ambientHistory"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import io from "socket.io-client";
import WaterTemperatureGauge from "components/WaterTemperatureGauge";
import OutsideTemperatureGauge from "components/OutsideTemperatureGauge";
import TemperatureChangeGauge from "components/TemperatureChangeGauge";
import Timeline from "components/Timeline";

export default defineComponent({
  name: "PageIndex",
  components: {Timeline, TemperatureChangeGauge, OutsideTemperatureGauge, WaterTemperatureGauge},
  data: function () {
    return {
      waterTemperature: 0,
      ambientTemperature: 0,
      rate: 0,
      lastUpdate: "Waiting for update...",
      history: [],
    }
  },
  computed: {
    waterHistory() {
      return this.history.map((entry) => {
        return {x: new Date(entry["unixTime"] * 1000), y: entry["waterTemperature"]};
      });
    },
    ambientHistory() {
      return this.history.map((entry) => {
        return {x: new Date(entry["unixTime"] * 1000), y: entry["ambientTemperature"]};
      });
    }
  },
  mounted() {
    const socket = io();
    socket.on("new-data", (data) => {
      const {history, growth} = data;
      if (history.length === 0) return;
      this.waterTemperature = history[history.length - 1].waterTemperature;
      this.ambientTemperature = history[history.length - 1].ambientTemperature;
      this.history = history;
      this.rate = growth;
      const now = new Date();
      this.lastUpdate = `${now.toLocaleDateString('en-IL')} ${now.toLocaleTimeString('en-IL')}`;
    });
    socket.on("connect", () => {
      socket.emit("get-data");
    });
  }
});
</script>
<style scoped>
.all {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gauges {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-container {
  padding: 10px;
  width: 100%;
  height: 50%;
  bottom: 0;
}
.timestamp {
  position: absolute;;
  top: 100px;
}
</style>
