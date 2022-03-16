<template>
  <RadialGauge
    :options="gaugeOptions"
    :value="rate"
  ></RadialGauge>
</template>

<script>
import RadialGauge from "vue-canvas-gauges/src/RadialGauge";

export default {
  name: "TemperatureChangeGauge",
  components: {
    RadialGauge,
  },
  props: {
    rate: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      gaugeOptions: {
        title: "Warming Rate",
        width: window.innerWidth / 3,
        height: 160,
        units: "°C/h",
        minValue: -0.5,
        maxValue: 0.5,
        valueInt: 1,
        valueDec: 2,
        majorTicks: [-0.5, -0.375, -0.25, -0.125, 0, 0.125, 0.25, 0.375, 0.5],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [
          {
            "from": -0.5,
            "to": 0,
            "color": "#FFCCCB"
          },
          {
            "from": 0,
            "to": 0.5,
            "color": "#B2E9AF"
          }
        ],
        colorPlate: "#eee",
        fontValueSize: 45,
        borderShadowWidth: 0,
        borders: false,
        needleType: "arrow",
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 1500,
        animationRule: "linear"
      }
    }
  },

}
</script>

<style scoped></style>
