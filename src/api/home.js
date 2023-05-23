import request from "@/utils/request"

export function getHomeNum(query) {
    return request({
        url: "/scan/home/getHomeNum",
        method: "get",
        params: query,
    });
}

export function recordClick(query) {
    return request({
        url: "/scan/home/getRecordList",
        method: "get",
        params: query,
    });
}

export function companyRanking(query) {
    return request({
        url: "/scan/home/companyRanking",
        method: "get",
        params: query,
    });
}
