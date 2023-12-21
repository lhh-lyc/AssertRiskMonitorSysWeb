import request from "@/utils/request"

export function getServerInfo(query) {
    return request({
        url: "/sys/setting/server/info",
        method: "get",
        params: query,
    });
}

export function saveServer(query) {
    return request({
        url: "/sys/setting/saveServer",
        method: "post",
        data: query,
    });
}
