import * as React from 'react';
import style from './main.module.less';
import { Tabs, message as Msg } from 'antd';
import Search from 'src/component/DataGovernment/GovernmentList/Search';
import TableList from '../../../../component/DataGovernment/GovernmentList/TableList';
import request from 'src/utils/Request';
import GovernmentMain from 'src/component/DataGovernment/GovernmentList/GovernmentMain';


export interface IGovernmentListProps {
	test: number;
}
export interface IGovernmentListState {
	activeTab: string;
	searchValue: any;
	pageIndex: number;
	pageSize: number;
	total: number;
	tableData: any[];
	showGovernment: boolean;
	governmnetTitle: string;
}
//const _defaultProps = { test: 1 };
export default class GovernmentList extends React.Component<IGovernmentListProps, IGovernmentListState> {
	public static defaultProps = {
		test: 1
	};
	constructor(props: IGovernmentListProps) {
		super(props);
		this.state = {
			activeTab: '1',
			searchValue: undefined,
			pageIndex: 1,
			pageSize: 10,
			total: 0,
			tableData: [],
			showGovernment: false,
			governmnetTitle: '新增数据治理'
		}
	}

	public componentDidMount(): void {
		this.getDataList();
	}

	public render() {
		return (
			<div className={style.container}>
				<Tabs
					type='editable-card'
					activeKey={this.state.activeTab}
					tabBarGutter={10}
					onChange={this.changeTabs}
					onEdit={this.onEdit}
					hideAdd={true}
				>
					<Tabs.TabPane
						key={'1'}
						tab={'治理列表'}
						closable={false}
					>
						<div className='tabs-wrap'>
							<Search
								searchValue={this.state.searchValue}
								changeSearchValue={this.changeSearchValue}
								changeCurrentPage={this.changeCurrentPage}
								newAdd={this.newAddGrvernment}
							/>
							<TableList
								tableData={this.state.tableData}
								total={this.state.total}
								pageSize={this.state.pageSize}
								pageIndex={this.state.pageIndex}
								changePage={this.changeCurrentPage}
							/>
						</div>
					</Tabs.TabPane>
					{
						this.state.showGovernment ?
							<Tabs.TabPane
								key='2'
								tab={this.state.governmnetTitle}
								closable={true}
							>
								<GovernmentMain />
							</Tabs.TabPane>
							: ''
					}
				</Tabs>
			</div>
		);
	}
	private onEdit = (targetKey, action) => {
		if (action === 'remove') {
			this.remove(targetKey);
		}
	}
	private remove = (targetKey: any) => {
		this.setState({
			showGovernment: false,
			activeTab: '1'
		});
	}
	private changeTabs = (val: any) => {
		this.setState({
			activeTab: val
		});
	}
	private newAddGrvernment = () => {
		this.setState({
			showGovernment: true,
			governmnetTitle: '新增数据治理',
			activeTab: '2'
		});
	}
	private changeSearchValue = (value: any) => {
		this.setState({
			searchValue: value
		})
	}
	private getDataList = async () => {
		try {
			const params = {
				pageIndex: this.state.pageIndex,
				pageSize: this.state.pageSize,
				name: this.state.searchValue
			}
			const { status, data, message, total } = await request.get('/processing-core/processing/getProcessingListByPages', params, {
				loading: true,
				loadingTitle: '获取治理列表数据中……'
			});
			if (status === 200) {
				this.setState({
					tableData: data,
					total
				});
			} else if (status === 204) {
				this.setState({
					tableData: [],
					total: 0
				});
				Msg.warn('没有获取到相关数据');
			} else {
				Msg.warn(message);
			}
		} catch (e) {
			Msg.error('服务器错误');
		}
	}
	private changeCurrentPage = (page: number) => {
		this.setState({
			pageIndex: page
		}, () => {
			this.getDataList();
		})
	}
}
