import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message, Space } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import {
  addVheDevice as addList,
  updateVheDevice as editList,
  getCarList,
  getDeviceSnList,
  listVheDevice as getList,
  delVheDevice as removeListItem,
} from '@/services/ant-design-pro/device';
import CreateForm from './components/CreateForm';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  const [selectedRowsState, setSelectedRows] = useState<API.VheDeviceItem[]>(
    [],
  );

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun } = useRequest(removeListItem, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();

      messageApi.success('删除成功，即将刷新');
    },
    onError: () => {
      messageApi.error('删除失败，请重试');
    },
  });

  const columns: ProColumns<API.VheDeviceItem>[] = [
    {
      title: '设备编码',
      dataIndex: 'deviceSn',
      align: 'center',
      copyable: true,
      valueType: 'select',
      request: async () => {
        const res = await getDeviceSnList();
        return (res.data || []).map((item) => ({
          label: item.deviceSn,
          value: item.deviceSn,
        }));
      },
      fieldProps: {
        placeholder: '请选择设备编码',
        showSearch: true,
        virtual: true,
      },
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      align: 'center',
      valueEnum: {
        0: { text: '行车记录仪' },
        1: { text: 'GPS' },
        2: { text: '车载屏幕' },
        3: { text: '计算盒子' },
      },
      fieldProps: {
        placeholder: '请选择设备类型',
      },
    },

    {
      title: '设备型号',
      dataIndex: 'deviceModel',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '使用车牌',
      dataIndex: 'carPlate',
      align: 'center',
      order: 1,
      valueType: 'select',
      request: async () => {
        const res = await getCarList({ tx: 0 }); // 调用 API
        //@ts-expect-error
        return res.data.map((item) => ({
          label: item.cphm,
          value: item.cphm,
        }));
      },
      fieldProps: {
        placeholder: '请输入车牌号',
        showSearch: true,
        virtual: true,
      },
      formItemProps: {
        label: '车牌', // 自定义查询表单的 label（覆盖 title）
      },
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        0: { text: '禁用', status: 'Default' },
        1: { text: '启用', status: 'Success' },
      },
      fieldProps: {
        placeholder: '请选择启用状态',
      },
      formItemProps: {
        label: '启用状态',
      },
    },
    {
      title: '安装日期',
      dataIndex: 'installDate',
      align: 'center',
      valueType: 'dateTime',
      fieldProps: {
        placeholder: '请选择安装时间',
      },
      formItemProps: {
        label: '安装时间',
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <CreateForm
            initialValues={record}
            trigger={<a key="edit">编辑</a>}
          ></CreateForm>
          <a key="delete" onClick={() => handleRemove([record as any])}>
            删除
          </a>
        </Space>
      ),
    },
  ];

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: API.RuleListItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');

        return;
      }

      await delRun(selectedRows.join(','));
    },
    [delRun, messageApi.warning],
  );

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.VheDeviceItem, API.PageParams>
        actionRef={actionRef}
        headerTitle={[
          <Space key="toolbar">
            {(
              [
                {
                  title: '新增设备台账',
                  trigger: (
                    <Button type="primary" icon={<PlusOutlined />}>
                      新建
                    </Button>
                  ),
                  onSubmit: addList,
                  initialValues: {},
                },
                {
                  title: '修改设备台账',
                  trigger: (
                    <Button
                      disabled={selectedRowsState.length !== 1}
                      icon={<EditOutlined />}
                    >
                      修改
                    </Button>
                  ),
                  initialValues: { ...selectedRowsState[0] },
                  onSubmit: editList,
                },
              ] as const
            ).map((prop) => {
              return (
                <CreateForm
                  key={
                    prop.title === '修改设备台账'
                      ? `edit-${selectedRowsState[0]?.deviceSn}`
                      : prop.title
                  }
                  {...prop}
                  reload={actionRef.current?.reload}
                />
              );
            })}
          </Space>,
        ]}
        rowKey="deviceSn"
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
        }}
        request={async (params) => {
          const { pageSize, current, ...rest } = params;

          const queryParams = {
            ...rest,
            pageSize,
            pageNum: current,
          };

          const res = await getList(queryParams);
          return {
            data: res.rows,
            total: res.total,
            success: res.code === 200,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    </PageContainer>
  );
};

export default TableList;
