import * as React from 'react';
import style from "../IntefaceRegister/style.module.less";
import {Tabs} from "antd";
import Main from 'src/component/FileCollection/TableSync/Main';

export interface ITableSyncProps {
}
export interface ITableSyncState {
	activeTab: string;
}

export default class TableSync extends React.Component<ITableSyncProps, ITableSyncState> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '1'
		}
	}

	public render() {
    return (
	    <div className={style.container}>
		    <Tabs
			    type='card'
			    activeKey={this.state.activeTab}
			    onChange={this.changeTab}
			    tabBarGutter={10}
		    >
			    <Tabs.TabPane
				    key='1'
				    tab='库表同步'
			    >
				    <div className='tabs-wrap'>
					    <Main {...this.props}/>
				    </div>
			    </Tabs.TabPane>
			    <Tabs.TabPane
			      key={'2'}
			      tab={'数据源管理'}
			    >
						<div className={'tabs-wrap'}>
							1232
						</div>
			    </Tabs.TabPane>
		    </Tabs>
	    </div>
    );
  }
  private changeTab = (val) => {
		this.setState({
			activeTab: val
		})
  }
}
