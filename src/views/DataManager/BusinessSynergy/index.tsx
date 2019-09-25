import * as React from 'react';
import style from "./style.module.less";
import {Tabs} from "antd";import FormData from 'src/component/FileCollection/BusinessSynergy/FormData';
import {RouteComponentProps} from "react-router-dom";

export interface IBusinessSynergyProps extends RouteComponentProps{

}

export interface IBusinessSynergyState {
	activeTab: string;
}

class Index extends React.Component<IBusinessSynergyProps, IBusinessSynergyState> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '1'
		}
	}

	public render() {
		console.log(this.props);
		return (
			<div className={style.container}>
				<Tabs
					type='card'
					activeKey={this.state.activeTab}
				>
					<Tabs.TabPane
						key='1'
						tab='业务协同'
					>
						<div className='tabs-wrap'>
							<FormData {...this.props}  />
						</div>
					</Tabs.TabPane>
				</Tabs>
			</div>
		);
	}
}

export default Index;