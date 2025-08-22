<template>
  <div id="ui-container">
    <h1>网球轨迹可视化系统</h1>

    <!-- 居中动画控制按钮 -->
    <div class="control-group centered">
      <div>
        <button @click="togglePause" class="centered-button">
          {{ isPaused ? '继续动画' : '暂停动画' }}
        </button>
      </div>
    </div>

    <!-- 回合选择按钮 -->
    <div class="control-group">
      <h2>回合选择</h2>
      <div class="btn-group">
        <button v-for="round in rounds" :key="round.id" :class="{ active: activeRound === round.id }"
          @click="selectRound(round.id)">
          {{ round.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPaused: false,
      activeRound: 1,
      rounds: [
        { id: 1, label: "回合1" },
        { id: 2, label: "回合2" },
        { id: 3, label: "回合3" }
      ]
    }
  },

  mounted() {
    // 从localStorage加载保存的回合
    this.loadSavedRound();
  },

  methods: {
    // 从localStorage加载保存的回合
    loadSavedRound() {
      const savedRound = localStorage.getItem("roundId");

      // 如果localStorage中有保存的回合，使用它
      if (savedRound !== null && savedRound !== undefined) {
        const roundId = parseInt(savedRound);

        // 确保回合ID有效
        if (this.rounds.some(round => round.id === roundId)) {
          this.activeRound = roundId;
        } else {
          console.warn("无效的回合ID:", savedRound);
        }
      }

    },

    togglePause() {
      this.isPaused = !this.isPaused;
      this.$bus.$emit("animation", !this.isPaused);
    },

    selectRound(roundId) {
      this.activeRound = roundId;
      if (roundId === 3) {
        localStorage.setItem("realOut", true)
      } else {
        localStorage.setItem("realOut", false)
      }
      // 保存到localStorage
      localStorage.setItem("roundId", roundId);

      window.location.reload()

    }
  }
}
</script>

<style scoped>
#ui-container {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 20, 40, 0.85);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 25px rgba(0, 150, 255, 0.4);
  z-index: 10;
  max-width: 320px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(100, 200, 255, 0.2);
  font-family: 'Arial', sans-serif;
}

h1 {
  margin-bottom: 15px;
  font-size: 1.8rem;
  text-align: center;
  color: #4fc3f7;
  text-shadow: 0 0 10px rgba(79, 195, 247, 0.7);
}

.control-group {
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background: rgba(0, 30, 60, 0.6);
}

.control-group.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  padding: 15px;
  max-width: 300px;
}

h2 {
  margin-bottom: 12px;
  font-size: 1.3rem;
  color: #81d4fa;
  text-align: center;
}

.btn-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.centered-button {
  background: linear-gradient(to bottom, #2196F3, #0d47a1);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  font-size: 1.1rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered-button:hover {
  background: linear-gradient(to bottom, #42a5f5, #1e88e5);
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.4);
}

.centered-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

button {
  background: linear-gradient(to bottom, #2196F3, #0d47a1);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  min-width: 80px;
  z-index: 20;
  font-size: 0.9rem;
  text-align: center;
}

button:hover {
  background: linear-gradient(to bottom, #42a5f5, #1e88e5);
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.3);
}

button.active {
  background: linear-gradient(to bottom, #4caf50, #2e7d32);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

/* 响应式调整 */
@media (max-width: 768px) {
  #ui-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .control-group.centered {
    max-width: 100%;
  }

  .centered-button {
    padding: 10px 20px;
    font-size: 1rem;
    width: 100%;
  }
}
</style>