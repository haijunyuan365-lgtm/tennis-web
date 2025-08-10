// src/utils/pointColor.js
export function getPointColor(y, type = null) {
  // 3米线分界，y越小越靠近球网
  const deepLine = 3 / 13.41
  const isDeepArea = y < deepLine
  
  // 如果有击球类型，在深浅区基础上区分正手反手
  if (type) {
    if (isDeepArea) {
      // 深区：正手深黄，反手浅黄
      if (type === 'forehand') {
        return '#ffd700' // 深黄（正手）
      } else if (type === 'backhand') {
        return '#fff4b0' // 浅黄（反手）
      }
    } else {
      // 浅区：正手深粉，反手浅粉
      if (type === 'forehand') {
        return '#ff1493' // 深粉（正手）
      } else if (type === 'backhand') {
        return '#ffb6c1' // 浅粉（反手）
      }
    }
  }
  
  // 如果没有击球类型，使用原来的深浅区颜色
  return isDeepArea ? '#ffe600' : '#ff5ca9' // 深区黄色，浅区粉色
}