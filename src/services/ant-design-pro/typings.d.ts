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
}
