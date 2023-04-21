import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/scan/project/page",
        method: "get",
        params: query,
    });
}
