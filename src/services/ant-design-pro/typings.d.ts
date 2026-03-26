// @ts-ignore
/* eslint-disable */

declare namespace API {

  type LoginResult = {
    code: number;
    msg: string | null;
    data: {
      access_token: string;
      expires_in: number;
    };
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username: string;
    password: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  /** 用户信息响应 GET /system/user/getInfo */
  type UserInfoResponse = {
    msg: string;
    code: number;
    permissions: string[];
    expire: Expire;
    roles: string[];
    user: User;
  };

   type CurrentUser = UserInfoResponse;

  type Expire = {
    msg: string;
    status: number;
  };

  type User = {
    createBy: string;
    createTime: string;
    updateBy: string | null;
    updateTime: string | null;
    remark: string;
    userId: number;
    deptId: number;
    userName: string;
    nickName: string;
    email: string;
    phonenumber: string;
    sex: string;
    avatar: string;
    password: string;
    status: string;
    delFlag: string;
    loginIp: string;
    loginDate: string | null;
    pwdTime: string | null;
    dept: Dept;
    roles: Role[];
    roleIds: number[] | null;
    postIds: number[] | null;
    roleId: number | null;
    admin: boolean;
  };

  type Dept = {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    deptId: number;
    parentId: number;
    ancestors: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: string | null;
    email: string | null;
    status: string;
    delFlag: string | null;
    parentName: string | null;
    children: any[];
  };

  type Role = {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    roleId: number;
    roleName: string;
    roleKey: string;
    roleSort: number;
    dataScope: string;
    menuCheckStrictly: boolean;
    deptCheckStrictly: boolean;
    status: string;
    delFlag: string | null;
    flag: boolean;
    menuIds: number[] | null;
    deptIds: number[] | null;
    permissions: string[];
    admin: boolean;
  };

  // ===================== 通用响应类型 =====================

  /** 通用响应结果 */
  type ResultInfo<T = any> = {
    code: number;
    msg: string;
    data: T;
  };

  /** 分页列表响应结果 */
  type TableResultInfo<T = any> = {
    code: number;
    msg: string;
    rows: T[];
    total: number;
  };

  // ===================== 设备台账相关类型 =====================

  /** 车辆绑定记录实体 */
  type VheDeviceItem = {
    /** 主键ID */
    id?: number;
    /** 设备编码 */
    deviceSn?: string;
    /** 车牌号 */
    carPlate?: string;
    /** 设备类型 */
    deviceType?: number;
    /** 设备型号 */
    deviceModel?: string;
    /** 安装时间 */
    installDate?: string;
    /** 填报人 */
    inputBy?: string;
    /** 启用状态 */
    status?: number;
    /** 创建人 */
    createBy?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新人 */
    updateBy?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** 车辆绑定记录详情（复用 VheDeviceItem） */
  type VheDeviceDetail = VheDeviceItem;

  /** 列表查询参数 */
  type ListVheDeviceParams = {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 设备编码 */
    deviceSn?: string;
    /** 车牌号 */
    carPlate?: string;
    /** 设备类型 */
    deviceType?: number;
    /** 启用状态 */
    status?: number;
  };

  /** 新增车辆绑定记录参数 */
  type AddVheDeviceParams = {
    /** 设备编码 */
    deviceSn: string;
    /** 车牌号 */
    carPlate: string;
    /** 设备类型 */
    deviceType: number;
    /** 设备型号 */
    deviceModel?: string;
    /** 安装时间 */
    installDate?: string;
    /** 填报人 */
    inputBy?: string;
    /** 启用状态 */
    status?: number;
  };

  /** 修改车辆绑定记录参数 */
  type UpdateVheDeviceParams = {
    /** 主键ID */
    id: number;
    /** 设备编码 */
    deviceSn?: string;
    /** 车牌号 */
    carPlate?: string;
    /** 设备类型 */
    deviceType?: number;
    /** 设备型号 */
    deviceModel?: string;
    /** 安装时间 */
    installDate?: string;
    /** 填报人 */
    inputBy?: string;
    /** 启用状态 */
    status?: number;
  };

  /** 车辆列表项 */
  type CarListItem = {
    /** 车辆ID */
    id?: number;
    /** 车牌号 */
    carPlate?: string;
    /** 车辆类型 */
    carType?: number;
    /** 车辆名称 */
    carName?: string;
    /** 所属部门 */
    deptId?: number;
    /** 部门名称 */
    deptName?: string;
    /** 状态 */
    status?: number;
  };

  /** 车辆列表查询参数 */
  type CarListParams = {
    /** 车牌号 */
    carPlate?: string;
    /** 车辆类型 */
    carType?: number;
    /** 所属部门 */
    deptId?: number;
    /** 状态 */
    status?: number;
  };
}
