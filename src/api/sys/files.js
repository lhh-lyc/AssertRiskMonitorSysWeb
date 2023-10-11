import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/sys/files/page",
        method: "get",
        params: query,
    });
}

export function exportFiles(query) {
    return request({
        url: "/scan/export/exportFiles",
        method: "post",
        data: query,
    });
}

