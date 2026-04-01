import {
  type ActionType,
  ModalForm,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Col, Form, message, Row } from 'antd';
import type { FC, RefObject } from 'react';
import { getCarList } from '@/services/ant-design-pro/device';

interface CreateFormProps<T = any> {
  actionRef?: RefObject<ActionType | null>;
  title?: string;
  trigger: React.ReactNode;
  onSubmit?: (values: T) => Promise<any>;
  initialValues?: T;
}
/*
弹框表单功能
1. 详情
  1.1 表单项禁用
  1.2 数据项回显
  1.3 footer取消显示
2. 新增
  1.表单数据收集
  2.表单数据检验
  3.表单数据提交，消息提示成功or失败
3. 修改
  2.表单数据检验
  3.表单数据提交，消息提示成功or失败

*/
const CreateForm: FC<CreateFormProps> = (props) => {
  const {
    actionRef,
    title = '设备详情',
    trigger,
    onSubmit = () => {},
    initialValues = {},
  } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { initialState: { currentUser } = {} } = useModel('@@initialState');

  const getDefaultValues = () => {
    if (title === '新增设备台账') {
      return {
        ...initialValues,
        inputBy: currentUser?.user?.nickName,
        installDate: Date.now(),
        status: '1',
      };
    }
    return initialValues;
  };

  const { run, loading } = useRequest(onSubmit, {
    manual: true,
    onSuccess: () => {
      messageApi.success('操作成功');
      actionRef?.current?.reload();
    },
    onError: () => {
      messageApi.error('操作失败，请重试！');
    },
  });

  return (
    <>
      {contextHolder}
      <ModalForm
        form={form}
        title={title}
        trigger={trigger}
        width={720}
        disabled={title === '设备详情'}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        modalProps={{
          okButtonProps: { loading },
          destroyOnClose: true,
          footer: title === '设备详情' ? null : undefined,
        }}
        onOpenChange={(open) => {
          if (open) {
            form.setFieldsValue(getDefaultValues());
          }
        }}
        onFinish={async (value: API.AddVheDeviceParams) => {
          const params = {
            ...initialValues,
            ...value,
            inputBy: currentUser?.user.userId,
          };

          await run(params);

          return true;
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <ProFormText
              name="deviceSn"
              label="设备编码"
              placeholder="请输入设备编码"
              rules={[{ required: true, message: '请输入设备编码' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="deviceType"
              label="设备类型"
              placeholder="请选择设备类型"
              rules={[{ required: true, message: '请选择设备类型' }]}
              valueEnum={{
                0: '行车记录仪',
                1: 'GPS',
                2: '车载屏幕',
                3: '计算盒子',
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="deviceModel"
              label="设备型号"
              placeholder="请输入设备型号"
              rules={[{ required: true, message: '请输入设备型号' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="carPlate"
              label="车牌"
              placeholder="请选择车牌号"
              rules={[{ required: true, message: '请选择车牌号' }]}
              showSearch
              fieldProps={{
                virtual: true,
              }}
              request={async () => {
                const res = await getCarList({ tx: 0 });
                //@ts-expect-error
                return res.data.map((item) => ({
                  label: item.cphm,
                  value: item.cphm,
                }));
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormDatePicker
              name="installDate"
              label="安装日期"
              placeholder="请选择安装日期"
              disabled
              rules={[{ required: true, message: '请选择安装日期' }]}
              fieldProps={{
                format: 'YYYY-MM-DD',
                style: { width: '100%' },
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="inputBy"
              label="填报人"
              placeholder="请输入填报人"
              disabled
            />
          </Col>
          <Col span={24}>
            <ProFormRadio.Group
              name="status"
              label="使用状态"
              options={[
                { label: '正常', value: '1' },
                { label: '停用', value: '0' },
              ]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default CreateForm;
