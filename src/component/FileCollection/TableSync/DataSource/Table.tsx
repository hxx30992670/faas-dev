import * as React from 'react';
import {Button, Pagination, Table, message as Msg} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import style from './main.module.less';
import {IPageValue} from './index';
import request from 'src/utils/Request';

export interface ITableProps {
	tableData: any[];
	changeSelectedRows: (rows: any[]) => void;
	pageValue: IPageValue;
	changeCurrentPage: (page: number) => void;
}

export interface ITableState {

}

interface ITableColumn {
	name: string;
	dbType: string | number;
	host: string;
	port: string;
	databaseName: string;
	account: string;
	createTime: string;

}

class TableList extends React.Component<ITableProps, ITableState> {
	public render() {
		const columns: Array<ColumnProps<ITableColumn>> = [
			{
				title: '名称',
				dataIndex: 'name'
			},
			{
				title: '数据源类型',
				dataIndex: 'dbType',
				render: (value, row) => (
					<span>
						{
							value === 1 ? 'Mysql' : value === 2 ? 'Oracle' : 'PostgreSQL'
						}
					</span>
				)
			},
			{
				title: '数据库地址',
				dataIndex: 'host'
			},
			{
				title: '端口',
				dataIndex: 'port'
			},
			{
				title: '数据库名称',
				dataIndex: 'databaseName'
			},
			{
				title: '用户名',
				dataIndex: 'account'
			},
			{
				title: '创建时间',
				dataIndex: 'createTime'
			},
			{
				title: '操作',
				width: 80,
				key: 'operation',
				render: (value, row) => (
					<Button type='link' onClick={this.testDatabase.bind(this, row)}>测试</Button>
				)
			}
		];
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.props.changeSelectedRows(selectedRows);
			}
		};
		return (
			<div className={style.tableWrap}>
				<Table<ITableColumn> columns={columns} dataSource={this.props.tableData}
					bordered={true}
					rowKey='id'
					rowSelection={rowSelection}
					pagination={false}
					className={'custom-table'}
				/>
				<div className={style.pageWrap}>

					<Pagination
						showQuickJumper={true}
						current={this.props.pageValue.currentPage}
						total={this.props.pageValue.total}
						onChange={this.changePage}
					/>

				</div>
			</div>
		);
	}

	private changePage = (val: number) => {
		this.props.changeCurrentPage(val);
	}
	private testDatabase = async(row) => {
		const params = {
			dbType: row.dbType,
			host: row.host,
			port: Number(row.port),
			databaseName: row.databaseName,
			user: row.account,
			pwd: row.password,
			version: row.dbVersion,
			schemaName: row.schemaName
		}
		try {
			const {status} = await request.post('/collection/data/database/testConnection', params, {
				loading: true,
				loadingTitle: '测试中……'
			});
			if(status === 200) {
				Msg.success('验证通过');
			} else {
				Msg.error('验证失败');
			}
		} catch (e) {
			Msg.error('服务器错误');
		}
	}
}

export default TableList;