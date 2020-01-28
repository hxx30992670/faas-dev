import * as React from 'react';
import style from './style.module.less';
import {IPage} from 'src/views/DataManager/DataManager/DataList/index';
import {Table, Button, Icon, Modal, message as Message} from 'antd';
import {ColumnProps} from 'antd/es/table';
import {connect} from 'react-redux';
import {IStoreType} from 'src/types/index';
import {Dispatch} from 'redux';
import {changeSelectList} from 'src/actions';
import request from 'src/utils/Request';
import Detail from '../Detail'
import Logs from '../Logs';

export interface ITableListProps {
	dataList: any[],
	pageObject: IPage,
	changePage: (num: number) => void,
	changeSelectList: (payload: any[]) => void,
	getDataList: () => void

}

export interface ITableListState {
	selectRows: any[],
	detailVisible: boolean;
	dataId: string | number;
	syncNum: any;
	saveNum: any;
	modalType: string,
	id: any,
	dataType: any;
}

interface IData {
	id: string,
	name: string,
	description: string,
	dataType: number,
	subName: string,
	syncNum: number,
	dataSize: number,
	createTime: string,
}

const mapStateToProps = (state: IStoreType) => ({
	selectList: state.selectList
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	changeSelectList: (payload: any[]) => dispatch(changeSelectList(payload))
})

class TableList extends React.Component<ITableListProps, ITableListState> {
	constructor(props) {
		super(props);
		this.state = {
			selectRows: [],
			detailVisible: false,
			dataId: '',
			syncNum: '',
			saveNum: '',
			modalType: 'detail',
			id: '',
			dataType: ''
		}
	}

	public render() {
		const columns: Array<ColumnProps<IData>> = [
			{
				title: '数据名称',
				dataIndex: 'name',
				key: 'name'
			},
			{
				title: '数据描述',
				dataIndex: 'description',
				key: 'description'
			},
			{
				title: '数据类型',
				dataIndex: 'dataType',
				render: text => <span>{text === 1 ? '文件' : text === 2 ? '接口' : text === 3 ? '库表' : '数据协同'}</span>
			},
			{
				title: '所属目录',
				dataIndex: 'subName',
			},
			{
				title: '数据存储条数',
				dataIndex: 'syncNum',
				key: 'syncNum',
				render: (text, record) => (
					record.dataType === 1 || record.dataType === 3 ?
						<span className={record.syncNum === 0 ? style.tips : '' + ` ${style.span}`}
							onClick={this.showLogs.bind(this, record)}>{text}</span> : <span>-</span>
				)
			},
			{
				title: '数据存储量',
				dataIndex: 'dataSize',
			},
			{
				title: '创建时间',
				dataIndex: 'createTime'
			},
			{
				title: '操作',
				key: 'operation',
				render: (text, record) => {
					return (
						<div className={style.opeartionBox}>
							<Button type='link' title='查看' onClick={this.showDataDetail.bind(this, record)}>
								<Icon type='eye'/>
							</Button>
							<Button type='link' title='删除' onClick={this.deleteCurrentData.bind(this, record)}>
								<Icon type='delete'/>
							</Button>
						</div>
					)
				}
			}
		];
		const rowSelection = {
			onChange: (selectRowKeys, selectRows) => {
				this.setState({
					selectRows
				}, () => {
					this.props.changeSelectList(this.state.selectRows);
				})
			}
		}
		const pageSetting = {
			showTotal: (total) => {
				return `共计：${total}数据`;
			},
			current: this.props.pageObject.currentPage,
			defaultPageSize: this.props.pageObject.pageSize,
			total: this.props.pageObject.total,
			hideOnSinglePage: false,
			onChange: (page: number) => {
				this.props.changePage(page);
			}
		}
		return (
			<div className={style.tableWrap}>
				<Table pagination={pageSetting} rowKey='id' columns={columns} dataSource={this.props.dataList}
					rowSelection={rowSelection}
				/>
				<Modal
					visible={this.state.detailVisible}
					title={this.state.modalType === 'detail' ? '数据详情' : '入库日志'}
					width='50%'
					footer={null}
					destroyOnClose={true}
					onCancel={this.closeDataDetail}
				>
					{
						this.state.modalType === 'detail' ?
							<Detail id={this.state.dataId} syncNum={this.state.syncNum} saveNum={this.state.saveNum}/> :
							<Logs id={this.state.dataId} dataType={this.state.dataType} errorClose={this.closeDataDetail} />
					}
				</Modal>
			</div>
		);
	}

	private showLogs(record: IData) {
		this.setState({
			dataId: record.id,
			detailVisible: true,
			modalType: 'log',
			dataType: record.dataType
		});
	}

	private closeDataDetail = () => {
		this.setState({
			detailVisible: false
		})
	}
	private showDataDetail = (row: any) => {
		this.setState({
			dataId: row.id,
			detailVisible: true,
			syncNum: row.syncNum,
			saveNum: row.dataSize,
			modalType: 'detail'
		});
	}
	private deleteCurrentData = (record: any, e: MouseEvent) => {

		try {
			Modal.confirm({
				title: '删除',
				content: '确认是否删除该条数据？',
				okText: '确认',
				cancelText: '取消',
				onOk: () => {
					return new Promise(async (resolve, reject) => {
						const id = record.id;
						const params = {
							idList: [id]
						}
						const {message, status} = await request.post('/collection/info/Data/delete', params, {
							loading: true,
							loadingTitle: '删除中……'
						});
						if (status === 200) {
							Message.success('删除成功');
							this.props.getDataList();
							resolve();
						} else {
							Message.warning(message);
							reject();
						}
					})
				}
			});
		} catch (e) {
			Message.warning('取消删除');
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableList)
