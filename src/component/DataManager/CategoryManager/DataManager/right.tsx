import * as React from 'react';
import style from './style.module.less';
import { Tabs } from "antd";
import CategoryCreate from "./CategoryCreate";
import CategoryPublish from './CategoryPublish';

export interface IRightProps {
	leftComponent: any
}

export interface IRightState {
	tabActive: string;
}

class Right extends React.Component<IRightProps, IRightState> {
	constructor(props) {
		super(props);
		this.state = {
			tabActive: '1'
		}
	}

	public render() {
		return (
			<div className={style.right}>
				<Tabs activeKey={this.state.tabActive} onChange={this.changeTab}>
					<Tabs.TabPane tab={'目录创建'} key={'1'}>
						<div className={style.tabPanel}>
							<CategoryCreate leftComponent={this.props.leftComponent} />
						</div>
					</Tabs.TabPane>
					<Tabs.TabPane tab={'目录发布'} key={'2'}>
						<div className={style.tabPanel}>
							<CategoryPublish leftComponent={this.props.leftComponent} />
						</div>
					</Tabs.TabPane>
					<Tabs.TabPane tab={'发布记录'} key={'3'}>
						1
					</Tabs.TabPane>
				</Tabs>
			</div>
		);
	}
	private changeTab = (val) => {
		console.log(val);
		this.setState({
			tabActive: val
		})
	}
}

export default Right;