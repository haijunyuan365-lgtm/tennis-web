<template>
  <div class="tennis-container">
    <!-- 顶部栏 -->
    <el-row class="top-bar" type="flex" justify="space-between" align="middle">
      <el-col :span="8" class="left-section">
        <h1>智能网球</h1>
      </el-col>
      <el-col :span="8" class="center-section">
        <div class="match-mode-tag"><span class="match-text">比赛模式({{gameMode}})</span></div>
      </el-col>
      <el-col :span="8" class="right-section"><span class="current-time">时间：{{ formattedTime }}</span></el-col>
    </el-row>

    <!-- 中间内容区 -->
    <el-row class="middle-section">
      <!-- 左边边摄像头区域 -->
      <el-col :span="12" class="camera-container">
        <div class="camera-controls">
          <div class="view-buttons">
            <el-button size="mini" @click="switchView2D()">落点图</el-button>
            <el-button size="mini" @click="switchView3D()">U3D</el-button>
            <el-button size="mini" @click="switchView('angle1')">视角1</el-button>
            <el-button size="mini" @click="switchView('angle2')">视角2</el-button>
          </div>
          <el-button class="swap-court" size="mini" type="warning" @click="swapCourt">交换场地</el-button>
        </div>
        <!--视图-->
        <div class="video-preview">
          <template v-if="isDisable">
            <!-- 子路由 -->
            <router-view></router-view>
          </template>

          <div v-show="!isDisable">
            <!--2D落点图-->
            <canvas v-show="activeView == '2d'" ref="courtCanvas" width="500" height="800"
              style="border: 1px solid;"></canvas>

            <!--默认-->
            <div v-if="activeView != '2d' && activeView != null" class="placeholder">
              <p>摄像头实时画面</p>
              <p>当前视图: {{ activeView }}</p>
            </div>
            <!-- <div v-else> -->

            <!-- </div> -->
          </div>
        </div>
      </el-col>
      <!-- 右边表格 -->
      <el-col :span="12" class="data-table-container">
        <div class="table-wrapper">
          <!-- 表格顶部信息栏 -->
          <div class="table-info-bar"><span>第{{ currentRow + 1 }}/{{ tableData.length }}条（第{{
            currentRound }}/{{ maxRound }}回合）</span></div>
          <!-- 表格主体 -->
          <el-table ref="tennisTable" :data="pagedTableData" border height="calc(100% - 90px)"
            highlight-current-row @current-change="handleCurrentChange">
            <el-table-column prop="time" label="时间" min-width="120" align="center"></el-table-column>
            <el-table-column prop="player" label="姓名" min-width="100" align="center"></el-table-column>
            <el-table-column prop="direction" label="方向" min-width="100" align="center">
              <template slot-scope="scope"><span>{{ scope.row.direction === 'A' ? 'A→B' : 'B→A' }}</span></template>
            </el-table-column>
            <el-table-column prop="type" label="类型" min-width="100" align="center"></el-table-column>
            <el-table-column prop="result" label="结果" min-width="100" align="center"></el-table-column>
            <el-table-column prop="speed" label="速度(km/h)" min-width="120" align="center"></el-table-column>
            <el-table-column prop="rotation" label="转速(rp/m)" min-width="120" align="center"></el-table-column>
          </el-table>
          <!-- 表格底部分页栏 -->
          <div class="table-pagination">
            <el-button size="mini" :disabled="currentRound === 1" @click="goToPrevRound()">上一回合</el-button>
            <div class="page-input">
              <el-input v-model="inputPage" size="mini" style="width: 50px; margin: 0 5px;"
                @keyup.enter.native="goToPage"></el-input>
              <el-button size="mini" @click="goToPage">GO</el-button>
            </div>
            <el-button size="mini" :disabled="currentRound === maxRound" @click="goToNextRound()">下一回合</el-button>
            <el-button size="mini" @click="jumpToCurrentRound">当前回合</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 底部控制栏 -->
    <el-row class="bottom-controls" type="flex" justify="space-between" align="middle">
      <el-col :span="12" class="left-controls">
        <el-button size="small" @click="showStats">数据统计</el-button>
        <el-button size="small" @click="challenge">挑战</el-button>
        <span class="action-info" v-if="currentSelectedRow">
          [{{ currentSelectedRow.player }}] {{ currentSelectedRow.direction === 'A' ? 'A→B' : 'B→A' }}
          {{ currentSelectedRow.type }} {{ currentSelectedRow.result }}
        </span>
        <span class="action-info" v-else>未选择数据</span>
      </el-col>
      <el-col :span="12" class="right-controls">
        <el-button size="small" type="info" @click="modeChange">模式切换</el-button>
        <el-button size="small" type="success" @click="restartMatch">重新开始</el-button>
        <el-button size="small" type="danger" @click="endMatch">结束比赛</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  Row,
  Col,
  Table,
  TableColumn,
  Button,
  Input,
  Message,
  MessageBox
} from 'element-ui'
import 'element-ui/lib/theme-chalk/row.css'
import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/table-column.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/message-box.css'
// import router from 'src/router'

