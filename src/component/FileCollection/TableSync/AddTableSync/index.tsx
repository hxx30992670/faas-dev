import * as React from 'react';
import { Steps, Icon } from 'antd';
import style from './style.module.less';

export interface IAddTableSyncProps {
}
export interface IAddTableSyncState {
  currentStep: number;
}

export default class AddTableSync extends React.Component<IAddTableSyncProps, IAddTableSyncState> {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
    }
  }

  public render() {
    return (
      <div className={style.container}>
        <Steps current={this.state.currentStep}>
          <Steps.Step icon={<Icon type="setting" />} title='1、配置数据库' />
          <Steps.Step icon={<Icon type="setting" />} title='2、配置同步策略' />
          <Steps.Step icon={<Icon type="setting" />} title='3、配置数据信息' />
        </Steps>
      </div>
    );
  }
}
