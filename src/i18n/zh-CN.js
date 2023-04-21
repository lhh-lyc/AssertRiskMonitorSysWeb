const t = {}

t.loading = '加载中...'

t.brand = {}
t.brand.lg = '南谯区生态环境分局一企一档系统'
t.brand.mini = '人人'

t.add = '新增'
t.delete = '删除'
t.deleteBatch = '删除'
t.update = '修改'
t.query = '查询'
t.moreQuery = '高级筛选'
t.uploadModule = '上传'
t.downLoadModule = '下载模板'
t.export = '导出'
t.handle = '操作'
t.confirm = '确定'
t.cancel = '取消'
t.clear = '清除'
t.logout = '退出'
t.manage = '处理'
t.createDate = '创建时间'
t.keyword = '关键字：'
t.choose = '请选择'

t.prompt = {}
t.prompt.title = '提示'
t.prompt.info = '确定进行[{handle}]操作?'
t.prompt.success = '操作成功'
t.prompt.failed = '操作失败'
t.prompt.deleteBatch = '请选择删除项'

t.validate = {}
t.validate.required = '必填项不能为空'
t.validate.format = '{attr}格式错误'

t.upload = {}
t.upload.text = '将文件拖到此处，或<em>点击上传</em>'
t.upload.tip = '只支持{format}格式文件！'
t.upload.button = '点击上传'

t.datePicker = {}
t.datePicker.range = '至'
t.datePicker.start = '开始日期'
t.datePicker.end = '结束日期'

t.fullscreen = {}
t.fullscreen.prompt = '您的浏览器不支持此操作'

t.updatePassword = {}
t.updatePassword.title = '修改密码'
t.updatePassword.username = '账号'
t.updatePassword.password = '原密码'
t.updatePassword.newPassword = '新密码'
t.updatePassword.confirmPassword = '确认密码'
t.updatePassword.validate = {}
t.updatePassword.validate.confirmPassword = '确认密码与新密码输入不一致'

t.contentTabs = {}
t.contentTabs.closeCurrent = '关闭当前标签页'
t.contentTabs.closeOther = '关闭其它标签页'
t.contentTabs.closeAll = '关闭全部标签页'

/* 页面 */
t.notFound = {}
t.notFound.desc = '抱歉！您访问的页面<em>失联</em>啦...'
t.notFound.back = '上一页'
t.notFound.home = '首页'

t.login = {}
t.login.title = '登录'
t.login.username = '用户名'
t.login.password = '密码'
t.login.captcha = '验证码'
t.login.demo = '在线演示'
t.login.copyright = '人人开源'

t.schedule = {}
t.schedule.beanName = 'bean名称'
t.schedule.beanNameTips = 'spring bean名称, 如: testTask'
t.schedule.pauseBatch = '暂停'
t.schedule.resumeBatch = '恢复'
t.schedule.runBatch = '执行'
t.schedule.log = '日志列表'
t.schedule.params = '参数'
t.schedule.cronExpression = 'cron表达式'
t.schedule.cronExpressionTips = '如: 0 0 12 * * ?'
t.schedule.remark = '备注'
t.schedule.status = '状态'
t.schedule.status0 = '暂停'
t.schedule.status1 = '正常'
t.schedule.statusLog0 = '失败'
t.schedule.statusLog1 = '成功'
t.schedule.pause = '暂停'
t.schedule.resume = '恢复'
t.schedule.run = '执行'
t.schedule.jobId = '任务ID'
t.schedule.times = '耗时(单位: 毫秒)'
t.schedule.createDate = '执行时间'

t.oss = {}
t.oss.config = '云存储配置'
t.oss.upload = '上传文件'
t.oss.url = 'URL地址'
t.oss.createDate = '创建时间'
t.oss.type = '类型'
t.oss.type1 = '七牛'
t.oss.type2 = '阿里云'
t.oss.type3 = '腾讯云'
t.oss.qiniuDomain = '域名'
t.oss.qiniuDomainTips = '七牛绑定的域名'
t.oss.qiniuPrefix = '路径前缀'
t.oss.qiniuPrefixTips = '不设置默认为空'
t.oss.qiniuAccessKey = 'AccessKey'
t.oss.qiniuAccessKeyTips = '七牛AccessKey'
t.oss.qiniuSecretKey = 'SecretKey'
t.oss.qiniuSecretKeyTips = '七牛SecretKey'
t.oss.qiniuBucketName = '空间名'
t.oss.qiniuBucketNameTips = '七牛存储空间名'
t.oss.aliyunDomain = '域名'
t.oss.aliyunDomainTips = '阿里云绑定的域名，如：http://cdn.renren.io'
t.oss.aliyunPrefix = '路径前缀'
t.oss.aliyunPrefixTips = '不设置默认为空'
t.oss.aliyunEndPoint = 'EndPoint'
t.oss.aliyunEndPointTips = '阿里云EndPoint'
t.oss.aliyunAccessKeyId = 'AccessKeyId'
t.oss.aliyunAccessKeyIdTips = '阿里云AccessKeyId'
t.oss.aliyunAccessKeySecret = 'AccessKeySecret'
t.oss.aliyunAccessKeySecretTips = '阿里云AccessKeySecret'
t.oss.aliyunBucketName = 'BucketName'
t.oss.aliyunBucketNameTips = '阿里云BucketName'
t.oss.qcloudDomain = '域名'
t.oss.qcloudDomainTips = '腾讯云绑定的域名'
t.oss.qcloudPrefix = '路径前缀'
t.oss.qcloudPrefixTips = '不设置默认为空'
t.oss.qcloudAppId = 'AppId'
t.oss.qcloudAppIdTips = '腾讯云AppId'
t.oss.qcloudSecretId = 'SecretId'
t.oss.qcloudSecretIdTips = '腾讯云SecretId'
t.oss.qcloudSecretKey = 'SecretKey'
t.oss.qcloudSecretKeyTips = '腾讯云SecretKey'
t.oss.qcloudBucketName = 'BucketName'
t.oss.qcloudBucketNameTips = '腾讯云BucketName'
t.oss.qcloudRegion = '所属地区'
t.oss.qcloudRegionTips = '请选择'
t.oss.qcloudRegionBeijing1 = '北京一区（华北）'
t.oss.qcloudRegionBeijing = '北京'
t.oss.qcloudRegionShanghai = '上海（华东）'
t.oss.qcloudRegionGuangzhou = '广州（华南）'
t.oss.qcloudRegionChengdu = '成都（西南）'
t.oss.qcloudRegionChongqing = '重庆'
t.oss.qcloudRegionSingapore = '新加坡'
t.oss.qcloudRegionHongkong = '香港'
t.oss.qcloudRegionToronto = '多伦多'
t.oss.qcloudRegionFrankfurt = '法兰克福'

