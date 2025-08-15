<template>
  <div class="stats-bg">
    <el-row type="flex" justify="center" class="stats-main-card">
      <el-col :span="3" class="side-col left">
        <div v-for="player in leftPlayers" :key="player.name" class="avatar-container">
          <el-image class="avatar" :src="player.avatar" fit="cover"></el-image>
          <div class="player-name">{{ player.name }}</div>
        </div>
      </el-col>
      <el-col :span="18" class="stats-table">
        <el-card shadow="never" class="stats-card">
          <div slot="header" class="stats-title">
            <span>技术统计</span>
          </div>
          <div class="stats-content">
            <template v-for="(item, idx) in stats">
              <el-row :key="item.label" class="stats-row">
                <el-col :span="8" class="stat-value left">{{ item.left }}</el-col>
                <el-col :span="8" class="stat-label">{{ item.label }}</el-col>
                <el-col :span="8" class="stat-value right">{{ item.right }}</el-col>
              </el-row>
              <div v-if="idx !== stats.length - 1" class="fade-divider" :key="'divider-' + idx"></div>
            </template>
            <el-row>
              <el-col :span="24" class="exit-button-container">
                <el-button type="primary" @click="toTennis3D">落点统计</el-button>
                <el-button type="primary" @click="exit">退出</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3" class="side-col right">
        <div v-for="player in rightPlayers" :key="player.name" class="avatar-container">
          <el-image class="avatar" :src="player.avatar" fit="cover"></el-image>
          <div class="player-name">{{ player.name }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'ResultPage',
  data() {
    return {
      leftPlayers: [
        this.createPlayer('张真实', '张微信', 'player1', '1c.jpg', null, '1.jpg'),
        this.createPlayer(null, '李微信', 'player2', null, '1d.jpg', '1.jpg')
      ],
      rightPlayers: [
        this.createPlayer(null, null, 'player3', '2d.jpg', null, '1.jpg'),
        this.createPlayer('王真实', '王微信', 'player4', '2c.jpg', '2d.jpg', '1.jpg')
      ],
      stats: [
        { label: 'ACES', left: 1, right: 0 },
        { label: '双发失误', left: 1, right: 1 },
        { label: '一发成功率', left: '61%', right: '56%' },
        { label: '一发得分率', left: '64%', right: '90%' },
        { label: '二发得分率', left: '50%', right: '43%' },
        { label: '破发成功次数', left: '0/1', right: '1/3' },
        { label: '击球成功率', left: '56%', right: '67%' },
        { label: '一发平均速度', left: '2500', right: '2400' },
        { label: '二发平均速度', left: '2800', right: '3000' },
        { label: '总得分', left: 16, right: 20 }
      ]
    }
  },
  methods: {
    createPlayer(realName, wechatName, defaultName, realAvatar, wechatAvatar, defaultAvatar) {
      return {
        // 嵌套三元运算符
        avatar: realAvatar ? require(`../assets/image/${realAvatar}`)
          : wechatAvatar ? require(`../assets/image/${wechatAvatar}`)
            : require(`../assets/image/${defaultAvatar}`),
        name: realName || wechatName || defaultName
      }
    },
    exit() {
      // this.$message.info("退出功能开发中")

      // 数据清理

      // 跳转页面
      this.$router.push('/select')
    },
    toTennis3D() {
      this.$router.push('/tennis3D')
    }
  }
}
</script>
<style scoped>
.stats-bg {
  background: url('@/assets/image/3a.jpg') no-repeat center;
  background-size: cover;
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
}

.stats-main-card {
  width: 100%;
  height: 100%;
  background: rgba(24, 34, 44, 0.8);
}

.side-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12%;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container:first-child {
  margin-top: 30px;
}

.avatar {
  width: 210px;
  height: 240px;
  border-radius: 10px;
}

.player-name {
  padding: 15px 0;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  white-space: nowrap;
}

.stats-table {
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats-card {
  background: transparent;
  border: none;
  width: 100%;
}

.stats-title {
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 2px;
  text-align: center;
}

.stats-row {
  display: flex;
  align-items: center;
  padding: 2% 0;
}

.stat-label {
  color: #fff;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
}

.stat-value {
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}

.stat-value.left {
  color: #6cf16c;
}

.stat-value.right {
  color: #ffd700;
}

.fade-divider {
  width: 100%;
  height: 2px;
  margin: 0 auto;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%);
  opacity: 0.7;
}

.exit-button-container {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>