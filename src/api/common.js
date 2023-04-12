export function formatYMD(date) {
    //获取年月日，时间
    var year = date.getFullYear();
    var mon = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    var data = date.getDate()  < 10 ? "0"+(date.getDate()) : date.getDate();
    var newDate = year +"-"+ mon +"-"+ data;
    return newDate;
}
