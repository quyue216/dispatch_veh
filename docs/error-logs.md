# 开发错误记录

本文档记录开发过程中遇到的问题及解决方案，避免重复踩坑。

---

## 2026-03-31: ModalForm initialValues 不生效问题

### 问题描述

在列表页面使用 `ModalForm` 进行编辑操作时，点击"修改"按钮打开弹窗，`initialValues` 传入的数据没有正确回显到表单中。

### 错误代码

```tsx
// 父组件
<CreateForm
  key={prop.title}  // key 固定不变
  initialValues={{ ...selectedRowsState[0] }}
  {...prop}
/>

// 子组件 CreateForm.tsx
const CreateForm: FC<CreateFormProps> = (props) => {
  const { initialValues = {} } = props;

  // 直接修改 props 中的对象
  if (title === '新增设备台账') {
    Object.assign(initialValues, fromDefault);
  }

  return (
    <ModalForm
      initialValues={initialValues}  // 只在首次挂载时生效
      // ...
    />
  );
};
```

### 原因分析

1. **React key 机制**：组件的 `key` 固定时，React 会复用组件实例而不是重新挂载，导致 `initialValues` 不会更新。

2. **ModalForm 特性**：`ModalForm` 的 `initialValues` 只在组件首次挂载时生效，之后即使 props 变化也不会重新设置表单值。

3. **错误地修改 props**：使用 `Object.assign(initialValues, fromDefault)` 直接修改了 props 对象，这是 React 反模式。

### 解决方案

1. **动态 key**：让 key 包含选中行的唯一标识，选中行变化时强制组件重新挂载：

```tsx
<CreateForm
  key={prop.title === '修改设备台账'
    ? `edit-${selectedRowsState[0]?.deviceSn}`
    : prop.title
  }
  {...prop}
/>
```

2. **使用 form 实例 + onOpenChange**：更可靠的方案是使用 `form.setFieldsValue()` 在弹窗打开时设置值：

```tsx
const CreateForm: FC<CreateFormProps> = (props) => {
  const { initialValues = {} } = props;
  const [form] = Form.useForm();

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

  return (
    <ModalForm
      form={form}
      onOpenChange={(open) => {
        if (open) {
          form.setFieldsValue(getDefaultValues());
        }
      }}
      // ...
    />
  );
};
```

### 经验总结

| 场景 | 推荐方案 |
|------|----------|
| 表单数据需要每次打开时更新 | 使用 `form` 实例 + `onOpenChange` + `setFieldsValue` |
| 组件需要根据数据完全重置 | 使用动态 `key` 强制重新挂载 |
| 设置默认值 | 不要修改 props，应该返回新对象 |

### 相关文档

- [Ant Design ModalForm 文档](https://procomponents.ant.design/components/modal-form)
- [React key 机制](https://react.dev/learn/rendering-lists#why-does-react-need-keys)
