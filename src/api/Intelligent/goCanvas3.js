import request from '@/utils/request'
// 周期时间
export function periodTimeList(data) {
  return request({
    url: `/rehearsal/period`,
    method: 'get',
    params: data
  })
}
// 进度条
export function predictTimeList(data) {
  return request({
    url: `/rehearsal/sample`,
    method: 'get',
    params: data
  })
}
// 抽样回合
export function roundIndexList(data) {
  return request({
    url: `/rehearsal/round`,
    method: 'get',
    params: data
  })
}
// 抽样统计
export function rehearsalList(data) {
  return request({
    url: `/rehearsal/statistics`,
    method: 'get',
    params: data
  })
}
// 查看样本  计算潮流信息
export function getCalculateTrend(data) {
  return request({
    url: `/rehearsal/trend`,
    method: 'get',
    params: data
  })
}
// 主网开关状态查询
export function getEMSBreakerState(data) {
  return request({
    url: `/rehearsal/sample/dms/breaker`,
    method: 'get',
    params: data
  })
}
// 配网开关状态查询
export function getPWEMSBreakerState(data) {
  return request({
    url: `/rehearsal/sample/ems/breaker`,
    method: 'get',
    params: data
  })
}


// 主网开关基本信息
export function getEMSBreakerData(breakerId,id='') {
  return request({
    url: `/rehearsal/ems/breaker?breakerId=${breakerId}&id=${id}`,
    method: 'get',
  })
}
// 配网开关基本信息
export function getPwEMSBreakerData(dmsBreakerId,id='') {
  return request({
    url: `/rehearsal/dms/breaker?dmsBreakerId=${dmsBreakerId}&id=${id}`,
    method: 'get',
  })
}

// 主网主变基本信息
export function getEMSPowertransformerData(emsPowertransformerId,id='') {
  return request({
    url: `/rehearsal/ems/powertransformer?emsPowertransformerId=${emsPowertransformerId}&id=${id}`,
    method: 'get',
  })
}