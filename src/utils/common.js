/**
 * 全局key定义
 */
const commonkey = {
	adminTokenKey: "admin_token",
	refreshTokenKey: "refresh_token",
	adminUserIdKey: "admin_userId",
	isAdminKey: "is_admin",
	adminEncUserIdKey: "admin_encUserId",
	adminUserNamekey: "admin_userName",
	adminUnitNamekey: "admin_unitName",
	adminPlatTypeKey: "admin_platType",
	adminDevCodeKey: "admin_devCode",
	unitIdKey: "admin_unitId",
	unitCodeKey: "admin_unitCode",
	isParkKey: "admin_isPark",
	parkCode: "yq001",
	loginTypeKey: "loginType",
}

/**
 * 检查输入值字符串是否为空
 * 输入:str 字符串
 * 返回:true 或 flase; true表示为空
 */
function isBlank(str) {
	if (str === undefined || str === null || str === "" || str.length === 0) {
		return true;
	} else {
		return false;
	}
}

/**
 * 检查输入的手机号码格式是否正确
 * 输入:str 字符串
 * 返回:true 或 flase; true表示格式正确
 */
let TEL_REGEXP = /^1[3|4|5|6|7|8|9]\d{9}$/;
//let FIXED_TEL_REGXP = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;

function checkPhone(phone) {
	if (phone != "") {
		if (TEL_REGEXP.test(phone)) {
			return true;
		}
		return false;
	} else {
		return true;
	}
}

function getFolder() {
	var folder = '';
	if (sessionStorage.getItem(commonkey.isParkKey) == 1) { //园区
		folder = "park";lo
	} else if (sessionStorage.getItem(commonkey.isParkKey) == 0) { //企业
		folder = "unit/" + sessionStorage.getItem(commonkey.unitIdKey);
	} else {
		folder = "admin"
	}
	return folder;
}

export { commonkey,isBlank,checkPhone,getFolder }
