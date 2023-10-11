import request from "@/utils/request"

export function page(query) {
    return request({
        url: "/scan/port/queryPage",
        method: "get",
        params: query,
    });
}

export function del(query) {
    return request({
        url: "/scan/port/delete",
        method: "post",
        data: query,
    });
}

export function exportFile(query) {
    return request({
        url: "/scan/export/exportPorts",
        method: "get",
        params: query,
        responseType: "arraybuffer",
    }).then((response) => {
        // 处理返回的文件流
        const blob = new Blob([response.data], {
            type: "application/vnd.ms-excel",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = query.filename;
        document.body.appendChild(link);
        link.click();
        window.setTimeout(function () {
            URL.revokeObjectURL(blob);
            document.body.removeChild(link);
        }, 0);
    });

}

export function exportFile2(query) {
    return request({
        url: "/scan/export/uploadPorts",
        method: "get",
        params: query,
    });

}
