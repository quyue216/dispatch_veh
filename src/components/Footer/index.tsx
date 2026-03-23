import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import styles from './index.less';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="浦发养护集团 车辆调度平台"
      links={[]}
      className={styles.loginFooter}
    />
  );
};

export default Footer;
