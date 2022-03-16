<template>
  <LinearGauge
    :options="gaugeOptions"
    :value="temperature"
  ></LinearGauge>
</template>

<script>
import LinearGauge from "vue-canvas-gauges/src/LinearGauge";

export default {
  name: "WaterTemperatureGauge",
  components: {
    LinearGauge,
  },
  props: {
    temperature: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      gaugeOptions: {
        title: "Water",
        barBeginCircle: 20,
        width: 160,
        height: 400,
        // units: "°C",
        minValue: 20,
        maxValue: 35,
        startAngle: 90,
        ticksAngle: 180,
        needleType: "arrow",
        needle: true,
        majorTicks: [
          "20",
          "25",
          "30",
          "35",
        ],
        minorTicks: 10,
        strokeTicks: true,
        highlights: [
          {
            "from": 20,
            "to": 30,
            "color": "#FFCCCB"
          },
          {
            "from": 30,
            "to": 32,
            "color": "#FEF6C5"
          },
          {
            "from": 32,
            "to": 34,
            "color": "#B2E9AF"
          }
        ],
        borderShadowWidth: 0,
        borders: false,
        animationDuration: 1500,
        animationRule: "linear",
        barWidth: 10,
        valueInt: 2,
        valueDec: 1,
        valueBoxStroke: 0,
        colorPlate: "#eee",
        colorTitle: "#0090ff",
        valueBox: true,
        colorValueText: "#0090ff",
        fontValueSize: 36,
        colorBarProgress: "#0090ff",
        colorBarProgressEnd: "#0090ff",
        colorValueTextShadow: false,
        colorValueBoxBackground: false,
      }
    }
  },

}
</script>

<style scoped></style>
