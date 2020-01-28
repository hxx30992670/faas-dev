import * as React from 'react';
import style from './main.module.less';
import { Button, Table, Pagination } from 'antd';
import moment from 'moment';

export interface ITableListProps {
	tableData: any[],
	total: number;
	pageSize: number;
	pageIndex: number;
	changePage: (page: number) => void;
}

export interface ITableListState {

}

class TableList extends React.Component<ITableListProps, ITableListState> {
	public render() {
		const columns = [
			{
				title: '治理名称',
				dataIndex: 'name'
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				render: value => (
					<span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>
				)
			},
			{
				title: '治理类型',
				dataIndex: 'allowDatabase',
				render: (value: boolean, row: any) => {
					if (row.allowDatabase && !row.allowApi) {
						return <span>库表</span>
					} else if (!row.allowDatabase && row.allowApi) {
						return <span>接口</span>
					} else {
						return <span>接口/库表</span>
					}
				}
			},
			{
				title: '最后运行时间',
				dataIndex: 'lastRunTime',
				render: (value: any) => (
					<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
				)
			},
			{
				title: '日志',
				key: 'logs',
				width: 80,
				render: (value: any, row: any) => (
					<Button style={{ padding: 0 }} type='link' onClick={this.showLogs.bind(this, row)}>详情</Button>
				)
			},
			{
				title: '运行次数',
				dataIndex: 'runTimes',
				width: 100
			},
			{
				title: '质量报告',
				key: 'qualityReport',
				width: 100,
				render: (value: any, row: any) => (
					<Button type='link' style={{ padding: 0 }} onClick={this.showReport.bind(this, row)}>查看</Button>
				)
			},
			{
				title: '运行结果',
				key: 'runResult',
				width: 100,
				render: (value: any, row: any) => (
					<Button type='link' style={{ padding: 0 }} onClick={this.showRunResult.bind(this, row)}>查看</Button>
				)
			},
			{
				title: '治理时间策略',
				dataIndex: 'syncCycle',
				render: (value: string) => (
					<span>{value === 'MANUAL' ? '手动' : '自动'}</span>
				)
			},
			{
				title: '当前状态',
				dataIndex: 'status',
				render: (value: number, row: any) => {
					if (value === 0) {
						return <span style={{ color: '#27ca8e' }}>{row.statusString}</span>
					} else if (value === -1) {
						return <span style={{ color: '#f4ab37' }}>{row.statusString}</span>
					} else {
						return <span>{row.statusString}</span>
					}
				}
			},
			{
				title: '操作',
				key: 'operation',
				render: (value: any, row: any) => {
					if (row.status === 0) {
						return (
							<div>
								<Button type='link' style={{ padding: 0, marginRight: 20 }}>启动</Button>
								<Button type='link' style={{ padding: 0 }}>编辑</Button>
							</div>
						)
					} else if (row.status === -1) {
						return (
							<div>
								<Button type='link' style={{ padding: 0 }}>编辑</Button>
							</div>
						)
					} else if (row.status === 2) {
						return (
							<div>
								<Button type='link' style={{ padding: 0 }}>停止</Button>
							</div>
						)
					} else {
						return ''
					}
				}
			}
		];
		return (
			<div className={style.tableWrap}>
				<Table
					columns={columns}
					dataSource={this.props.tableData}
					rowKey={'id'}
					className={'custom-table'}
					bordered={true}
					pagination={false}
				/>
				<div className={style.pageBox}>
					<Pagination
						hideOnSinglePage={true}
						total={this.props.total}
						pageSize={this.props.pageSize}
						current={this.props.pageIndex}
						onChange={this.changePage}
						showQuickJumper={true}
						showTotal={(total, sum) => (
							`共计：${total}条数据`
						)}
					/>
				</div>
			</div>
		);
	}
	private changePage = (page: number) => {
		this.props.changePage(page);
	}
	private showLogs = (row: any) => {
		console.log(row);
	}
	private showReport = (row: any) => {
		console.log(row);
	}
	private showRunResult = (row: any) => {
		console.log(row);
	}
}

export default TableList;