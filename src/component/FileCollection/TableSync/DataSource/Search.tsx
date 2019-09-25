import * as React from 'react';
import style from './main.module.less';
import {Input, Icon, Button, Modal, message as Msg} from "antd";
import {ChangeEvent} from "react";
import request from 'src/utils/Request';
import NewDataSource from "./NewDataSource";

export interface ISearchProps {
	searchName: any;
	selectRows: any[];
	changeSearchValue: (value: any) => void;
	changeCurrentPage: (page: number) => void;
}

export interface ISearchState {
	visible: boolean
}

class Search extends React.Component<ISearchProps, ISearchState> {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		}
	}

	public render() {
		return (
			<div className={style.searchWrap}>
				<div className={style.searchMain}>
					<Input.Search prefix={<Icon type={'search'} />} enterButton={'搜索'} placeholder={'请输入数据源名称'}
						value={this.props.searchName}
						onChange={this.changeInputSearch}
						onSearch={this.searchList}
					/>
					<p className={style.searchResult}>找到相关搜索结果26条</p>
				</div>
				<div className={style.buttonWrap}>
					<Button type='primary' title={'新增'} onClick={this.openNewAdd}>
						<Icon type='file-add' />
					</Button>
					<Button type='danger' title={'删除'} onClick={this.deleteSelected}>
						<Icon type='delete' />
					</Button>
					<Button title={'刷新'} onClick={this.reloadData}>
						<Icon type='reload' />
					</Button>
				</div>
				<Modal
					visible={this.state.visible}
					title={'新建数据源'}
					destroyOnClose={true}
					footer={null}
					onCancel={this.closeNewAdd}
					width={'50%'}
				>
					<NewDataSource />
				</Modal>
			</div>
		);
	}
	public changeInputSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		this.props.changeSearchValue(value);
	}
	private searchList = () => {
		this.props.changeCurrentPage(1);
	}
	private reloadData = () => {
		this.props.changeSearchValue(undefined);
		this.props.changeCurrentPage(1);
	}
	private deleteSelected = ():any => {
		const {selectRows} = this.props;
		console.log(selectRows);
		if(!selectRows.length) {
			return Msg.warn('请选择要删除的数据');
		}
		Modal.confirm({
			title: '删除',
			content: `是否确定删除选中的${selectRows.length}条数据？`,
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				return new Promise(async (resolve, reject) => {
					try {
						const idList = selectRows.map(item => item.id);
						const {status, message} = await request.post('/collection/info/DbSource/delete', {
							idList
						}, {
							loading: true,
							loadingTitle: '删除数据中……'
						});
						if(status === 200) {
							Msg.success('删除完成');
							resolve('删除完成');
						} else {
							Msg.warn(message);
							reject(message);
						}
					} catch (e) {

					}
				})
			}
		})
	}
	private openNewAdd = () => {
		this.setState({
			visible: true
		})
	}
	private closeNewAdd = () => {
		this.setState({
			visible: false
		})
	}
}

export default Search;