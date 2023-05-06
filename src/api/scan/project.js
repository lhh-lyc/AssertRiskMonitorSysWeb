import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/scan/project/page",
        method: "get",
        params: query,
    });
}

export function projectList(query) {
    return request({
        url: "/scan/project/list",
        method: "get",
        params: query,
    });
}
