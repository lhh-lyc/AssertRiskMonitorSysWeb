import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/scan/security/hole/page",
        method: "get",
        params: query,
    });
}

export function exportFile(query) {
    return request({
        url: "/scan/export/uploadHoles",
        method: "get",
        params: query,
    });
}
