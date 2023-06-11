import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/sys/letter/page",
        method: "get",
        params: query,
    });
}

export function read(query) {
    return request({
        url: "/sys/letter/read",
        method: "post",
        data: query,
    });
}

