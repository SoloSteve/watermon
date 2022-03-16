<template>
  <LinearGauge
    :options="gaugeOptions"
    :value="temperature"
  ></LinearGauge>
</template>

<script>
import LinearGauge from "vue-canvas-gauges/src/LinearGauge";

export default {
  name: "OutsideTemperatureGauge",
  components: {
    LinearGauge,
  },
  props: {
    temperature: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      gaugeOptions: {
        title: "Ambient",
        barBeginCircle: 20,
        width: 160,
        height: 400,
        // units: "°C",
        minValue: 5,
        maxValue: 50,
        // startAngle: 90,
        // ticksAngle: 180,
        needleType: "arrow",
        needle: true,
        majorTicks: [5, 10, 15, 20, 25, 30, 25, 40, 45, 50],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [],
        borderShadowWidth: 0,
        borders: false,
        animationDuration: 1500,
        animationRule: "linear",
        barWidth: 10,
        valueInt: 2,
        valueDec: 1,
        valueBoxStroke: 0,
        colorPlate: "#eee",
        colorTitle: "#35A23F",
        valueBox: true,
        // colorValueText: "#0090ff",
        fontValueSize: 36,
        colorBarProgress: "#35A23F",
        // colorBarProgressEnd: "#0090ff",
        colorValueTextShadow: false,
        colorValueBoxBackground: false,
      }
    }
  },

}
</script>

<style scoped></style>
