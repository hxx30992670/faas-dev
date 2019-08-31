import * as React from 'react';
import {Steps, Icon} from 'antd';
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
				<Steps current={this.state.currentStep} onChange={this.changeStep} status={"error"}>
					<Steps.Step icon={<Icon type="setting" className={'bigSize'} style={{position: 'relative', top: -6}}/>}
					            title='1、配置数据库'/>
					<Steps.Step icon={<Icon type="setting" style={{position: 'relative', top: -6}}/>} title='2、配置同步策略'/>
					<Steps.Step icon={<Icon type="setting" style={{position: 'relative', top: -6}}/>} title='3、配置数据信息'/>
				</Steps>
			</div>
		);
	}

	private changeStep = (val) => {
  	this.setState({
		  currentStep: val
	  })
	}
}
