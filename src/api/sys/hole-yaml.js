import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/hole/yaml/page",
        method: "get",
        params: query,
    });
}

export function folderList(query) {
    return request({
        url: "/hole/yaml/folder/list",
        method: "get",
        params: query,
    });
}

