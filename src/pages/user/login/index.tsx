import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, useModel } from '@umijs/max';
import { Alert, App } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import type { Except } from 'type-fest';
import logoImg from '@/assets/logo.png';
import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/login';
import { setToken } from '@/utils/auth';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  console.log('🚀 ~ token:', token);
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('/login-back.jpg')",
      backgroundSize: '100% 100%',
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  type LoginState = Except<API.LoginResult, 'data'>;
  const [userLoginState, setUserLoginState] = useState<LoginState>({
    code: 200,
    msg: null,
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    console.log('🚀 ~ handleSubmit ~ values:', values);
    try {
      // 登录
      const msg = await login({ ...values });
      console.log('🚀 ~ handleSubmit ~ msg:', msg);
      if (msg.code === 200) {
        message.success('登录成功！');
        setToken(msg.data.access_token);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      console.log(error);
      // message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          登录页
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 0',
        }}
      >
        <div style={{ width: 400 }}>
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            containerStyle={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: '32px 40px 16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              width: 'fit-content',
              height: 'fit-content',
            }}
            logo={<img alt="logo" src={logoImg} />}
            title={
              <span style={{ fontSize: 36, fontWeight: 700 }}>
                浦发养护集团
              </span>
            }
            subTitle={<span style={{ fontSize: 18 }}>车辆调度平台</span>}
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
          >
            {userLoginState.code !== 200 && (
              <LoginMessage content="账户或密码错误" />
            )}
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </div>
          </LoginForm>
        </div>
      </div>
      <Footer inverted />
    </div>
  );
};

export default Login;
