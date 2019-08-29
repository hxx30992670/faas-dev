import React, {Component} from 'react';
import {Button, Table, Icon} from "antd";
import style from './style.module.less';
import {IPage} from './index';

export interface IDataListProps {
	dataList: any[],
	pageValue: IPage,
	changePage: (page: number) => void
}
export interface IDataListState {

}
class DataList extends Component<IDataListProps, IDataListState> {
	public render() {
		//console.log(this.props.dataList);
		const pageSetting = {
			showTotal: (total) => {
				return `共计：${total}数据`;
			},
			current: this.props.pageValue.currentPage,
			defaultPageSize: this.props.pageValue.pageSize,
			total: this.props.pageValue.total,
			hideOnSinglePage: true,
			onChange: (page: number) => {
				this.props.changePage(page);
			}
		}
		const columns = [
			{
				title: '同步名称',
				dataIndex: 'syncName',
				key: 'syncName',
				render: (value) => (
					<Button type='link'>{value}</Button>
				)
			},
			{
				title: '数据名称',
				dataIndex: 'dataName',
				key: 'dataName'
			},
			{
				title: '数据源',
				dataIndex: 'dbSourceName'
			},
			{
				title: '创建时间',
				dataIndex: 'createTime'
			},
			{
				title: '同步类型',
				dataIndex: 'syncType',
				render: (value) => {
					if(value === 1) {
						return <span>全量同步</span>
					}else {
						return  <span>增量同步</span>
					}
				}
			},
			{
				title: '同步策略',
				dataIndex: 'syncStrategy'
			},
			{
				title: '运行次数',
				dataIndex: 'successSizes',
				render: (value, row) => (
					<span>{value + row.defeatedSizes}</span>
				)
			},
			{
				title: '失败/成功/手动停止次数',
				dataIndex: 'defeatedSizes',
				render: (value, row) => (
					<span>
						{ row.successSizes + '/' + value + '/' + row.stopSizes}
					</span>
				)
			},
			{
				title: '当前状态',
				dataIndex: 'status',
				render: (value) => {
					if(value === 1) {
						return <span>失败</span>
					} else if(value === 2) {
						return <span>运行中</span>
					} else if(value === 3) {
						return <span>已停止</span>
					} else if(value === 4) {
						return <span>装备完毕</span>
					} else if(value === 5) {
						return <span>同步完成</span>
					} else {
						return <span>同步中</span>
					}
				}
			},
			{
				title: '最后一次执行时间',
				dataIndex: 'lastExecuteTime'
			},
			{
				title: '历史执行',
				dataIndex: 'historyRun',
				render: (value, row) => (
					<Button type='link'>查看</Button>
				)
			},
			{
				title: '操作',
				key: 'operation',
				width: 120,
				render: (row) => {
					return (
						<div style={{display: 'flex'}}>
							{
								row.status === 1 ? <Button type='link'><Icon type="undo" /></Button> : row.status === 2 ?
								<Button type='link'><Icon type="stop" /></Button> :
								row.status === 3 || row.status === 4 || row.status === 5 ?
								<Button type='link'><Icon type="play-circle" /></Button> : ''
							}
							{
								row.status !== 2 ? <Button type='link'><Icon type="edit" /></Button> : ''
							}
						</div>
					)
					/*if(row.status === 1) {
						return <Button type='link'>重试</Button>
					} else if( row.status === 2) {
						return <Button type='link'>停止</Button>
					} else if(row.status === 3 || row.status === 4 || row.status === 5) {
						return  <Button type='link'>启动</Button>
					} else {
						return  "";
					}
					if(row.status !== 2) {
						return <Button type='link'>编辑</Button>
					} else {
						return  "";
					}*/

				}
			}
		]
		return (
			<div className={style.tableWrap}>
				<Table bordered={true} columns={columns} dataSource={this.props.dataList} rowKey='id' pagination={pageSetting} />
			</div>
		);
	}
}

export default DataList;