export default {
  name: 'MatchingPage',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
    [Input.name]: Input
  },
  data() {
    return {
      startTime: null,
      elapsedTime: 0,
      timer: null,
      tableData: [
        // 第一回合 5条数据，第四条得分，最后一条出界
        { id: 101, time: '00:01:01', player: 'Player1', direction: 'A', type: '发球', result: '界内', speed: '183', rotation: '3100', round: 1, x: 58, y: 75, inCourt: true },
        { id: 102, time: '00:01:05', player: 'Player2', direction: 'B', type: '回球', result: '界内', speed: '135', rotation: '2700', round: 1, x: 50, y: 35, inCourt: true },
        { id: 103, time: '00:01:10', player: 'Player1', direction: 'A', type: '回球', result: '界内', speed: '140', rotation: '2800', round: 1, x: 42, y: 68, inCourt: true },
        { id: 104, time: '00:01:15', player: 'Player2', direction: 'B', type: '回球', result: '得分', speed: '160', rotation: '3000', round: 1, x: 40, y: 40, inCourt: true },
        { id: 105, time: '00:01:20', player: 'Player1', direction: 'A', type: '发球', result: '出界', speed: '190', rotation: '3300', round: 1, x: 90, y: 103, inCourt: false },

        // 第二回合 15条数据，第11条得分，最后一条出界
        { id: 201, time: '00:02:01', player: 'Player2', direction: 'B', type: '发球', result: '界内', speed: '180', rotation: '3100', round: 2, x: 65, y: 38, inCourt: true },
        { id: 202, time: '00:02:05', player: 'Player1', direction: 'A', type: '回球', result: '界内', speed: '140', rotation: '2900', round: 2, x: 42, y: 72, inCourt: true },
        { id: 203, time: '00:02:10', player: 'Player2', direction: 'B', type: '回球', result: '界内', speed: '125', rotation: '2700', round: 2, x: 63, y: 32, inCourt: true },
        { id: 204, time: '00:02:15', player: 'Player1', direction: 'A', type: '回球', result: '界内', speed: '110', rotation: '2500', round: 2, x: 38, y: 65, inCourt: true },
        { id: 205, time: '00:02:20', player: 'Player2', direction: 'B', type: '发球', result: '界内', speed: '175', rotation: '3000', round: 2, x: 46, y: 40, inCourt: true },
        { id: 206, time: '00:02:25', player: 'Player1', direction: 'A', type: '回球', result: '界内', speed: '135', rotation: '2850', round: 2, x: 62, y: 70, inCourt: true },
        { id: 207, time: '00:02:30', player: 'Player2', direction: 'B', type: '回球', result: '界内', speed: '120', rotation: '2600', round: 2, x: 70, y: 35, inCourt: true },
        { id: 208, time: '00:02:35', player: 'Player1', direction: 'A', type: '发球', result: '界内', speed: '185', rotation: '3200', round: 2, x: 55, y: 67, inCourt: true },
        { id: 209, time: '00:02:40', player: 'Player2', direction: 'B', type: '回球', result: '界内', speed: '150', rotation: '3100', round: 2, x: 39, y: 38, inCourt: true },
        { id: 210, time: '00:02:45', player: 'Player1', direction: 'A', type: '回球', result: '界内', speed: '140', rotation: '2900', round: 2, x: 60, y: 71, inCourt: true },
        { id: 211, time: '00:02:50', player: 'Player2', direction: 'B', type: '回球', result: '得分', speed: '155', rotation: '3050', round: 2, x: 43, y: 37, inCourt: true },
        { id: 212, time: '00:02:55', player: 'Player1', direction: 'A', type: '发球', result: '界内', speed: '170', rotation: '3000', round: 2, x: 79, y: 69, inCourt: true },
        { id: 213, time: '00:03:00', player: 'Player2', direction: 'B', type: '回球', result: '界内', speed: '130', rotation: '2750', round: 2, x: 45, y: 35, inCourt: true },
        { id: 214, time: '00:03:05', player: 'Player1', direction: 'A', type: '回球', result: '界内', speed: '120', rotation: '2700', round: 2, x: 61, y: 66, inCourt: true },
        { id: 215, time: '00:03:10', player: 'Player2', direction: 'B', type: '回球', result: '出界', speed: '100', rotation: '2500', round: 2, x: 50, y: 103, inCourt: false }
      ],

      currentRound: 1,//当前回合
      activeView: '2d',
      currentRow: -1,//数据选中行
      inputPage: 1,
      currentSelectedRow: null,
      //球场数据
      canvasWidth: 500,
      canvasHeight: 800,
      courtHeight: 700,
      courtWidth: 700 * (10.97 / 23.77), // 约 323
      offsetX: 0,  // 稍后在 mounted 中计算赋值
      offsetY: 50,
      isDisable: false,
      gameMode:''
    }
  },
  computed: {
    formattedTime() {
      const hours = Math.floor(this.elapsedTime / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((this.elapsedTime % 3600) / 60).toString().padStart(2, '0');
      const seconds = (this.elapsedTime % 60).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    pagedTableData() {
      return this.tableData.filter(item => item.round === this.currentRound);
    },
    maxRound() {
      if (this.tableData.length === 0) {
        return 0; // 当没有数据时返回0
      }
      return Math.max(...this.tableData.map(item => item.round));
    }
  },
  mounted() {
    this.$message = Message
    this.$confirm = MessageBox.confirm

    this.startTimer();
    this.$nextTick(() => {
      this.jumpToCurrentRound();
    });
    //初始化网球场
    this.offsetX = (this.canvasWidth - this.courtWidth) / 2;

    const canvas = this.$refs.courtCanvas;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    const ctx = canvas.getContext("2d");

    this.drawCourt(ctx);
    this.drawPoints(ctx, this.tableData);
    //单双打
    this.gameMode = localStorage.getItem('gameMode') === 'single'?'单打':'双打'
  },
  watch: {
    tableData: {
      handler() {
        const canvas = this.$refs.courtCanvas;
        const ctx = canvas.getContext("2d");
        this.drawCourt(ctx);
        this.drawPoints(ctx, this.tableData);
      },
      deep: true
    },
    currentSelectedRow() {
      const canvas = this.$refs.courtCanvas;
      const ctx = canvas.getContext("2d");
      this.drawCourt(ctx);
      this.drawPoints(ctx, this.tableData);
    },
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    jumpToCurrentRound() {
      if (this.tableData.length === 0) { return; }
      const lastRound = Math.max(...this.tableData.map(item => item.round));
      const lastRoundData = this.tableData.filter(item => item.round === lastRound);
      const lastRecord = lastRoundData[lastRoundData.length - 1];
      const index = this.tableData.indexOf(lastRecord);
      this.$refs.tennisTable.setCurrentRow(lastRecord);
      this.currentRow = index;
      this.currentRound = lastRound;
      this.inputPage = lastRound;
      this.$nextTick(() => {
        const tableBodyWrapper = this.$refs.tennisTable.bodyWrapper;
        tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight;
      });
    },
    handleCurrentChange(val) {
      if (val) {
        this.currentRow = this.tableData.indexOf(val);
        this.currentRound = val.round;
        this.inputPage = this.currentRound;
        this.currentSelectedRow = val;
      }
    },
    goToRound(round) {
      const firstRowIndex = this.tableData.findIndex(item => item.round === round);
      if (firstRowIndex !== -1) {
        const firstRowData = this.tableData[firstRowIndex];
        this.currentRound = round;
        this.inputPage = round;
        this.currentSelectedRow = firstRowData;
        this.$refs.tennisTable.setCurrentRow(firstRowData);
      } else {
        this.$message.warning(`第${round}回合无数据`);
      }
    },
    goToPage() {
      const page = parseInt(this.inputPage);
      if (!isNaN(page)) {
        const maxRound = Math.max(...this.tableData.map(item => item.round));
        if (page >= 1 && page <= maxRound) {
          this.goToRound(page);
        } else {
          this.$message.warning(`请输入1-${maxRound}之间的回合数`);
        }
      }
    }
    ,
    startTimer() {
      this.startTime = Date.now();
      this.stopTimer();
      this.timer = setInterval(() => {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      }, 1000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    resetTimer() {
      this.stopTimer();
      this.elapsedTime = 0;
      this.startTime = Date.now();
      this.startTimer();
    },
    playVideo(videoId) {
      this.$message.info(`播放视频: ${videoId}`);
    },
    switchView(view) {
      this.activeView = view;
      if (this.isDisable) {
        this.isDisable = !this.isDisable
        this.$router.push('/matching')
      }
      this.$message.info(`切换视图: ${view}`);
    },
    switchView3D() {
      if (!this.isDisable) {
        this.isDisable = !this.isDisable
        if (this.isDisable) {
          this.$router.push('/gameMode/3D')
        }
      }
    },
    switchView2D() {
      this.activeView = '2d'
      if (this.isDisable) {
        this.isDisable = !this.isDisable
        this.$router.push('/matching')
      }
    },
    swapCourt() {
      this.$message.info('交换场地');
    },
    showStats() {
      // this.$message.info('显示数据统计');
      this.$router.push('/result')
    },
    challenge() {
      this.$message.info('发起鹰眼挑战');
    },
    restartMatch() {
      this.$confirm('确定要重新开始比赛吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //重置时间
        this.resetTimer();
        //重置数据
        this.tableData = []
        // 将当前行列置为零
        this.currentRound = 0
        this.currentRow = -1
        this.inputPage = 1
        this.$message.success('比赛已重新开始');
      }).catch(() => {
        this.$message.info('已取消重新开始');
      });
    },
    endMatch() {
      this.$confirm('确定要结束比赛吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.resetTimer();
        // 跳转页面,根据模式选择跳转到哪一个页面,退出到选择模式界面
        this.$router.push('/login')
        this.$message.success('比赛已结束');
      }).catch(() => {
        this.$message.info('已取消结束比赛');
      });
    },
    //画线方法
    drawCourt(ctx) {
      const { courtWidth, courtHeight, offsetX, offsetY } = this;

      ctx.fillStyle = "#1E8FD5"; // 蓝色背景
      ctx.fillRect(0, 0, 500, 800); // 填充整个画布
      // 绘制背景
      ctx.fillStyle = "#377DB8";
      ctx.fillRect(offsetX, offsetY, courtWidth, courtHeight);

      // 白色边框（双打场地外框）
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(offsetX, offsetY, courtWidth, courtHeight);

      // 单打边线宽度比例
      const singlesWidth = courtWidth * (8.23 / 10.97);
      const singlesOffsetX = offsetX + (courtWidth - singlesWidth) / 2;

      // 单打边线左右
      ctx.beginPath();
      ctx.moveTo(singlesOffsetX, offsetY);
      ctx.lineTo(singlesOffsetX, offsetY + courtHeight);
      ctx.moveTo(singlesOffsetX + singlesWidth, offsetY);
      ctx.lineTo(singlesOffsetX + singlesWidth, offsetY + courtHeight);
      ctx.stroke();

      // 底线（最上和最下）
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.lineTo(offsetX + courtWidth, offsetY);
      ctx.moveTo(offsetX, offsetY + courtHeight);
      ctx.lineTo(offsetX + courtWidth, offsetY + courtHeight);
      ctx.stroke();

      // 球网位置
      const netY = offsetY + courtHeight / 2;

      // 黑色球网线
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(offsetX, netY);
      ctx.lineTo(offsetX + courtWidth, netY);
      ctx.stroke();

      // 白色网顶条带
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(offsetX, netY - 2);
      ctx.lineTo(offsetX + courtWidth, netY - 2);
      ctx.stroke();

      // 发球线距离网5.485m对应像素
      const serviceLineOffset = courtHeight * (5.485 / 23.77);
      const serviceLineTopY = netY - serviceLineOffset;
      const serviceLineBottomY = netY + serviceLineOffset;

      // 画发球线（单打范围内）
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(singlesOffsetX, serviceLineTopY);
      ctx.lineTo(singlesOffsetX + singlesWidth, serviceLineTopY);
      ctx.moveTo(singlesOffsetX, serviceLineBottomY);
      ctx.lineTo(singlesOffsetX + singlesWidth, serviceLineBottomY);
      ctx.stroke();

      // 中线
      const centerLineX = singlesOffsetX + singlesWidth / 2;
      ctx.beginPath();
      ctx.moveTo(centerLineX, serviceLineTopY);
      ctx.lineTo(centerLineX, serviceLineBottomY);
      ctx.stroke();

      // A / B 字母居中显示
      ctx.font = "32px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFFF00";
      ctx.fillText("A", offsetX + courtWidth / 2, offsetY + 40);
      ctx.fillText("B", offsetX + courtWidth / 2, offsetY + courtHeight - 10);
    },

    drawPoints(ctx, points) {
      const { courtWidth, courtHeight, offsetX, offsetY } = this;

      // 颜色定义
      const FLUORESCENT_YELLOW = "#F9FF00";
      const DARK_OUTLINE = "rgba(0,0,0,0.3)";
      const GRAY = "#AAAAAA";

      // 清空画布
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.drawCourt(ctx);

      if (!this.currentSelectedRow) return;

        const currentRound = this.currentSelectedRow.round;
        const currentRoundPoints = points.filter(p => p.round === currentRound);
      // 绘制非选中点
      currentRoundPoints.forEach(point => {
        if (this.currentSelectedRow && point.id === this.currentSelectedRow.id) return;

        const x = offsetX + (point.x / 100) * courtWidth;
        const y = offsetY + (point.y / 100) * courtHeight;

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = GRAY;
        ctx.fillStyle = point.inCourt ? GRAY : "transparent";
        ctx.lineWidth = 1;

        if (point.inCourt) {
          ctx.fill();
        }
        ctx.stroke();
      });

      // 绘制选中点
      const selectedPoint = currentRoundPoints.find(p => p.id === this.currentSelectedRow.id);
      if (selectedPoint) {
        const x = offsetX + (selectedPoint.x / 100) * courtWidth;
        const y = offsetY + (selectedPoint.y / 100) * courtHeight;

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);

        if (!selectedPoint.inCourt) {
          ctx.fillStyle = "transparent";
          ctx.strokeStyle = FLUORESCENT_YELLOW;
          ctx.lineWidth = 3;
        } else {
          ctx.fillStyle = FLUORESCENT_YELLOW;
          ctx.strokeStyle = DARK_OUTLINE;
          ctx.lineWidth = 1.5;
        }

        ctx.fill();
        ctx.stroke();
      }
    },

    modeChange() {
      //this.gameMode = this.gameMode === '比赛模式' ? '畅打模式' : '比赛模式';
      //初始化网球场
      // const canvas = this.$refs.courtCanvas;
      // const ctx = canvas.getContext("2d");

      // this.drawCourt(ctx);
      // this.drawPoints(ctx, this.tableData);
    },
    goToPrevRound() {
      if (this.currentRound > 1) {
        this.goToRound(this.currentRound - 1);
      }
    },
    goToNextRound() {
      if (this.currentRound < this.maxRound) {
        this.goToRound(this.currentRound + 1);
      }
    },
    clear() {
      this.tableData = []
      this.currentRow = -1
      this.currentRound = 0
    }

  }
}
</script>

