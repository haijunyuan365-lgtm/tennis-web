<template>
  <div class="rule-dialog-mask" v-show="visible" @click.self="handleClose">
    <div class="rule-dialog">
      <div class="dialog-title">赛制设置</div>

      <!-- 标签切换区域 -->
      <div class="tab-nav">
        <div class="tab-item" :class="{ active: activeTab === 'regular' }" @click="activeTab = 'regular'">
          常规赛制
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'custom' }" @click="activeTab = 'custom'">
          自定义
        </div>
      </div>

      <div class="dialog-content">
        <!-- 常规赛制内容 -->
        <div v-show="activeTab === 'regular'" class="tab-content">
          <div class="default">
            <div v-for="(option, index) in defaultData" :key="index" class="default-1"
              :class="{ selected: form.gameNumber === defaultForm[index].gameNumber }" @click="selectDefault(option)">
              {{ option }}
            </div>
          </div>
        </div>

        <!-- 自定义内容 -->
        <div v-show="activeTab === 'custom'" class="tab-content">
          <div class="select">
            <div class="select-left">
              <div v-for="(item, index) in textOptions" :key="index" class="select-left-text">
                {{ item }}
              </div>
            </div>
            <div class="select-right">
              <div v-for="(option, index) in Options" :key="index" class="select-right-option">
                <div v-for="(item, itemIndex) in option" :key="itemIndex" class="select-right-option-item"
                  :class="{ selected: form[optionsTitle[index]] === item }"
                  @click="selectOption(optionsTitle[index], item)">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-position">
          <button class="confirm-btn" @click="handleConfirm">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchRuleDialog',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeTab: 'regular', // 'regular'或'custom'
      form: {
        gameNumber: null,
        tiebreak: '',
        games: '',
        winGame: '',
        sideChange: ''
      },
      defaultData: [
        '1盘 - 6局 - 抢7 - 不占先 - 自动换边',
        '3盘 - 6局 - 抢7 - 不占先 - 自动换边'
      ],
      defaultForm: [
        {
          gameNumber: 1,
          tiebreak: '抢7',
          games: '6局',
          winGame: 'No-Ad',
          sideChange: '自动'
        },
        {
          gameNumber: 3,
          tiebreak: '抢7',
          games: '6局',
          winGame: 'No-Ad',
          sideChange: '自动'
        }
      ],
      textOptions: ['决胜盘', '局 数', '获胜局', '换 边'],
      tiebreakOptions: ['抢5', '抢7', '抢10'],
      gamesOptions: ['3局', '4局', '6局'],
      winGameOptions: ['AD', 'No-Ad'],
      sideChangeOptions: ['自动', '手动'],
      Options: [
        ['抢5', '抢7', '抢10'],
        ['3局', '4局', '6局'],
        ['AD', 'No-Ad'],
        ['自动', '手动']
      ],
      optionsTitle: [
        'tiebreak',
        'games',
        'winGame',
        'sideChange'
      ]
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    selectDefault(option) {
      const index = this.defaultData.findIndex((item) => item == option)
      this.form = this.defaultForm[index]
      // console.log(this.form);

    },
    selectOption(field, value) {
      this.form[field] = value;
      // console.log(this.form);

    },

    handleClose() {
      this.visible = false;
    },

    handleConfirm() {
      this.$emit('confirm', {
        ...this.form,
        isCustom: this.activeTab === 'custom'
      });
      this.visible = false;
    }
  }
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
  background-color: #222;
  /* 深色背景 */
  border-radius: 12px;
  padding: 25px 15px 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8);
}

/* 标题样式 */
.dialog-title {
  font-size: 22px;
  font-weight: bold;
  color: #FFD700;
  /* 金色 */
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
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #FFD700;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #FFD700;
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

.select {
  display: flex;
  width: 100%;
  height: 200px;
  align-content: center;
  justify-content: space-around;
}

.select-left {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

}

.select-left-text {
  color: #FFD700;
  font-size: 20px;
}

.select-right {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
}

.select-right-option {
  display: flex;
  align-content: center;
  justify-content: space-between;
  gap: 50px;
}

.select-right-option-item {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #FFD700;
  border: 1px solid #FFD700;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 选项组样式 */
.option-group {
  margin-bottom: 25px;
}

.default {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.default-1 {
  font-size: 20px;
  color: #FFD700;
  border: 1px solid #FFD700;
  width: 350px;
  height: 33px;
  line-height: 33px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-title {
  color: #FFF;
  margin-bottom: 10px;
  font-size: 16px;
  text-align: left;
  padding-left: 8px;
}

.option-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
}

/* 选项项样式 */
.option-item {
  padding: 12px 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFF;
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
}

.selected {
  background-color: #FFD700;
  color: #222;
  font-weight: bold;
}

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
  background-color: #FFD700;
  color: #222;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn:hover {
  background-color: #ffec8e;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.4);
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

  .option-container {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 6px;
  }

  .option-item {
    padding: 10px 5px;
    font-size: 13px;
    height: 36px;
  }
}
</style>