import * as React from 'react';
import style from './main.module.less';
import {message as Msg} from 'antd';
import Search from './Search';
import TableList from './Table';
import request from 'src/utils/Request';

export interface IDataSourceProps {

}

export interface IDataSourceState {
	tableData: any[];
	selectRow: any[];
	searchName: any;
	pageValue: IPageValue
}
export interface IPageValue {
	currentPage: number;
	total: number;
	pageSize: number;
}

class DataSource extends React.Component<IDataSourceProps, IDataSourceState> {
	constructor(props) {
		super(props);
		this.state = {
			tableData: [],
			selectRow: [],
			searchName: undefined,
			pageValue: {
				currentPage: 1,
				pageSize: 10,
				total: 0
			}
		}
	}
	public componentDidMount(): void {
		this.getTableDataList();
	}

	public render() {
		return (
			<div className={style.container}>
				<Search searchName={this.state.searchName}
					changeSearchValue={this.changeSearchValue}
					changeCurrentPage={this.changeCurrentPage}
					selectRows={this.state.selectRow}
				/>
				<TableList tableData={this.state.tableData}
					changeSelectedRows={this.changeSelectedRows}
					pageValue={this.state.pageValue}
					changeCurrentPage={this.changeCurrentPage}
				/>
			</div>
		);
	}
	public async getTableDataList() {
		try {
			const params = {
				name: this.state.searchName,
				pageIndex: this.state.pageValue.currentPage,
				pageSize: this.state.pageValue.pageSize
			}
			const {status, message, data,total} = await request.post('/collection/info/DbSource/listSelect', params, {
				loading: true,
				loadingTitle: '获取数据列表中……'
			});
			let {pageValue, tableData} = this.state;
			if(status === 200) {
				tableData = data;
				pageValue.total = total;
			} else {
				tableData = [];
				pageValue.total = 0;
				Msg.warn(message)
			}
			this.setState({
				tableData,
				pageValue
			})
		} catch (e) {
			Msg.error('服务器错误');
		}
	}
	public changeSelectedRows = (rows: any[]) => {
		this.setState({
			selectRow: rows
		})
	}
	public changeSearchValue = (val: any) => {
		this.setState({
			searchName: val
		})
	}
	private changeCurrentPage = (page: number) => {
		const {pageValue} = this.state;
		pageValue.currentPage = page;
		this.setState({
			pageValue
		}, () => {
			this.getTableDataList();
		});
	}
}

export default DataSource;