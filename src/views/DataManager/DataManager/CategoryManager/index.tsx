import * as React from 'react';
import style from './style.module.less';
import {Tabs} from 'antd';
import DataCategory from "../../../../component/DataManager/CategoryManager/DataManager";

export interface ICategoryManagerProps {
}
export interface ICategoryManagerState {
	activeKey: string;
}

export default class CategoryManager extends React.Component<ICategoryManagerProps, ICategoryManagerState> {
	constructor(props) {
		super(props);
		this.state = {
			activeKey: '1'
		}
	}

	public render() {
    return (
      <div className={style.container}>
        <Tabs type='card' activeKey={this.state.activeKey} onChange={this.changeTabs}>
					<Tabs.TabPane key={'1'} tab={'数据目录'}>
						<DataCategory />
					</Tabs.TabPane>
	        <Tabs.TabPane key={'2'} tab={'服务目录'}>
		        34343243
	        </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
  private changeTabs = (val) => {
		this.setState({
			activeKey: val
		})
  }
}
