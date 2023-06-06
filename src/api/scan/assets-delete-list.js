import request from "@/utils/request"

export function del(query) {
    return request({
        url: "/scan/port/deleteByTag",
        method: "post",
        data: query,
    });
}

export function reScan(query) {
    return request({
        url: "/scan/port/reScan",
        method: "post",
        data: query,
    });
}
