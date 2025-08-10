<template>
  <div class="placement-wrapper">
    <div class="header">
      <h1 class="title">02 击球详情</h1>
    </div>
    <div class="placement-select">
      <div class="placement-tab-list">
        <el-button
          type="text"
          class="placement-btn"
          :class="{ active: activeTab === 'hit' }"
          @click="switchTab('hit')"
        >击球落点</el-button>
        <span class="placement-tab" :class="{ active: activeTab === 'area' }">落点区域</span>
        <el-button
          type="text"
          class="placement-btn"
          :class="{ active: activeTab === 'serve' }"
          @click="switchTab('serve')"
        >发球落点</el-button>
      </div>
      <div class="court-container">
        <div class="courts-wrapper">
          <canvas ref="courtCanvas1" :width="courtWidth" :height="courtHeight"></canvas>
          <canvas ref="courtCanvas2" :width="courtWidth" :height="courtHeight"></canvas>
        </div>
      </div>
      <div class="legend">
        <div class="legend-section">
          <span class="dot deep-forehand"></span><span class="dot-text">深区</span>
        </div>
        <div class="legend-section">
          <span class="dot shallow-forehand"></span><span class="dot-text">浅区</span>
        </div>
      </div>
    </div>
    <!-- 只挂载当前tab的子组件，子组件通过事件传点 -->
    <HitPlacement v-if="activeTab === 'hit'" @update-points="updatePoints" />
    <ServePlacement v-if="activeTab === 'serve'" @update-points="updatePoints" />
  </div>
</template>

<script>
import HitPlacement from '../components/hitPlacement.vue'
import ServePlacement from '../components/servePlacement.vue'
import { getPointColor } from '@/utils/pointColor.js'

export default {
  name: 'Placement',
  components: { HitPlacement, ServePlacement },
  data() {
    return {
      activeTab: 'hit',
      courtWidth: 450,
      courtHeight: 600,
      points1: [], // 左侧球场数据
      points2: []  // 右侧球场数据
    }
  },
  mounted() {
    this.drawCourt()
  },
  watch: {
    points1() {
      this.drawCourt()
    },
    points2() {
      this.drawCourt()
    },
    activeTab() {
      this.points1 = []
      this.points2 = []
      this.drawCourt()
    }
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab
    },
    updatePoints(newPoints, courtIndex = 1) {
      if (courtIndex === 1) {
        this.points1 = newPoints
      } else {
        this.points2 = newPoints
      }
    },
    drawCourt() {
      // 绘制第一个球场
      const ctx1 = this.$refs.courtCanvas1.getContext('2d')
      ctx1.clearRect(0, 0, this.courtWidth, this.courtHeight)
      
      // 绘制第二个球场
      const ctx2 = this.$refs.courtCanvas2.getContext('2d')
      ctx2.clearRect(0, 0, this.courtWidth, this.courtHeight)
      
      // 绘制第一个球场
      this.drawSingleCourt(ctx1, this.points1)
      // 绘制第二个球场
      this.drawSingleCourt(ctx2, this.points2)
    },
    
    drawSingleCourt(ctx, points) {

      // 1. 画外场线（双打边线）
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.strokeRect(0, 0, this.courtWidth, this.courtHeight)

      // 2. 画内场线（单打边线）
      const singleLeft = this.courtWidth * (1.37 / 10.97)
      const singleRight = this.courtWidth * (9.6 / 10.97)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(singleLeft, 0)
      ctx.lineTo(singleLeft, this.courtHeight)
      ctx.moveTo(singleRight, 0)
      ctx.lineTo(singleRight, this.courtHeight)
      ctx.stroke()

      // 3. 画底线
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(this.courtWidth, 0)
      ctx.stroke()

      // 4. 画球网（底部，粗线）
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(0, this.courtHeight - 1)
      ctx.lineTo(this.courtWidth, this.courtHeight - 1)
      ctx.stroke()

      // 5. 画发球线（距离球网6.4米）
      const serviceLineY = this.courtHeight * (7.01 / 13.41)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(singleLeft, serviceLineY)
      ctx.lineTo(singleRight, serviceLineY)
      ctx.stroke()

      // 6. 画中线（发球区中线）
      ctx.beginPath()
      ctx.moveTo(this.courtWidth / 2, serviceLineY)
      ctx.lineTo(this.courtWidth / 2, this.courtHeight)
      ctx.stroke()

      // 7. 画T区短线（球网中点到发球线中点）
      ctx.beginPath()
      ctx.moveTo(this.courtWidth / 2, this.courtHeight - 1)
      ctx.lineTo(this.courtWidth / 2, serviceLineY)
      ctx.stroke()

      // 8. 画分区线（3米线，深区/浅区分界线，距离球网3米）
      const deepLineY = this.courtHeight * (3 / 13.41)
      ctx.strokeStyle = '#00eaff'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(0, deepLineY)
      ctx.lineTo(this.courtWidth, deepLineY)
      ctx.stroke()

      // 9. 画标注
      ctx.save()
      ctx.fillStyle = '#00eaff'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText('深区', this.courtWidth - 70, deepLineY - 15)
      ctx.restore()

      ctx.save()
      ctx.fillStyle = '#00ff99'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText('浅区', this.courtWidth - 70, deepLineY + 50)
      ctx.restore()

      ctx.save()
      ctx.fillStyle = '#fff'
      ctx.font = '20px sans-serif'
      ctx.fillText('3米', 8, deepLineY - 8)
      ctx.restore()

      // 10. 画点
      points.forEach(pt => {
        ctx.beginPath()
        ctx.arc(pt.x * this.courtWidth, pt.y * this.courtHeight, 10, 0, 2 * Math.PI)
        ctx.fillStyle = getPointColor(pt.y, pt.type)
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1.5
        ctx.stroke()
      })
    }
    }
  }