<style scoped>
.tennis-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Arial', 'Helvetica Neue', sans-serif;
  background: linear-gradient(135deg, #0a1a2e 0%, #1a3a5a 100%);
  color: #ffffff;
}

.top-bar {
  padding: 12px 24px;
  background: rgba(10, 26, 46, 0.95);
  border-bottom: 1px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.match-mode-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.match-text {
  padding: 6px 0;
  font-size: 24px;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.7);
  position: relative;
  letter-spacing: 1px;
}

.match-text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.8) 30%, rgba(255, 215, 0, 0.8) 70%, transparent 100%);
}

.top-bar h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.current-time {
  float: right;
  font-size: 20px;
  font-family: 'Courier New', monospace;
  color: #00E5FF;
}

.middle-section {
  flex: 1;
  overflow: hidden;
  padding: 15px;
  box-sizing: border-box;
  background: rgba(10, 26, 46, 0.7);
}

.data-table-container {
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(26, 58, 90, 0.8);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.table-info-bar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, rgba(10, 26, 46, 0.9) 0%, rgba(26, 58, 90, 0.9) 100%);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  font-size: 16px;
  color: #B5EAD7;
  padding: 0 15px;
  font-weight: 500;
}

.table-pagination {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, rgba(10, 26, 46, 0.8) 0%, rgba(26, 58, 90, 0.8) 100%);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding: 0 15px;
}

