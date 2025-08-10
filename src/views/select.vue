<template>
  <div id="app">
    <div class="system-container">
      <!-- 主内容区 -->
      <div class="content-container">
        <!-- 左侧网球场区域 -->
        <div class="court-panel">
          <div class="court-container">
            <div class="court-background-container">
              <!-- 背景图容器 -->
              <img
                class="court-background"
                src="../assets/image/test1.jpg"
                alt="场地背景"
              />
              <!-- 添加标题文字 -->
              <div class="court-title">网球场地示意图</div>
              <!-- 场地布局 -->
              <div class="court-layout">
                <img class="tenniscourt" src="../assets/image/tenniscourt.jpg" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧球员区域 -->
        <div class="players-panel">
          <!-- 右侧顶部标题 -->
          <div class="players-header">
            <h2 class="artistic-title">智能网球系统</h2>
          </div>
          <!-- 单双打、赛制设置 -->
          <div class="settings-panel">
            <!-- 模式选择单选框 -->
            <div class="mode-selector">
              <el-radio-group v-model="gameMode" @change="setGameMode">
                <el-radio-button label="single">单打模式</el-radio-button>
                <el-radio-button label="double">双打模式</el-radio-button>
              </el-radio-group>
            </div>
            <!-- 赛制设置按钮 -->
            <div class="rule-dialog">
              <el-button
                icon="el-icon-setting"
                @click="ruleDialogVisible = true"
                >赛制设置</el-button
              >
              <!-- 赛制设置弹窗 -->
              <!-- 子向父传值：定义自定义事件confirm -->
              <MatchRuleDialog
                v-model="ruleDialogVisible"
                @confirm="handleRuleConfirm"
              />
            </div>
          </div>
          <!-- 球员表格和确认按钮 -->
          <div class="select-container">
            <!-- 球员列表 -->
            <div class="players-table">
              <el-table
                :data="players"
                style="width: 100%"
                class="players-container"
                :row-class-name="tableRowClassName"
                :show-header="false"
              >
                <!-- 序号列 -->
                <el-table-column width="80" label="序号" prop="index">
                  <!-- 作用域插槽 -->
                  <template slot-scope="{ $index }">
                    <div class="player-number">{{ $index + 1 }}</div>
                  </template>
                </el-table-column>
                <!-- 球员信息列 -->
                <el-table-column label="球员信息">
                  <template slot-scope="{ row }">
                    <div class="player-info">
                      <div class="player-name">{{ row.name }}</div>
                      <div class="player-time">
                        加入时间: {{ row.joinTime }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 区域选择列 -->
                <el-table-column width="250" align="right" label="操作">
                  <template slot-scope="{ row }">
                    <el-radio-group :value="row.selected" size="medium">
                      <el-radio-button
                        label="A"
                        border
                        @click.native.prevent="toggleRegion(row, 'A', $event)"
                        >区域A</el-radio-button
                      >
                      <el-radio-button
                        label="B"
                        border
                        @click.native.prevent="toggleRegion(row, 'B', $event)"
                        >区域B</el-radio-button
                      >
                    </el-radio-group>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 确认按钮 -->
            <div class="confirm-btn">
              <el-button
                type="primary"
                :disabled="!isOpen"
                @click="handleConfirm"
              >
                开始
              </el-button>
            </div>
          </div>
          <!-- 返回、历史记录按钮 -->
          <div class="action-footer">
            <el-button
              type="info"
              icon="el-icon-notebook-2"
              @click="showHistory"
              >历史记录</el-button
            >
            <el-button type="warning" icon="el-icon-back" @click="goBack"
              >返回</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MatchRuleDialog from "../components/MatchRuleDialog";
export default {
  name: "Select",
  components: { MatchRuleDialog },
  data() {
    return {
      gameMode: "single", //单双打模式
      ruleDialogVisible: false, // 赛制设置弹窗显示状态
      matchRules: null, // 存储赛制设置(对象类型)
      players: [
        {
          name: "学生18168686868",
          joinTime: "2025-06-20 10:25",
          selected: null,
        },
        {
          name: "学生18168886688",
          joinTime: "2025-06-21 11:15",
          selected: null,
        },
        {
          name: "学生18169999999",
          joinTime: "2025-06-22 14:30",
          selected: null,
        },
        {
          name: "学生18161234567",
          joinTime: "2025-06-23 09:45",
          selected: null,
        },
        {
          name: "学生18161234567",
          joinTime: "2025-06-23 09:45",
          selected: null,
        },
        {
          name: "学生18161234567",
          joinTime: "2025-06-23 09:45",
          selected: null,
        },
        {
          name: "学生18161234567",
          joinTime: "2025-06-23 09:45",
          selected: null,
        },
        {
          name: "学生18161234567",
          joinTime: "2025-06-23 09:45",
          selected: null,
        },
        {
          name: "学生18161234567",
          joinTime: "2025-06-23 09:45",
          selected: null,
        },
      ],
    };
  },
  computed: {
    // 确认按钮是否禁用
    isOpen() {
      if (!this.gameMode || this.selectedPlayers().length < 1) {
        // 未选择模式或选了模式但未选区域
        return false;
      } else {
        return true;
      }
    },
    // 是否可以确认
    canConfirm() {
      // 未选择模式
      if (!this.gameMode) {
        return false;
      }
      const selectedPlayers = this.selectedPlayers();
      const playersInRegionA = this.playersInRegionA();
      const playersInRegionB = this.playersInRegionB();
      if (this.gameMode === "single") {
        //单打2人，A区域1人，B区域1人
        return (
          selectedPlayers.length === 2 &&
          playersInRegionA.length === 1 &&
          playersInRegionB.length === 1
        );
      } else {
        //双打4人，A区域2人，B区域2人
        return (
          selectedPlayers.length === 4 &&
          playersInRegionA.length === 2 &&
          playersInRegionB.length === 2
        );
      }
    },
  },
  mounted() {
    // 初始化单双打模式并自动分配区域（人数足够时）
    this.setGameMode("single");
  },
  methods: {
    // 已选择区域的球员数组
    selectedPlayers() {
      return this.players.filter((p) => p.selected !== null);
    },
    // 选择A区域的球员数组
    playersInRegionA() {
      return this.players.filter((p) => p.selected === "A");
    },
    // 选择B区域的球员数组
    playersInRegionB() {
      return this.players.filter((p) => p.selected === "B");
    },
    setGameMode(mode) {
      this.gameMode = mode;

      // 切换模式时清除之前的选择
      this.players.forEach((p) => (p.selected = null));

      if (mode === "single") {
        if (this.players.length < 2) {
          this.$message.warning("人数不足，单打模式需要至少2名球员！");
          return;
        } else {
          // 单打模式：默认第一个选A边，第二个选B边
          this.players[0].selected = "A";
          this.players[1].selected = "B";
          this.$message.success(
            "已切换到单打模式,最多可选择2名球员(A区和B区各1人)"
          );
        }
      } else {
        if (this.players.length < 4) {
          this.$message.warning("人数不足，双打模式需要至少4名球员！");
          return;
        } else {
          // 双打模式：前两个选A边，后两个选B边
          this.players[0].selected = "A";
          this.players[1].selected = "A";
          this.players[2].selected = "B";
          this.players[3].selected = "B";
          this.$message.success(
            "已切换到双打模式,最多可选择4名球员(A区和B区各2人)"
          );
        }
      }
    },
    // 选择/取消区域
    toggleRegion(row, region, event) {
      // 阻止默认行为（避免与单选框自身逻辑冲突）
      event.preventDefault();

      // 如果点击区域当前已选择，则取消选择
      if (row.selected === region) {
        row.selected = null;
        return;
      }

      // 验证选择条件
      if (!this.validateRegionSelection(row, region)) {
        return;
      }

      // 选择该区域
      row.selected = region;
    },

    // 验证区域选择是否满足条件
    validateRegionSelection(row, region) {
      // 验证是否选择模式
      if (!this.gameMode) {
        this.$message.warning("请先选择单打或双打模式！");
        return false;
      }
      const selectedPlayers = this.selectedPlayers();
      if (this.gameMode === "single") {
        // 单打验证
        if (selectedPlayers.length >= 2) {
          this.$message.warning("单打模式最多只能选择2名球员(A区和B区各1名)");
          return false;
        }
        // 获取选择相同区域的球员(find只查找首个符合条件的球员对象)
        const existingPlayerInRegion = this.players.find(
          (p) => p.selected === region
        );
        if (existingPlayerInRegion) {
          this.$message.warning(
            `${region}区域已被选择,单打模式每个区域只能有1名球员`
          );
          return false;
        }
      } else {
        // 双打验证
        if (selectedPlayers.length >= 4) {
          this.$message.warning("双打模式最多只能选择4名球员(A区和B区各2名)");
          return false;
        }
        // 获取选择相同区域的球员数组
        const existingPlayerInRegion = this.players.filter(
          (p) => p.selected === region
        );
        if (existingPlayerInRegion.length >= 2) {
          this.$message.warning(
            `${region}区域已选满,双打模式每个区域只能有2名球员`
          );
          return false;
        }
      }
      return true;
    },

    // 处理确认按钮点击
    handleConfirm() {
      const selectedPlayers = this.selectedPlayers();
      const playersInRegionA = this.playersInRegionA();
      const playersInRegionB = this.playersInRegionB();
      if (this.canConfirm) {
        if (this.gameMode === "single") {
          this.$message.success(
            `单打模式确认成功!A区:${playersInRegionA[0].name}, B区:${playersInRegionB[0].name}`
          );
        } else {
          this.$message.success(
            `双打模式确认成功!A区:${playersInRegionA
              .map((p) => p.name)
              .join()}, B区:${playersInRegionB.map((p) => p.name).join()}`
          );
        }
      } else {
        if (this.gameMode === "single") {
          if (selectedPlayers.length < 2) {
            this.$message.error(
              `还需${2 - selectedPlayers.length}人:A区还需${
                1 - playersInRegionA.length
              }人, B区还需${1 - playersInRegionB.length}人`
            );
          }
        } else {
          if (selectedPlayers.length < 4) {
            this.$message.error(
              `还需${4 - selectedPlayers.length}人:A区还需${
                2 - playersInRegionA.length
              }人, B区还需${2 - playersInRegionB.length}人`
            );
          }
        }
      }
      // 当未选择赛制且表单有效时，显示赛制对话框
      if (!this.matchRules && this.canConfirm) {
        this.ruleDialogVisible = true;
      }
    },

    showHistory() {
      this.$message.info("显示历史记录");
    },
    goBack() {
      this.$message.info("返回上一级");
    },
    // 添加行样式方法
    tableRowClassName({ row }) {
      return row.selected !== null ? "selected" : "";
    },

    // 处理赛制设置确认
    handleRuleConfirm(rules) {
      this.matchRules = rules;
      console.log("赛制设置:", rules); //form+isCustom

      // 根据赛制设置显示不同的提示信息
      if (rules.isCustom) {
        //isCustom为true：自定义赛制
        this.$message.success(
          `自定义赛制设置成功！盘数：${rules.gameNumber}, 决胜局: ${rules.tiebreak}, 局数: ${rules.games}, 获胜局: ${rules.winGame}, 换边: ${rules.sideChange}`
        );
      } else {
        this.$message.success(
          `常规赛制设置成功！${rules.gameNumber} - ${rules.games} - ${rules.tiebreak} - ${rules.winGame} - ${rules.sideChange}换边`
        );
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.system-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: white;
  border-radius: 0;
  overflow: hidden;
}

/* 主内容区 */
.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧球场区域 */
/* 添加背景图容器样式 */
.court-background-container {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1; /* 填充父容器剩余空间 */
  display: flex; /* 启用 Flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  min-height: 200px; /* 最小高度 */
}

/* 背景图样式 */
.court-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  border-radius: 8px;
  /* 添加模糊效果 */
  filter: blur(3px);
  -webkit-filter: blur(3px);
}

/* 添加标题文字样式 */
.court-title {
  position: absolute;
  top: 150px; /* 调整标题位置 */
  left: 0;
  right: 0;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  z-index: 5; /* 确保在背景之上 */
}
/* 场地布局样式 */
.court-layout {
  position: relative;
  z-index: 2;
}

.tenniscourt {
  height: 200px;
  width: 450px; /* 设置宽度，留出空间 */
  /* 新增悬浮效果 */
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* 平滑过渡 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 基础阴影 */
  border: 2px solid rgba(255, 255, 255, 0.8); /* 白色边框增强悬浮感 */
}
/* 悬浮状态效果 */
.tenniscourt:hover {
  box-shadow: 0 12px 20px rgba(37, 99, 235, 0.2),
    /* 蓝色光晕 */ 0 6px 6px rgba(0, 0, 0, 0.1); /* 加深阴影 */
  filter: brightness(1.05) saturate(1.2); /* 提亮+增强饱和度 */
  border-color: rgba(255, 255, 255, 1); /* 边框高亮 */
  cursor: pointer; /* 手势提示可交互 */
}

.court-panel {
  flex: 0 0 50%;
  display: flex;
  background: linear-gradient(to bottom, #f9fbfd, #f0f6ff);
  min-width: 0;
}

.court-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  background: white;
  padding: 15px;
  flex: 1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 右侧球员区域 */
.players-panel {
  position: relative; /* 关键：为绝对定位提供参照 */
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  /* padding: 20px; */
  background: white;
  min-width: 0;
  height: 100%; /* 确保高度占满 */
}
/* 右侧顶部区域 */
.players-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-shrink: 0;
  height: 70px;
}
/* 右侧顶部标题 */
.artistic-title {
  font-family: "Lobster", cursive; /* 艺术字体 */
  font-size: 36px; /* 增大字号 */
  text-align: center; /* 确保居中 */
  background: linear-gradient(to right, #2563eb, #1e40af); /* 渐变效果 */
  -webkit-background-clip: text; /* 文本渐变 */
  background-clip: text;
  color: transparent; /* 隐藏原色 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  letter-spacing: 1px; /* 字符间距 */
  position: absolute; /* 绝对定位 */
  left: 0;
  right: 0;
  top: 20px; /* 垂直位置调整 */
  z-index: 10; /* 确保在顶部 */
}

/* 在全局样式中添加Google Fonts引用 */
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");

/* 单双打、赛制设置样式 */
.settings-panel {
  display: flex;
  justify-content: space-between;
}
/* 模式选择单选框 */
.mode-selector {
  margin-left: 5px;
  margin-bottom: 10px;
}
/*赛制设置按钮样式*/
.rule-dialog {
  margin-right: 10px;
}

/* .rule-dialog .el-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.rule-dialog .el-button:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
} */
/* 选择状态显示 */
.selection-status {
  margin-top: 10px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 8px;
  /* border-left: 4px solid #2563eb; */
}

.status-text {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

/* 球员列表和确认按钮 */
.select-container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 80px); /* 预留顶部标题和选择器空间 */
  position: relative;
}
/* 球员列表样式 - 使用背景色替代边框 */
.players-table {
  height: 400px; /* 减去按钮区域高度 */
  /* overflow-y: auto; */
  border-radius: 12px;
  background: #f8fafc;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  /* border: 1px solid red; */
}

.players-container {
  height: 100%;
  overflow-y: auto;
  border-radius: 12px;
  /* overflow: hidden; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 关键修改：使用背景色替代边框 */
.players-container /deep/ .el-table__row {
  transition: all 0.3s ease;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
  border-radius: 8px;
}

.players-container /deep/ .el-table__row.selected {
  background: linear-gradient(
    120deg,
    rgba(37, 99, 235, 0.12),
    rgba(37, 99, 235, 0.08)
  );
  z-index: 2;
  margin-bottom: 10px;
  margin-top: 2px;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.15);
}

.players-container
  ::v-deep
  .el-table__row.selected
  + .el-table__row:not(.selected) {
  margin-top: 4px;
}

/* 移除边框样式 */
.players-container /deep/ .el-table__row.selected td {
  border: none !important;
  background: transparent !important;
}

.players-container ::v-deep .el-table td {
  border-bottom: none !important;
}

/* 球员列表 */
/* 球员序号 */
.player-number {
  background: #2563eb;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}
/* 球员信息 */
.player-info {
  min-width: 0;
}
/* 球员名 */
.player-name {
  font-size: 15px;
  color: #1e293b;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 加入时间 */
.player-time {
  font-size: 13px;
  color: #64748b;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 确认按钮 */
.confirm-btn {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  margin-top: 15px;
  padding: 10px 0;
}

/* 右下角按钮 */
.action-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 90; /* 低于模式按钮 */
  display: flex;
  gap: 15px;
}

.el-button {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  /* border-radius: 20px; */
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}
/* 历史记录按钮 */
.el-button--info {
  background: linear-gradient(to right, #3498db, #2980b9);
  border-color: #2980b9;
  color: white;
}
/* 返回按钮 */
.el-button--warning {
  background: linear-gradient(to right, #e67e22, #d35400);
  border-color: #d35400;
  color: white;
}

.el-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.el-button:active {
  transform: translateY(1px);
}

.el-button i {
  margin-right: 6px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .content-container {
    flex-direction: column;
  }

  .court-panel,
  .court-layout {
    max-height: 35vh;
  }

  .tenniscourt {
    width: 90vw; /* 小屏幕宽度自适应 */
    height: auto; /* 高度按比例调整 */
  }

  .tenniscourt:hover {
    box-shadow: 0 8px 15px rgba(37, 99, 235, 0.2); /* 移动端减弱阴影 */
  }

  .court-title {
    font-size: 20px;
    top: 10px;
  }
}
</style>
