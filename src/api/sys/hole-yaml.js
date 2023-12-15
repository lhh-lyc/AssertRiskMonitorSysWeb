import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/hole/yaml/page",
        method: "get",
        params: query,
    });
}

export function getCmsJson(query) {
    return request({
        url: "/cms/json/getCmsJson",
        method: "get",
        params: query,
    });
}