.camera-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 10px;
}

.camera-controls {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background: rgba(26, 58, 90, 0.9);
  border-radius: 8px 8px 0 0;
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-bottom: none;
}

.video-preview {
  flex: 1;
  background: linear-gradient(135deg, #0a1a2e 0%, #1a3a5a 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-top: none;
  position: relative;
}

.placeholder {
  text-align: center;
  z-index: 1;
}

.placeholder p:first-child {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #FFD700;
}

.placeholder p:last-child {
  font-size: 18px;
  color: #B5EAD7;
}

.bottom-controls {
  padding: 12px 24px;
  background: rgba(10, 26, 46, 0.95);
  border-top: 1px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.action-info {
  margin-left: 20px;
  font-weight: 500;
  color: #B5EAD7;
  font-size: 16px;
}

.right-controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-button {
  background: rgba(26, 58, 90, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-size: 14px;
  padding: 10px 15px;
}

.el-button:hover {
  background: rgba(255, 215, 0, 0.3);
}

.el-button--success {
  background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
  border-color: #27AE60;
}

.el-button--danger {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%);
  border-color: #EE5253;
}

.el-button--warning {
  background: linear-gradient(135deg, #FFA502 0%, #E67E22 100%);
  border-color: #E67E22;
}

.swap-court {
  background: linear-gradient(135deg, #FFD700 0%, #FFA502 100%);
  border-color: #FFA502;
  color: #0a1a2e;
  font-weight: 600;
}

.view-buttons .el-button {
  margin-right: 8px;
  font-size: 14px;
}

.page-input {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

/* 修复表格行悬停变白问题 */
.tennis-container ::v-deep .el-table {
  background: transparent;
  color: #ffffff;
  font-size: 16px;
}

.tennis-container ::v-deep .el-table th {
  background: linear-gradient(180deg, rgba(26, 58, 90, 0.95) 0%, rgba(10, 26, 46, 0.95) 100%) !important;
  color: #FFD700;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3) !important;
}

.tennis-container ::v-deep .el-table tr {
  background: rgba(26, 58, 90, 0.6) !important;
}

.tennis-container ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #377DB8 !important;
}

.tennis-container ::v-deep .el-table td {
  border-bottom: 1px solid rgba(255, 215, 0, 0.2) !important;
  padding: 12px 0;
}

.tennis-container ::v-deep .el-table__body tr.current-row>td {
  background-color: #1E8FD5 !important;
}

.tennis-container ::v-deep .el-table--border th,
.tennis-container ::v-deep .el-table--border td {
  border-right: 1px solid rgba(255, 215, 0, 0.2);
}

.tennis-container ::v-deep .el-table__empty-text {
  color: #B5EAD7;
}

.tennis-container ::v-deep .el-input__inner {
  background: rgba(26, 58, 90, 0.9) !important;
  border: 1px solid rgba(255, 215, 0, 0.4) !important;
  color: #ffffff !important;
  height: 36px;
  line-height: 36px;
}

/* 滚动条样式 */
.tennis-container ::v-deep ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.tennis-container ::v-deep ::-webkit-scrollbar-track {
  background: rgba(10, 26, 46, 0.5);
}

.tennis-container ::v-deep ::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.6);
  border-radius: 4px;
}
</style>