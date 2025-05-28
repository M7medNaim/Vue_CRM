<template>
  <div class="me-2" ref="gaugeChart" style="width: 50px; height: 50px"></div>
</template>
<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      score: 75,
    };
  },
  mounted() {
    this.initGauge();
  },
  methods: {
    initGauge() {
      const chart = echarts.init(this.$refs.gaugeChart);

      const option = {
        series: [
          {
            // name: "Speed",
            type: "gauge",
            radius: "90%",
            startAngle: 225,
            endAngle: -45,
            min: 0,
            max: 100,
            // splitNumber: 10,
            axisLine: {
              lineStyle: {
                // width: 10,
                width: 5,
                color: [
                  [0.333, "#ff0000"],
                  [0.666, "#f48e00"],
                  [1, "#eee"],
                ],
              },
            },
            // axisTick: {
            //   length: 12,
            //   lineStyle: {
            //     color: "#ddd",
            //     width: 1,
            //   },
            // },
            // axisLabel: {
            //   distance: 20,
            //   fontSize: 12,
            //   color: "#333",
            // },
            pointer: { show: false },
            // title: {
            //   offsetCenter: [0, "-40%"],
            //   fontSize: 14,
            //   color: "#333",
            // },
            // detail: {
            //   valueAnimation: true,
            //   formatter: "{value} km/h",
            //   color: "#333",
            //   fontSize: 20,
            // },
            detail: {
              show: true,
              valueAnimation: true,
              formatter: "{value}",
              color: "#fff",
              fontSize: 16,
              offsetCenter: [0, "10%"],
            },
            title: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            data: [
              {
                value: this.score,
                // name: "Speed",
              },
            ],
          },
        ],
      };

      chart.setOption(option);
    },
  },
  watch: {
    score() {
      this.initGauge();
    },
  },
};
</script>
