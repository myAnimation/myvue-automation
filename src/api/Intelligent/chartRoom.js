import request from '@/utils/request'
// 聊天
export function getChartRoomList(content,page,pageSize,userId) {
  return request({
    url: `/chat/messageHandler?content=${content}&page=${page}&pageSize=${pageSize}&=userId${userId}`,
    method: 'get',
  })
}
// 我知道了按钮
export function getShowButton() {
  return request({
    url: `/user/updateUserHint`,
    method: 'get',
  })
}