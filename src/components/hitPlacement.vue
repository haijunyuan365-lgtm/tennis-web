<template>
  <div style="display:none"></div>
</template>

<script>
export default {
  name: 'hitPlacement',
  mounted() {
    // 左侧球场数据 - 添加击球类型
    const points1 = [
      { x: 0.2, y: 0.85, type: 'forehand' },  // 正手
      { x: 0.5, y: 0.8, type: 'backhand' },   // 反手
      { x: 0.8, y: 0.7, type: 'forehand' },   // 正手
      { x: 0.3, y: 0.2, type: 'backhand' },   // 反手
      { x: 0.6, y: 0.1, type: 'forehand' },   // 正手
      { x: 0.8, y: 0.18, type: 'backhand' }   // 反手
    ]
    
    // 右侧球场数据 - 添加击球类型
    const points2 = [
      { x: 0.1, y: 0.9, type: 'backhand' },   // 反手
      { x: 0.4, y: 0.75, type: 'forehand' },  // 正手
      { x: 0.7, y: 0.65, type: 'backhand' },  // 反手
      { x: 0.2, y: 0.3, type: 'forehand' },   // 正手
      { x: 0.5, y: 0.15, type: 'backhand' },  // 反手
      { x: 0.9, y: 0.25, type: 'forehand' }   // 正手
    ]
    
    this.$emit('update-points', points1, 1)
    this.$emit('update-points', points2, 2)
  }
}
</script>