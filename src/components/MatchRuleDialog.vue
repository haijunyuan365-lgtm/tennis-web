<template>
  <!-- 蒙层 -->
  <!-- 点击蒙层自身时关闭弹窗 （.self修饰符确保只有点击蒙层才触发）-->
  <div class="rule-dialog-mask" v-show="visible" @click.self="handleClose">
    <!-- 弹窗主体 -->
    <div class="rule-dialog">
      <!-- 标题 -->
      <div class="dialog-title">赛制设置</div>

      <!-- 标签切换区域 -->
      <!-- :class="{ active: activeTab === 'regular' }"动态设置标签页激活状态，当activeTab匹配时添加active类 -->
      <div class="tab-nav">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'regular' }"
          @click="activeTab = 'regular'"
        >
          常规赛制
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'custom' }"
          @click="activeTab = 'custom'"
        >
          自定义
        </div>
      </div>
      <!-- 内容区域 -->
      <div class="dialog-content">
        <!-- 常规赛制内容 -->
        <div v-show="activeTab === 'regular'" class="tab-content">
          <!-- 预设选项 -->
          <div class="default">
            <div
              v-for="(option, index) in defaultData"
              :key="index"
              class="default-1"
              :class="{
                selected: form.gameNumber === defaultForm[index].gameNumber,
              }"
              @click="selectDefault(option)"
            >
              {{ option }}
            </div>
          </div>
        </div>

        <!-- 自定义内容 -->
        <div v-show="activeTab === 'custom'" class="tab-content">
          <!-- 自定义选项 -->
          <div class="select">
            <!-- 左侧标签 -->
            <div class="select-left">
              <div
                v-for="(item, index) in textOptions"
                :key="index"
                class="select-left-text"
              >
                {{ item }}
              </div>
            </div>
            <!-- 右侧可选项 -->
            <div class="select-right">
              <div
                v-for="(option, index) in Options"
                :key="index"
                class="select-right-option"
              >
                <div
                  v-for="(item, itemIndex) in option"
                  :key="itemIndex"
                  class="select-right-option-item"
                  :class="{ selected: form[optionsTitle[index]] === item }"
                  @click="selectOption(optionsTitle[index], item)"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 确认按钮 -->
        <div class="btn-position">
          <el-button
            class="confirm-btn"
            :disabled="!canConfirm"
            @click="handleConfirm"
            >确认</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MatchRuleDialog",
  props: {
    // 控制弹窗的显示/隐藏状态
    value: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeTab: "regular", // 当前激活的标签页'regular'或'custom'
      // 表单数据对象
      form: {
        gameNumber: "1盘", //盘数
        games: "6局", //局数
        tiebreak: "抢7", //决胜局
        winGame: "No-Ad", //获胜规则
        sideChange: "自动", //换边规则
      },
      // 预设常规赛制选项文本
      defaultData: [
        "1盘 - 6局 - 抢7 - 不占先 - 自动换边",
        "3盘 - 6局 - 抢7 - 不占先 - 自动换边",
      ],
      // 预设常规赛制选项数组
      defaultForm: [
        {
          gameNumber: "1盘",
          games: "6局",
          tiebreak: "抢7",
          winGame: "No-Ad",
          sideChange: "自动",
        },
        {
          gameNumber: "3盘",
          games: "6局",
          tiebreak: "抢7",
          winGame: "No-Ad",
          sideChange: "自动",
        },
      ],
      // 自定义选项左侧标签
      textOptions: ["盘数", "局 数", "决胜局", "获胜局", "换 边"],
      /* gameNumberOption: ["1盘", "3盘", "5盘"],
      tiebreakOptions: ["抢5", "抢7", "抢10"],
      gamesOptions: ["3局", "4局", "6局"],
      winGameOptions: ["AD", "No-Ad"],
      sideChangeOptions: ["自动", "手动"], */
      // 自定义选项右侧可选项
      Options: [
        ["1盘", "3盘", "5盘"],
        ["3局", "4局", "6局"],
        ["抢5", "抢7", "抢10"],
        ["AD", "No-Ad"],
        ["自动", "手动"],
      ],
      // 自定义选项对应的表单字段名
      optionsTitle: [
        "gameNumber",
        "games",
        "tiebreak",
        "winGame",
        "sideChange",
      ],
    };
  },
  computed: {
    // 弹窗显示状态
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    // 确认按钮是否禁用
    canConfirm() {
      if (this.activeTab === "regular") {
        return !!this.form.gameNumber; //!!将值转换为布尔类型
      } else {
        return this.optionsTitle.every((item) => {
          return !!this.form[item];
        }); //every测试数组所有字段是否已选，返回布尔值
      }
    },
  },
  methods: {
    // 选择预设的常规赛制
    selectDefault(option) {
      const index = this.defaultData.findIndex((item) => item == option);
      this.form = { ...this.defaultForm[index] }; //对象展开运算符：将defaultForm指定索引处对象的所有可枚举属性展开到新对象中
      // console.log(this.form);
    },
    // 选择自定义选项
    selectOption(field, value) {
      this.form[field] = value;
      // console.log(this.form);
      // 如果切换到自定义标签，确保所有字段都有值
      if (this.activeTab === "custom") {
        this.optionsTitle.forEach((item) => {
          if (!this.form[item]) {
            this.form[item] = this.Options[this.optionsTitle.indexOf(item)][0]; //第一个选项为默认值
          }
        });
      }
    },
    // 关闭弹窗
    handleClose() {
      this.visible = false;
    },
    // 确认赛制选择
    handleConfirm() {
      // 验证是否选择赛制
      if (!this.validateForm()) {
        return;
      }
      // 触发confirm自定义事件,传递表单数据和是否自定义标志
      this.$emit("confirm", {
        ...this.form, //展开所有表单数据
        isCustom: this.activeTab === "custom", //添加是否自定义标志
      });
      this.visible = false;
    },
    // 验证表单数据
    validateForm() {
      if (this.activeTab === "regular") {
        // 验证常规赛制
        if (!this.form.gameNumber) {
          this.$message.warning("请选择常规赛制");
          return false;
        }
      } else {
        // 验证自定义赛制：所有字段必须选择
        const missingItems = this.optionsTitle.filter(
          (item) => !this.form[item]
        ); //过滤出未选择字段的新数组
        // console.log('未选择的有：',missingItems);
        if (missingItems.length > 0) {
          const optionName = {
            gameNumber: "盘数",
            games: "局数",
            tiebreak: "决胜局",
            winGame: "获胜局",
            sideChange: "换边",
          };
          const missingName = missingItems
            .map((item) => optionName[item])
            .join("、");
          this.$message.warning(`请选择：${missingName}`);
          return false;
        }
      }
      return true;
    },
    // 重置表单数据
    resetForm() {
      this.form = {
        gameNumber: "1盘",
        games: "6局",
        tiebreak: "抢7",
        winGame: "No-Ad",
        sideChange: "自动",
      };
    },
  },
  watch: {
    // 监听弹窗显示状态，打开时重置表单数据
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
  },
};
</script>

