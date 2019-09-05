import React, { ChangeEvent, Component } from 'react';
import { Select, Input, Icon, Button, Modal, message as Message} from 'antd';
import style from './style.module.less';
import { ISearch } from './index';
import AddTableSync from '../AddTableSync';
import request from 'src/utils/Request';

export interface ISearchProps{
	searchValue: ISearch;
	getTableSyncDataList: () => void;
	changeSearchValue: (value: ISearch, bOn?: boolean) => void;
	resetHandler: () => void,
	selectedRow: any[],
	getDataList: () => void
}

export interface ISearchState {
	selectStatus: number | undefined,
	syncName: string | undefined,
	newTableSyncVisible: boolean;
}

class Search extends Component<ISearchProps, ISearchState> {
	constructor(props) {
		super(props);
		this.state = {
			selectStatus: undefined,
			syncName: '',
			newTableSyncVisible: false
		}
	}

	public render() {
		return (
			<div className={style.searchWrap}>
				<div className={style.left}>
					<div>
						<Select style={{ width: 260 }} value={this.props.searchValue.status}
							placeholder={'请选择当前状态'}
							onChange={this.selectStatus}
							allowClear={true}
						>
							<Select.Option value={1}>失败</Select.Option>
							<Select.Option value={2}>运行中</Select.Option>
							<Select.Option value={3}>已停止</Select.Option>
							<Select.Option value={4}>准备完毕</Select.Option>
							<Select.Option value={5}>同步完成</Select.Option>
							<Select.Option value={6}>同步中</Select.Option>
						</Select>
					</div>
					<div>
						<Input.Search addonBefore={<Icon type='search' />} enterButton='搜索'
							value={this.props.searchValue.syncName}
							placeholder='请输入名称进行搜索'
							onChange={this.changeDataName}
							style={{ width: 350 }}
							onSearch={this.props.getTableSyncDataList}
						/>

					</div>
				</div>
				<div className={style.right}>
					<Button type={'primary'} title={'新增'} onClick={this.openNewTableSync}>
						<Icon type="file-add" theme="filled" />
					</Button>
					<Button type='danger' title='删除' onClick={this.deleteRows}>
						<Icon type="delete" theme="filled" />
					</Button>
					<Button title={'刷新'} style={{ background: '#a1a7b3', borderColor: '#a1a7b3' }} onClick={this.props.resetHandler}>
						<Icon type="redo" style={{ color: '#fff' }} />
					</Button>
					<Button title='启动' style={{ background: '#27ca8e', borderColor: '#27ca8e' }} onClick={this.startMoreTable}>
						<Icon type="play-square" theme="filled" style={{ color: '#fff' }} />
					</Button>
					<Button title='暂停' style={{ background: '#f4ab37', borderColor: '#f4ab37' }} onClick={this.stopMoreTable}>
						<Icon type="pause-circle" theme="filled" style={{ color: '#fff' }} />
					</Button>
				</div>
				<Modal
					visible={this.state.newTableSyncVisible} title='新建库表同步'
	        maskClosable={false}
					width={'60%'}
					destroyOnClose={true}
					onCancel={this.closeAddTableSync}
					footer={null}
				>
					<AddTableSync closeAddTableSync={this.closeAddAndGetData} />
				</Modal>
			</div>
		);
	}
	private closeAddAndGetData = () => {
		this.closeAddTableSync();
		this.props.getTableSyncDataList();
	}
	//搜索栏选择类型
	private selectStatus = (val) => {
		const { searchValue } = this.props;
		searchValue.status = val;
		this.props.changeSearchValue(searchValue, true);
	}
	private changeDataName = (e: ChangeEvent<HTMLInputElement>) => {
		const { searchValue } = this.props;
		searchValue.syncName = e.currentTarget.value;
		this.props.changeSearchValue(searchValue);
	}
	private openNewTableSync = () => {
		this.setState({
			newTableSyncVisible: true
		})
	}
	private closeAddTableSync = () => {
		this.setState({
			newTableSyncVisible: false
		})
	}
	private stopMoreTable = () => {
		if(!this.props.selectedRow.length) {
			Message.warning('请选择要停止的数据');
			return;
		}
		const {selectedRow, getDataList} = this.props;
		Modal.confirm({
			title: '启动',
			content: `是否确定要停止选中的${selectedRow.length}条数据`,
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				return new Promise(async (resolve, reject) => {
					try {
						const ids = selectedRow.map(item => item.id);
						const {status, message} = await request.post('/collection/data/sync/stopTask', {
							ids
						}, {
							loading: true,
							loadingTitle: `停止中……`
						});
						if(status === 200) {
							Message.success('停止成功');
							getDataList();
							resolve('成功');
						} else {
							Message.warn(message);
							reject(message);
						}
					}catch (e) {
						Message.error('服务器错误');
					}
				})
			}
		})
	}
	private startMoreTable = () => {
		if(!this.props.selectedRow.length) {
			Message.warning('请选择要启动的数据');
			return;
		}
		const {selectedRow, getDataList} = this.props;
		Modal.confirm({
			title: '启动',
			content: `是否确定要启动选中的${selectedRow.length}条数据`,
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				return new Promise(async (resolve, reject) => {
					try {
						const ids = selectedRow.map(item => item.id);
						const {status, message} = await request.post('/collection/data/sync/startTask', {
							ids
						}, {
							loading: true,
							loadingTitle: `启动中……`
						});
						if(status === 200) {
							Message.success('启动成功');
							getDataList();
							resolve('成功');
						} else {
							Message.warn(message);
							reject(message);
						}
					}catch (e) {
						Message.error('服务器错误');
					}
				})
			}
		})
	}
	private deleteRows = () => {
		if(!this.props.selectedRow.length) {
			Message.warning('请选择要删除的数据');
			return;
		}
		const {selectedRow, getDataList} = this.props;
		Modal.confirm({
			title: '删除提示',
			content: `是否确定要删除选中的${selectedRow.length}条数据！`,
			okText: '确定',
			cancelText: '取消',
			onOk: async () => {
				return new Promise(async (resolve, reject) => {
					try{
						let ids = selectedRow.map(item => item.dataId);
						const {message, status} = await request.post('/collection/info/Data/delete', {idList: ids}, {
							loading: true,
							loadingTitle: '正在删除数据中'
						});
						if(status === 200) {
							Message.success('删除数据成功');
							getDataList();
							resolve();
						}else {
							Message.error(message);
							reject('错误');
						}
					}catch (e) {
						reject('错误')
					}
				});
			},
			onCancel: () => {
				Message.info('取消删除');
			}
		})
	}
}

export default Search;