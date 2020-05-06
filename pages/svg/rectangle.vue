<template>
  <section class="main-content">
    <svg
      id="isvg"
      height="300"
      viewBox="0 0 700 230"
    >
      <!-- 左maker -->
      <defs>
        <marker
          id="left"
          viewBox="0 0 20 20"
          refX="0"
          refY="10"
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="10"
          orient="auto"
        >
          <path
            d="M 0 0 L 20 10 L0 20 z"
            fill="#52C41A"
            stroke="black"
          />
        </marker>
      </defs>
      <!-- 右maker -->
      <defs>
        <marker
          id="idArrow"
          viewBox="0 0 20 20"
          refX="0"
          refY="10"
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="10"
          orient="auto"
        >
          <path
            d="M 0 0 L 20 10 L0 20 z"
            fill="#2BA3FD"
            stroke="black"
          />
        </marker>
      </defs>
      <!-- 左边三个 -->
      <g>
        <text
          style="font-family:sans-serif; font-size: 10px;width: 150px;"
          x="145"
          y="45"
          fill="#52C41A"
        >径流来水：{{ svgInWater['径流'] ? svgInWater['径流'] : '0' }}万m³</text>
        <path
          d="M135 50 335 50 L335 70"
          stroke="#52C41A"
          stroke-width="1"
          fill="none"
          marker-end="url(#left)"
        />
      </g>
      <g>
        <text
          style="font-family:sans-serif; font-size: 10px;width: 150px;"
          x="10"
          y="90"
          fill="#52C41A"
        >东部引水：{{ svgInWater['东深'] ? svgInWater['东深'] : '0' }}万m³</text>
        <path
          d="M0 95 10 95 L200 95"
          stroke="#52C41A"
          stroke-width="1"
          fill="none"
          marker-end="url(#left)"
        />
      </g>
      <g>
        <text
          style="font-family:sans-serif; font-size: 10px;width: 150px;"
          x="10"
          y="130"
          fill="#52C41A"
        >长岭皮来水：{{ svgInWater['长岭皮'] ? svgInWater['长岭皮'] : '0' }}万m³</text>
        <path
          d="M0 135 0 135 L200 135"
          stroke="#52C41A"
          stroke-width="1"
          fill="none"
          marker-end="url(#left)"
        />
      </g>
      <!-- 下面是右边三个 -->
      <g>
        <text
          style="font-family:sans-serif; font-size: 10px;width: 150px;"
          x="470"
          y="90"
          fill="#2BA3FD"
        >转供铁岗: {{ svgOutWater['铁岗'] ? svgOutWater['铁岗']: '0' }}万m³</text>
        <path
          d="M460 95 460 95 L660 95"
          stroke="#2BA3FD"
          stroke-width="1"
          fill="none"
          marker-end="url(#idArrow)"
        />
      </g>
      <g>
        <text
          style="font-family:sans-serif; font-size: 10px;width: 150px;"
          x="470"
          y="130"
          fill="#2BA3FD"
        >取水塔出水：{{ svgOutWater['大冲'] ? svgOutWater['大冲']: '0' }}万m³</text>
        <path
          d="M460 135 460 135 L660 135"
          stroke="#2BA3FD"
          stroke-width="1"
          fill="none"
          marker-end="url(#idArrow)"
        />
      </g>
      <g>
        <text
          style="font-family:sans-serif; font-size: 10px;width: 150px;"
          x="345"
          y="195"
          fill="#2BA3FD"
        >泄洪：{{ svgOutWater['泄洪'] ? svgOutWater['泄洪']: '0' }}万m³</text>
        <path
          d="M335 155 335 180 L535 180"
          stroke="#2BA3FD"
          stroke-width="1"
          fill="none"
          marker-end="url(#idArrow)"
        />
      </g>
      <g>
        <rect
          width="250"
          height="80"
          fill="none"
          x="210"
          y="75"
          stroke="#2BA3FD"
        />
        <text
          x="310"
          y="120"
          fill="#2BA3FD"
        >西丽水库</text>
      </g>
    </svg>
  </section>
</template>
<script>
export default {
  data() {
    return {
      svgInWater: {},
      svgOutWater: {}
    };
  }
};
</script>
<style lang="scss" scoped>
.main-content {
  // box-sizing: border-box;
  width: auto;
  min-height: 800px;
  background-color: #ffffff;
  margin: 20px;
  svg {
  // border: 1px solid black;
  width: 100%;
  /* height: 250px; */
  margin: 0 auto;
}
}</style>
