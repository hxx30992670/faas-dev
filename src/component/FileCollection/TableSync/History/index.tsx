import React, {Component} from 'react';
import style from './style.module.less';
import {Table, message as Message} from 'antd';
import request from 'src/utils/Request';
import moment from 'moment';
export interface ITableHistoryProps {
	historyId: string|number;
}
export interface ITableHistoryState {
	tableData: any[],
	currentPage: number,
	total: number,
	pageSize: number
}
class TableHistory extends Component<ITableHistoryProps, ITableHistoryState> {
	constructor(props) {
		super(props);
		this.state = {
			tableData: [],
			currentPage: 1,
			total: 0,
			pageSize: 10
		}
		this.getTableDataList();
	}

	public render() {
		const pageSetting = {
			showTotal: (total) => {
				return `共计：${total}数据`;
			},
			current: this.state.currentPage,
			defaultPageSize: this.state.pageSize,
			total: this.state.total,
			hideOnSinglePage: true,
			onChange: (page: number) => {
				this.setState({
					currentPage: page
				}, () => {
					this.getTableDataList();
				})
			}
		}
		const column = [
			{
				title: '序号',
				dataIndex: 'index',
				render: (value, row, index) => {
					return (
						<span>{index+1}</span>
					)
				}
			},
			{
				title: '同步名称',
				dataIndex: 'syncName',
			},
			{
				title: '开始时间',
				dataIndex: 'startTime',
				render: value => (
					<span>{ value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : ''}</span>
				)
			},
			{
				title: '结束时间',
				dataIndex: 'stopTime',
				render: value => (
					<span>{value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : ''}</span>
				)
			},
			{
				title: '执行结果',
				dataIndex: 'status',
				render: (value: any) => {
					value = Number(value);
					if(value === 3){
						return <span>完成</span>
					} else {
						return <span style={{color: '#f56c86'}}>失败</span>
					}
				}
			},
			{
				title: '源端抽取数据量',
				dataIndex: 'readTotal'
			},
			{
				title: '目的端写入数据量',
				dataIndex: 'writeTotal'
			}
		]
		return (
			<div className={style.container}>
				<Table columns={column} bordered={true} dataSource={this.state.tableData} pagination={pageSetting} />
			</div>
		);
	}
	private getTableDataList = async () => {
		const params = {
			id: this.props.historyId,
			pageIndex: this.state.currentPage,
			pageSize: this.state.pageSize
		}
		try{
			const {data, status, message,total} = await request.post('/collection/data/sync/getHistory', params, {
				loading: true,
				loadingTitle: '正在获取历史执行列表数据……'
			});
			if(status === 200) {
				const tableData = data.map(item => {
					item.key = Math.random();
					return item;
				})
				this.setState({
					tableData,
					total
				});
			} else if(status === 204) {
				Message.warn('历史数据为空');
				this.setState({
					tableData: [],
					total: 0
				});
			} else {
				Message.warn(message);
			}
		}catch (e) {
			Message.error('服务器错误');
		}
	}
}

export default TableHistory;