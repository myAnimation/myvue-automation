import request from '@/utils/request'
// 潮流线路
// 原方式
export function getTrendListBefore(summaryId = "", topologyId = "1598937214428459009") {
    let calcId = encodeURIComponent(summaryId) || ""
    return request({
        url: `/trend/before?topologyId=${topologyId}&calcId=${calcId}`,
        method: 'get',
    })
}
// 预计优化后
export function getTrendListPredict(summaryId = "", topologyId = "1598937214428459009") {
    let calcId = encodeURIComponent(summaryId)  || ""
    return request({
        url: `/trend/predict?topologyId=${topologyId}&calcId=${calcId}`,
        method: 'get',
    })
}
// 实际执行
export function getTrendListAfter(summaryId = "", topologyId = "1598937214428459009") {
    let calcId = encodeURIComponent(summaryId)  || ""
    return request({
        url: `/trend/after?topologyId=${topologyId}&calcId=${calcId}`,
        method: 'get',
    })
}

export function getYgWg(id = '1598937214428459009') {
    return request({
        url: `/topology/getQyyg?id=${id}`,
        method: 'get',
    })
}
// 主网开关状态查询
export function getEMSBreakerState(sectionTime = '', topologyId = '1598937214428459009') {
    return request({
        url: `/emsBreaker/getEMSBreakerState?topologyId=${topologyId}&sectionTime=${sectionTime}`,
        method: 'get',
    })
}
// 配网开关状态查询
export function getPWEMSBreakerState(sectionTime = '', topologyId = '1598937214428459009') {
    return request({
        url: `/dmsBreaker/getDMSBreakerState?topologyId=${topologyId}&sectionTime=${sectionTime}`,
        method: 'get',
    })
}
// 获取拓扑图
export function getTopologyData(id = '1598937214428459009') {
    return request({
        url: `/topology/getTopologyData?id=${id}`,
        method: 'get',
    })
}

// 仿真校校-潮流对比
export function getFlickerList(summaryId = "", topologyId = "1598937214428459009") {
    let calcId = encodeURIComponent(summaryId)
    return request({
        url: `/trend/compare?topologyId=${topologyId}&calcId=${calcId}`,
        method: 'get',
    })
}