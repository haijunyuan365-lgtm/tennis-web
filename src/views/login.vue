<template>
  <div class="tennis-system" ref="allScrean">
    <div class="content">
      <!-- 左侧：二维码区域 -->
      <div class="left-panel">
        <div class="qrcode-container">

          <div class="qrcode-bg">
            <div class="section-title">
              <i class="fas fa-qrcode"></i>
              扫码参与体验
            </div>
            <div class="qrcode-placeholder">
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：用户列表 -->
      <div class="right-users">
        <div class="header">
          <h1 class="title">智能网球系统</h1>
        </div>
        <div class="right-panel">
          <div class="user-list">

            <div class="users-container">
              <el-table v-if="!(users.length === 0)" :data="users" style="width: 100%" height="680"
                :header-cell-style="{ background: '#1E8FD5', color: '#fff' }">
                <el-table-column prop="time" label="加入时间" min-width="200">
                </el-table-column>
                <el-table-column prop="name" label="姓名" min-width="200">
                </el-table-column>
                <el-table-column label="" min-width="50">
                  <template #default="scope">
                    <el-button type="danger" icon="el-icon-delete" circle
                      @click="handleDelete(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div v-if="users.length === 0" class="empty-list">
                <p style="text-align: center; padding: 30px; color: #aaa;">
                  <!-- <i class="fas fa-user-clock" style="font-size: 36px; margin-bottom: 15px; display: block;"></i> -->
                  等待用户扫码加入...
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部按钮 -->
        <div class="button-container">
          <button class="start-btn" :class="{ active: isExperienceStarted }" @click="start">
            {{ isExperienceStarted ? '体验进行中' : '开始体验' }}
            <i :class="isExperienceStarted ? 'fas fa-running' : 'fas fa-play-circle'"></i>
          </button>
          <div class="button-container-others">
            <!-- <el-button plain icon="el-icon-date" @click="goToMatchSystem">赛制选择</el-button> -->
            <el-button plain icon="el-icon-circle-plus-outline" @click="addPlayer">系统登录</el-button>
            <el-button plain icon="el-icon-warning-outline" @click="goToAbout">关于</el-button>
          </div>
        </div>
      </div>

      <!-- 关于对话框 -->
      <el-dialog title="关于" :visible.sync="aboutDialogVisible" width="50%">
        <span>本系统由XXX开发，用于管理网球比赛。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="aboutDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>

      <MatchRuleDialog v-model="matchSystemDialogVisible" @confirm="handleRuleConfirm" />

    </div>
  </div>
  <!-- </div> -->
</template>

<script>
// import { Elmessage } from 'element-ui'
import MatchRuleDialog from '@/components/MatchRuleDialog.vue';
export default {
  name: 'TennisSystem',
  data() {
    return {
      users: [
        { name: '张伟', time: '10:25:42', color: 'linear-gradient(45deg, #6a9bd8, #8e44ad)' },
        { name: '李娜', time: '10:26:15', color: 'linear-gradient(45deg, #ff9a9e, #fad0c4)' },
        { name: '王涛', time: '10:27:03', color: 'linear-gradient(45deg, #a1c4fd, #c2e9fb)' },
        { name: '刘洋', time: '10:28:22', color: 'linear-gradient(45deg, #ffecd2, #fcb69f)' },
        { name: '陈明', time: '10:29:47', color: 'linear-gradient(45deg, #84fab0, #8fd3f4)' },
        { name: '王涛', time: '10:27:03', color: 'linear-gradient(45deg, #a1c4fd, #c2e9fb)' },
        { name: '刘洋', time: '10:28:22', color: 'linear-gradient(45deg, #ffecd2, #fcb69f)' },
      ],
      form: {
        name: '',
        region: '',
        sex: '',
      },
      matchForm: {
        gameNumber: null,
        games:'',
        isCustom:null,
        sideChange:'',
        tiebreak:'',
        winGame:''
      },
      formLabelWidth: '120px',
      isExperienceStarted: false,
      timer: null,
      aboutDialogVisible: false,
      matchSystemDialogVisible: false,
      playerId: -1,
      isSetMatch: false,
      // userNumber:-1
    }
  },
  components: {
    MatchRuleDialog
  },
  mounted() {
    // 请求二维码地址
    // this.userNumber = this.users.length
  },
  beforeDestroy() {
    // clearInterval(this.timer);
  },
  computed: {
    playerNumber() {
      const num = this.users.length
      if(num > 8){
        return false
      }else{
        true
      }
    }
  },
  methods: {
    //接收后端传来的数据，进行人数的判断，并提示消息


    goToMatchSystem() {
      this.matchSystemDialogVisible = true;
    },
    addPlayer() {
      if (this.users.length > 8) {
        this.$message.error('超出人数限制')
      } else {
        if (this.playerId == -1) {
          this.playerId = this.users.length + 1;
          this.users.push({
            time: '10:25:42',
            name: 'Player ' + this.playerId,
            region: '',
            sex: '',
          })
        } else {
          this.playerId++;
          this.users.push({
            time: '10:25:42',
            name: 'Player ' + this.playerId,
            region: '',
            sex: '',
          })
        }
        // this.userNumber = this.users.length
      }

    },
    goToAbout() {
      this.aboutDialogVisible = true;
    },
    handleRuleConfirm(value) {

      // 表单校验（下面所有逻辑都放在表单校验成功的逻辑中）

      // 发请求，赛制保存到数据库或者保存到vuex中

      // 先关闭对话框
      this.matchSystemDialogVisible = false;

      // 标记为已设置赛制
      this.isSetMatch = true;
      // console.log(value);
      this.matchForm = value
      // console.log(this.matchForm);
      
      
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.users.splice(index, 1);
      //删除逻辑，向后端提交删除的user信息
      // this.userNumber = this.users.length
    },

    //开始体验
    start() {
      //是否已经设置赛制,若未设置则弹出提示框
      // if (!this.isSetMatch) {
      //   this.matchSystemDialogVisible = true;
      // }
      // if (this.isSetMatch){
      //   //跳转到其他页面
      //   this.$router.push('/select')
      // }

      this.$router.push('/select')

    }
  },
  watch: {

  }
}
</script>

