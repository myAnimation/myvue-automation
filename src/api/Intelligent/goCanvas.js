import request from '@/utils/request'
import getTopologyDataJson from './json/getTopologyData.json'
import getTrendListJson from './json/getTrendList.json'
import getEMSBreakerStateJson from './json/getEMSBreakerState.json'
import getPWEMSBreakerStateJson from './json/getPWEMSBreakerState.json'
// 潮流线路
export function getTrendList(id = "156890", time = "") {
  // return request({
  //   url: `/trend/realtime?belongId=${id}&dateTime=${time}`,
  //   method: 'get',
  // })
  return {
    data: getTrendListJson
  }
}
// 主网开关状态查询
export function getEMSBreakerState(sectionTime = '', topologyId = '1598937214428459009') {
  // return request({
  //   url: `/emsBreaker/getEMSBreakerState?topologyId=${topologyId}&sectionTime=${sectionTime}`,
  //   method: 'get',
  // })
  console.log('123',)
  return getEMSBreakerStateJson
}
// 配网开关状态查询
export function getPWEMSBreakerState(sectionTime = '', topologyId = '1598937214428459009') {
  return getPWEMSBreakerStateJson
  // return request({
  //   url: `/dmsBreaker/getDMSBreakerState?topologyId=${topologyId}&sectionTime=${sectionTime}`,
  //   method: 'get',
  // })
}
// 开关基本信息
export function getEMSBreakerData(breakerId, calcId = '', sectionTime = '') {
  return request({
    url: `/emsBreaker/getEMSBreakerData?breakerId=${breakerId}&calcId=${calcId}&sectionTime=${sectionTime}`,
    method: 'get',
  })
}
// 配网开关基本信息
export function getPwEMSBreakerData(dmsBreakerId, calcId = '', sectionTime = '') {
  return request({
    url: `/dmsBreaker/getDMSBreakerData?dmsBreakerId=${dmsBreakerId}&calcId=${calcId}&sectionTime=${sectionTime}`,
    method: 'get',
  })
}
// /dmsPole/getDMSBreakerData
// 配网杆塔基本信息
// deviceMark	设备标识
// deviceName	设备名称
// feederName 所属馈线
export function getPwEMSBreakerDataGt(dmsPoleId) {
  return request({
    url: `/dmsPole/getDMSBreakerData?dmsPoleId=${dmsPoleId}`,
    method: 'get',
  })
}
// 线路基本信息
export function getEMSAclineendData(emsAclineendId, calcId = '', sectionTime = '') {
  return request({
    url: `/emsAclineend/getEMSAclineendData?emsAclineendId=${emsAclineendId}&calcId=${calcId}&sectionTime=${sectionTime}`,
    method: 'get',
  })
}


// 主变基本信息
export function getEMSPowertransformerData(emsPowertransformerId, calcId = '', sectionTime) {
  return request({
    url: `/emsPowertransformer/getEMSPowertransformerData?emsPowertransformerId=${emsPowertransformerId}&calcId=${calcId}&sectionTime=${sectionTime}`,
    method: 'get',
  })
}
// 母线基本信息
export function getEMSBusbarsectionData(emsBusbarsectionId) {
  return request({
    url: `/emsBusbarsection/getEMSBusbarsectionData?emsBusbarsectionId=${emsBusbarsectionId}`,
    method: 'get',
  })
}
// 获取拓扑图
export function getTopologyData(id = '1598937214428459009') {
  return {
    data: getTopologyDataJson
  }


}
export function getYgWg(id = '1598937214428459009') {
  return request({
    url: `/topology/getQyyg?id=${id}`,
    method: 'get',
  })
}

// 断面时间下拉

export function getDmTimeList(pageNum = 1, pageSize = 10) {
  return request({
    url: `/fileRecord/getLatestFileRecord?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get',
  })
}
// 断面时间下拉

export function getDmTime() {
  return request({
    url: `/fileRecord/getLatestFileRecord`,
    method: 'get',
  })
}

// 潮流验证
export function getTrendVerifyList(topologyId = '1598937214428459009') {
  return request({
    url: `/trend/trendVerify?topologyId=${topologyId}`,
    method: 'get',
  })
}
export function getCalculateTrend(data) {
  return request({
    url: `/trend/calculateTrend`,
    method: 'post',
    data
  })
}

// 小水电组信息

export function getSubstationGroupData(id) {
  return request({
    url: `/trend/getSubstationGroupData?substationGroupId=${id}`,
    method: 'get',

  })
}
