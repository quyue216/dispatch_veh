import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import styles from './index.less';

interface FooterProps {
  /** 是否使用反转色（白色文字，用于深色背景） */
  inverted?: boolean;
}

const Footer: React.FC<FooterProps> = ({ inverted = false }) => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
        color: inverted ? '#fff' : 'rgba(0, 0, 0, 0.85)',
      }}
      copyright="浦发养护集团 车辆调度平台"
      links={[]}
      className={inverted ? styles.loginFooter : undefined}
    />
  );
};

export default Footer;
