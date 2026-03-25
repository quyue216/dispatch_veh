import type { RequestOptions } from '@@/plugin-request/request';
import { WarningFilled } from '@ant-design/icons';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { Modal, message, notification } from 'antd';
import { getToken, removeToken } from './utils/auth';

const { confirm } = Modal;

// 判断登录是否有效
const isInvalid = {
  result: false,
};

/**
 *  错误展示类型枚举
 *  定义后端返回错误时的不同展示方式
 *  SILENT - 静默处理，适合一些非关键性的后台错误
 *  ERROR_MESSAGE - 显示错误提示，适合普通业务错误
 *  NOTIFICATION - 通知提醒，适合需要用户关注的错误
 *  REDIRECT - 重定向到登录页或其他页面，通常用于 401 未授权等场景
 */
enum ErrorShowType {
  /** 静默处理，不显示任何提示 */
  SILENT = 0,
  /** 显示警告消息提示 */
  WARN_MESSAGE = 1,
  /** 显示错误消息提示 */
  ERROR_MESSAGE = 2,
  /** 显示通知提醒框 */
  NOTIFICATION = 3,
  /** 重定向到指定页面 */
  REDIRECT = 9,
}
// 错误信息
const errorMsg: {
  [prop: PropertyKey]: string;
} = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  default: '系统未知错误，请反馈给管理员',
};

const loginOut = async () => {
  removeToken();

  const { search, pathname } = window.location;

  const urlParams = new URL(window.location.href).searchParams;

  const searchParams = new URLSearchParams({
    redirect: pathname + search,
  });
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect');
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: searchParams.toString(),
    });
  }
};

// 与后端约定的响应数据格式
interface ResponseStructure {
  code: number;
  data: any;
  msg: string | null;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { code, data, msg } = res as unknown as ResponseStructure;

      if (code !== 200) {
        const error: any = new Error(msg!);
        error.name = 'BizError';
        error.info = { code, data, msg };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { code, msg: resMsg } = errorInfo;

          const msg = errorMsg[code] || resMsg || errorMsg['default'];

          // token过期
          if (code === 401) {
            if (!isInvalid.result) {
              isInvalid.result = true;
              console.log('系统提示');

              confirm({
                title: '系统提示',
                icon: <WarningFilled />,
                content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
                okText: '重新登录',
                cancelText: '取消',
                onOk() {
                  //TODO 清楚用户信息
                  isInvalid.result = false;
                  loginOut();
                },
                onCancel() {
                  isInvalid.result = false;
                },
              });
            }
          } else if (code === 500) {
            // 服务器内部错误
            message.error(msg);
            throw error;
          } else if (code === 601) {
            // 业务警告
            message.warning(msg);
            throw new Error('error');
          } else if (code !== 200) {
            // 其他非 200 错误
            notification.error({ message: msg });
            throw new Error('error');
          }
        }
      } else {
        console.log('err' + error);
        let errMsg: string = error.message;
        if (errMsg === 'Network Error') {
          errMsg = '后端接口连接异常';
        } else if (errMsg.includes('timeout')) {
          errMsg = '系统接口请求超时';
        } else if (errMsg.includes('Request failed with status code')) {
          errMsg = '系统接口' + errMsg.slice(-3) + '异常';
        }
        message.error({ content: errMsg, duration: 5 });
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      if (getToken()) {
        //@ts-expect-error
        config.headers['Authorization'] = 'Bearer ' + getToken();
      }

      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      const data = response.data as ResponseStructure;

      (data as any).success = data.code === 200;

      return response;
    },
  ],
};