<style scoped>
/* * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
} */

/* elementtable */
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.tennis-system {
  background-color: #ffffff;
  background-size: 100% 100%;
  /* min-height: 100vh; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 20px; */
  color: white;
  font-family: 'Arial', sans-serif;
  overflow: hidden;
  position: relative;
}

/* 标题样式 */
.header {
  text-align: center;
  margin-top: 30px;
}

.title {
  font-size: 52px;
  font-weight: 700;
  /* margin-bottom: 10px; */
  letter-spacing: 3px;
  /* color: #2ba53e; */
  color: #547fa2;
  /* text-shadow: 0 0 15px rgba(152, 231, 103, 0.7); */
  font-family: 'Orbitron', sans-serif;
}


/* 内容区域 */
.content {
  display: flex;
  flex: 1;
  /* height: 900px; */
  /* height: 100vh; */
  /* min-height: 100%; */
  background-color: #fff;
  /* margin: 20px; */
  /* gap: 40px; */
  /* margin-top: 20px; */
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.right-users {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}


/* 二维码区域 */
.qrcode-container {
  background: url("../assets/image/bg.jpg");
  background: rgba(118, 205, 243, );
  background-size: 100%;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  flex: 1;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}

.section-title {
  font-size: 24px;
  /* padding-bottom: 10px; */
  margin-top: -40px;
  height: 50px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}


.section-title i {
  margin-right: 10px;
  font-size: 28px;
}

.qrcode-bg {
  background: rgba(255, 255, 255, 0.179);
  border-radius: 12px;
  padding: 15px;
  display: inline-block;
  /* margin-bottom: 20px; */
  /* margin-left: 35px; */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  height: 700px;
  width: 700px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* backdrop-filter: blur(3px); */
  /* filter: blur(2px); */
  backdrop-filter: blur(3px);
  /* 使用 backdrop-filter */
  /* -webkit-filter: blur(2px); */
  -webkit-backdrop-filter: blur(2px);
  /* 兼容 Safari */
  z-index: 10;
  /* opacity: 0.5; */
}

.qrcode-placeholder {
  background: url("../assets/image/二维码.jpg") no-repeat;
  background-size: 100%;
  width: 600px;
  height: 600px;
  /* background: pink; */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #666;
  border-radius: 8px;
  position: relative;
  /* position: absolute; */
  overflow: hidden;
  /* left: 35px; */
  /* opacity: 0.5; */
}

/* 用户列表 */
.user-list {
  /* background: rgba(255, 255, 255, 0.816); */
  background: rgb(255, 255, 255);
  /* background-color: #fff; */
  border-radius: 15px;
  padding: 0 20px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  opacity: 0.9;
}

.users-container {
  background: rgba(0, 0, 0, );
  border-radius: 12px;
  padding: 5px 15px 5px;
  flex: 1;
  overflow-y: auto;
  max-height: 700px;
}

/* 按钮区域 */
.button-container {
  display: flex;
  justify-content: center;
  /* justify-content: space-between; */
  gap: 100px;
  margin-bottom: 30px;
}

.button-container-others {
  margin-top: 30px;
}

.start-btn {
  width: 300px;
  height: 70px;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  background: linear-gradient(to right, #bde3f0, #5eb1e0);
  border: none;
  border-radius: 35px;
  color: #0a2e38;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(81, 148, 215, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(118, 161, 231, 0.7);
}

.start-btn:active {
  transform: translateY(2px);
}

.start-btn i {
  margin-left: 10px;
  font-size: 28px;
}

.start-btn.active {
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  animation: pulse 2s infinite;
}


/* 动画效果 */
@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(10deg);
  }

  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 900px) {
  .content {
    flex-direction: column;
  }

  .title {
    font-size: 42px;
  }

  .start-btn {
    width: 250px;
    height: 60px;
    font-size: 22px;
  }
}

@media (max-width: 500px) {
  .title {
    font-size: 36px;
  }

  .qrcode-placeholder {
    width: 180px;
    height: 180px;
  }

  .qr-inner {
    width: 150px;
    height: 150px;
  }

  /* 统一滚动条样式 */
  .el-table__body-wrapper {
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #c0c4cc #f5f7fa;

    /* IE/Edge */
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  /* Webkit 定制 */
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
    transition: background 0.3s;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background: #909399;
  }

  .el-table__body-wrapper::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 3px;
  }

  /* 隐藏默认滚动条（保留功能） */
  .el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto;
  }
}
</style>