t.dept = {}
t.dept.name = '名称'
t.dept.parentName = '上级部门'
t.dept.sort = '排序'
t.dept.parentNameDefault = '一级部门'
t.dept.chooseerror = '请选择部门'
t.dept.title = '选择部门'

t.dict = {}
t.dict.dictName = '字典名称'
t.dict.dictType = '字典类型'
t.dict.dictLabel = '字典标签'
t.dict.dictValue = '字典值'
t.dict.sort = '排序'
t.dict.remark = '备注'
t.dict.createDate = '创建时间'

t.logError = {}
t.logError.requestUri = '请求URI'
t.logError.requestMethod = '请求方式'
t.logError.requestParams = '请求参数'
t.logError.ip = '操作IP'
t.logError.userAgent = '用户代理'
t.logError.createDate = '创建时间'
t.logError.errorInfo = '异常信息'

t.logLogin = {}
t.logLogin.creatorName = '用户名'
t.logLogin.status = '状态'
t.logLogin.status0 = '失败'
t.logLogin.status1 = '成功'
t.logLogin.status2 = '账号已锁定'
t.logLogin.operation = '操作类型'
t.logLogin.operation0 = '登录'
t.logLogin.operation1 = '退出'
t.logLogin.ip = '操作IP'
t.logLogin.userAgent = 'User-Agent'
t.logLogin.createDate = '创建时间'

t.logOperation = {}
t.logOperation.status = '状态'
t.logOperation.status0 = '失败'
t.logOperation.status1 = '成功'
t.logOperation.creatorName = '用户名'
t.logOperation.operation = '用户操作'
t.logOperation.requestUri = '请求URI'
t.logOperation.requestMethod = '请求方式'
t.logOperation.requestParams = '请求参数'
t.logOperation.requestTime = '请求时长'
t.logOperation.ip = '操作IP'
t.logOperation.userAgent = 'User-Agent'
t.logOperation.createDate = '创建时间'

t.menu = {}
t.menu.name = '名称'
t.menu.icon = '图标'
t.menu.type = '类型'
t.menu.type0 = '目录'
t.menu.type1 = '菜单'
t.menu.type2 = '按钮'
t.menu.sort = '排序'
t.menu.url = '路由'
t.menu.permissions = '授权标识'
t.menu.permissionsTips = '多个用逗号分隔，如：sys:menu:save,sys:menu:update'
t.menu.parentName = '上级菜单'
t.menu.parentNameDefault = '一级菜单'
t.menu.resource = '授权资源'
t.menu.resourceUrl = '资源URL'
t.menu.resourceMethod = '请求方式'
t.menu.resourceAddItem = '添加一项'

t.params = {}
t.params.paramCode = '编码'
t.params.paramValue = '值'
t.params.remark = '备注'

t.role = {}
t.role.type0 = '管理员'
t.role.type1 = '用户'
t.role.name = '名称'
t.role.remark = '备注'
t.role.createDate = '创建时间'
t.role.menuList = '菜单授权'
t.role.deptList = '数据授权'

t.user = {}
t.user.username = '用户名'
t.user.deptName = '所属部门'
t.user.realName = '真实姓名'
t.user.email = '邮箱'
t.user.mobile = '手机号'
t.user.status = '状态'
t.user.status0 = '停用'
t.user.status1 = '正常'
t.user.createDate = '创建时间'
t.user.password = '密码'
t.user.confirmPassword = '确认密码'
t.user.gender = '性别'
t.user.gender0 = '男'
t.user.gender1 = '女'
t.user.gender2 = '保密'
t.user.roleIdList = '角色配置'
t.user.validate = {}
t.user.validate.confirmPassword = '确认密码与密码输入不一致'
t.user.select = '选择用户'
t.user.selecterror = '请选择一条记录'

t.unit = {}
t.unit.unitName = '企业名称'

export default t
