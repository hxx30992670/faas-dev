import * as React from 'react';
import {Tabs} from 'antd';
import style from './style.module.less';
import InterfaceForm from "../../../../component/FileCollection/InterfaceForm";

export interface IInterfaceRegisterProps {
}

export interface IInterfaceRegisterState {
	activeTab: string;
}

export default class InterfaceRegister extends React.Component<IInterfaceRegisterProps, IInterfaceRegisterState> {
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
				>
					<Tabs.TabPane
						key='1'
						tab='接口注册'
					>
						<div className='tabs-wrap'>
							<InterfaceForm {...this.props} />
						</div>
					</Tabs.TabPane>
				</Tabs>
			</div>
		);
	}
}