</script>
<style scoped>
.placement-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #192040;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 确保背景覆盖整个页面，包括滚动条区域 */
body {
  margin: 0;
  padding: 0;
  background: #192040;
  overflow-x: hidden;
}

html {
  background: #192040;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 2;
}
.title {
  font-size: 2.2rem;
  color: #fff;
  margin: 32px 0 0 48px;
  font-weight: bold;
  letter-spacing: 2px;
}
.placement-select {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  z-index: 1;
}

.courts-wrapper {
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: center;
  justify-content: center;
}
.placement-tab-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3vw;
  margin-top: 32px;
  margin-bottom: 20px;
}
.placement-btn {
  font-size: 1.3rem;
  color: #409EFF;
  font-weight: 500;
  padding: 0.5rem 2.5rem;
  border-radius: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}
.placement-btn.active,
.placement-btn:hover {
  background: #eaf4ff;
  color: #409EFF;
  font-weight: bold;
}
.placement-tab {
  font-size: 1.3rem;
  color: #888;
  font-weight: 500;
  padding: 0.5rem 2.5rem;
  border-radius: 2rem;
  background: none;
  transition: color 0.2s, background 0.2s;
}
.placement-tab.active {
  color: #409EFF;
  background: #eaf4ff;
  font-weight: bold;
}
.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}
.dot.shallow {
  background: #ffe600;
}
.dot.deep {
  background: #ff5ca9;
}
.dot.deep-forehand {
  background: #ffd700; /* 深黄（深区正手） */
}
.dot.deep-backhand {
  background: #fff4b0; /* 浅黄（深区反手） */
}
.dot.shallow-forehand {
  background: #ff1493; /* 深粉（浅区正手） */
}
.dot.shallow-backhand {
  background: #ffb6c1; /* 浅粉（浅区反手） */
}
.dot-text {
  display: inline-block;
  font-size: 1.2rem;
  color: #888;
  margin-left: 5px;
}

.legend {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 20px;
}

.legend-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}
</style>