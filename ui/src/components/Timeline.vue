<template>
  <canvas ref="chart" id="chart"></canvas>
</template>
<script>
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);


export default {
  props: {
    waterHistory: {
      type: Array,
      required: true
    },
    ambientHistory: {
      type: Array,
      required: true
    }
  },
  watch: {
    waterHistory: {
      handler(newValue) {
        this.chart.data.datasets[0].data = newValue
        this.chart.update();
      },
      deep: true
    },
    ambientHistory: {
      handler(newValue) {
        this.chart.data.datasets[1].data = newValue
        this.chart.update();
      },
      deep: true
    }
  },
  data: function () {
    return {
      options: {
        // responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            text: 'Chart.js Time Scale',
            display: true
          },
          tooltip: {
            mode: "nearest",
            intersect: false
          },
          annotation: {
            annotations: {
              midnight1: {
                type: "line",
                xMin: (new Date()).setHours(0, 0, 0, 0),
                xMax: (new Date()).setHours(0, 0, 0, 0),
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
              },
              midnight2: {
                type: "line",
                xMin: (d => new Date(d.setDate(d.getDate() - 1)))(new Date).setHours(0, 0, 0, 0),
                xMax: (d => new Date(d.setDate(d.getDate() - 1)))(new Date).setHours(0, 0, 0, 0),
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
              },
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            display: true,
            time: {
              unit: "hour",
              displayFormats: {
                millisecond: 'HH:mm:ss.SSS',
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'HH:mm'
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'temperature'
            },
            ticks: {
              callback: function (value, index, ticks) {
                return `${value}°`
              }
            },
            min: 20,
            max: 36
          },
          y2: {
            type: 'linear',
            position: 'right',
            ticks: {
              callback: function (value, index, ticks) {
                return `${value}°`
              }
            },
            grid: {
              drawOnChartArea: false
            },
            min: 5,
            max: 50,
          }
        },
      },
    }
  },
  mounted() {
    const ctx = document.getElementById('chart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [{
          label: 'Water Temperature',
          data: this.waterHistory,
          fill: false,
          borderColor: '#0090ff',
          tension: 0.1,
          pointRadius: 0,
          yAxisID: 'y'
        },
          {
            label: 'Ambient Temperature',
            data: this.ambientHistory,
            fill: false,
            borderColor: '#35A23F',
            tension: 0.1,
            pointRadius: 0,
            yAxisID: 'y2'
          }
        ]
      },
      options: this.options
    });
  }
}
</script>

<style scoped>
</style>