<style scoped>
/* 蒙层样式 */
.rule-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 弹窗主体 */
.rule-dialog {
  width: 85%;
  max-width: 700px;
  background-color: #ffffff;
  /* 白色背景 */
  border-radius: 12px;
  padding: 25px 15px 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

/* 标题样式 */
.dialog-title {
  font-size: 22px;
  font-weight: bold;
  color: #3b82f6;
  /* 浅蓝色 */
  text-align: left;
  margin-bottom: 20px;
  margin-left: 20px;
}

/* 标签导航 */
.tab-nav {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 25px;
  margin-left: 40px;
  /* border-bottom: 1px solid rgba(255, 215, 0, 0.3); */
  gap: 30px;
}

.tab-item {
  padding: 10px 25px;
  margin: 0 10px;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #3b82f6;
  font-weight: bold;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #3b82f6;
  border-radius: 2px;
}

/* 内容容器 */
.dialog-content {
  position: relative;
  padding: 0 10px;
}

.tab-content {
  margin-bottom: 10px;
}
/* 自定义选项 */
.select {
  display: flex;
  width: 100%;
  height: 200px;
  align-content: center;
  justify-content: space-around;
}
/* 自定义左侧标签 */
.select-left {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
/* 自定义左侧标签文字 */
.select-left-text {
  color: #3b82f6;
  font-size: 20px;
}
/* 自定义右侧可选项 */
.select-right {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
}
/* 右侧可选项容器 */
.select-right-option {
  display: flex;
  align-content: center;
  justify-content: space-between;
  gap: 50px;
}
/* 每一个可选项 */
.select-right-option-item {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 选项组样式 */
/* .option-group {
  margin-bottom: 25px;
} */
/* 预设常规赛制容器 */
.default {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
/* 预设常规赛制 */
.default-1 {
  font-size: 20px;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  width: 350px;
  height: 33px;
  line-height: 33px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* .option-title {
  color: #fff;
  margin-bottom: 10px;
  font-size: 16px;
  text-align: left;
  padding-left: 8px;
}

.option-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
} */

/* 选项项样式 */
/* .option-item {
  padding: 12px 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 14px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-item:hover {
  background-color: rgba(255, 215, 0, 0.2);
} */
/* 选中样式 */
.selected {
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: bold;
}
/* 确认按钮容器 */
.btn-position {
  display: flex;
  justify-content: flex-end;
}

/* 确认按钮样式 */
.confirm-btn {
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 30px 0 5px;
  padding: 12px 20px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .rule-dialog {
    width: 90%;
    padding: 20px 10px 10px;
  }

  .dialog-title {
    font-size: 20px;
  }

  .tab-item {
    padding: 8px 15px;
    font-size: 15px;
  }

  /* .option-container {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 6px;
  } */

  /* .option-item {
    padding: 10px 5px;
    font-size: 13px;
    height: 36px;
  } */
}
</style>
