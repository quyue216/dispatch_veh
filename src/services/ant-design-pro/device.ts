// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

// ===================== 接口函数 =====================

/** 查询车绑定监控列表 */
export async function listVheDevice(params: API.ListVheDeviceParams) {
  return request<API.TableResultInfo<API.VheDeviceItem>>('/huanwei/vehicle/device/list', {
    method: 'GET',
    params,
  });
}

/** 查询车辆绑定记录详细 */
export async function getVheDeviceDetail(id: number) {
  return request<API.ResultInfo<API.VheDeviceDetail>>(`/huanwei/vehicle/device/${id}`, {
    method: 'GET',
  });
}

/** 新增车辆绑定记录 */
export async function addVheDevice(data: API.AddVheDeviceParams) {
  return request<API.ResultInfo<number>>('/huanwei/vehicle/device', {
    method: 'POST',
    data,
  });
}

/** 修改车辆绑定记录 */
export async function updateVheDevice(data: API.UpdateVheDeviceParams) {
  return request<API.ResultInfo<void>>('/huanwei/vehicle/device', {
    method: 'PUT',
    data,
  });
}

/** 删除车辆绑定记录 */
export async function delVheDevice(id: string) {
  return request<API.ResultInfo<void>>(`/huanwei/vehicle/device/${id}`, {
    method: 'DELETE',
  });
}

/** 获取车辆列表 */
export async function getCarList(data: API.CarListParams) {
  return request<API.TableResultInfo<API.CarListItem>>('/huanwei/dp/mapcar', {
    method: 'POST',
    data,
  });
}

/** 获取设备编码列表（用于下拉选择） */
export async function getDeviceSnList() {
  return request<API.ResultInfo<API.DeviceSnItem[]>>('/huanwei/vehicle/device/deviceSnList', {
    method: 'GET',
  });
}
