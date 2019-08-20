import * as React from 'react';
import {Tabs} from 'antd';
import style from './style.module.less';
import FileForm from 'src/component/FileCollection/FileForm/index';

export interface IFileCollectionProps {
}
export interface IFileCollectionState {
  activeTab: string;
}

export default class App extends React.Component<IFileCollectionProps,IFileCollectionState> {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1"
    }
  }
  
  public render() {
    return (
      <div className={style.container}>
        <Tabs
          type='card'
          activeKey={this.state.activeTab}
        >
          <Tabs.TabPane
            key='1'
            tab='文件采集'
          >
            <div className='tabs-wrap'>
              <FileForm />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
