// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录 POST /auth/login */
export async function login(body: API.LoginParams) {
  console.log("🚀 ~ login ~ body:", body)
  return request<API.LoginResult>('/auth/login', {
    method: 'POST',
    data: body,
  });
}
