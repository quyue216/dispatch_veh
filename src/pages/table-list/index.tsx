import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { Except } from 'type-fest';
import {
  listVheDevice as getList,
  delVheDevice as removeListItem,
} from '@/services/ant-design-pro/device';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun, loading } = useRequest(removeListItem, {
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

  const columns: ProColumns<API.AddVheDeviceParams>[] = [
    {
      title: '设备编码',
      dataIndex: 'deviceSn',
      copyable: true,
    },
    {
      title: '车牌号',
      dataIndex: 'carPlate',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      valueEnum: {
        1: { text: 'GPS定位器' },
        2: { text: '行车记录仪' },
        3: { text: '油耗监测仪' },
      },
    },
    {
      title: '设备型号',
      dataIndex: 'deviceModel',
    },
    {
      title: '安装时间',
      dataIndex: 'installDate',
      valueType: 'date',
    },
    {
      title: '填报人',
      dataIndex: 'inputBy',
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '禁用', status: 'Default' },
        1: { text: '启用', status: 'Success' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <UpdateForm
          trigger={<a>编辑</a>}
          key="edit"
          onOk={actionRef.current?.reload}
          values={record}
        />,
        <a key="delete" onClick={() => handleRemove([record as any])}>
          删除
        </a>,
      ],
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
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm key="create" reload={actionRef.current?.reload} />,
        ]}
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
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
              &nbsp;&nbsp;
              <span>
                服务调用总计{' '}
                {selectedRowsState.reduce(
                  (pre, item) => pre + (item.callNo ?? 0),
                  0,
                )}{' '}
                万
              </span>
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
