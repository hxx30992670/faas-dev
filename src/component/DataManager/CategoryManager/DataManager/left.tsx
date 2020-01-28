import React, { ChangeEvent, Component } from 'react';
import style from './style.module.less';
import { Input, Icon, message as Message, Tree, Button, Modal } from 'antd';
import request from 'src/utils/Request';
import EditAndNew from './EditAndNew';
import EditChild from './NewChildCategory'

const { TreeNode } = Tree;


export interface ILeftMainProps {

}

export interface ILeftMainState {
	searchValue: string;
	unPublishData: any[];
	autoExpanded: boolean;
	keyList: any[];
	expandedKeys: any[];
	categoryList: any[];
	categoryExpandedKeys: any[];
	categoryKeyList: any[];
	visible: boolean;
	isAddCategory: boolean;
	id: any;
	name: string;
	childEdit: boolean;
	currentChild: any
}

class LeftMain extends Component<ILeftMainProps, ILeftMainState> {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: '',
			unPublishData: [],
			expandedKeys: [],
			autoExpanded: false,
			keyList: [],
			categoryList: [],
			categoryExpandedKeys: [],
			categoryKeyList: [],
			visible: false,
			isAddCategory: false,
			id: '',
			name: '',
			childEdit: false,
			currentChild: {}
		}
	}

	public componentDidMount(): void {
		this.unPublishedCategory();
		this.getCategoryTree();
	}

	public onExpand = expandedKeys => {
		this.setState({
			expandedKeys,
			autoExpanded: false,
		});
	};
	public onExpandCategory = expandedKeys => {
		this.setState({
			categoryExpandedKeys: expandedKeys,
			autoExpanded: false,
		});
	};

	public render() {
		const { searchValue, expandedKeys, autoExpanded, categoryExpandedKeys, categoryList } = this.state;
		const loop = (data, key: string) => {
			const resultData = data.map(item => {
				const index = item.name.indexOf(searchValue);
				const beforeStr = item.name.substr(0, index);
				const afterStr = item.name.substr(index + searchValue.length);
				const title =
					index > -1 ? (
						<div className={style.treeItem} onMouseEnter={this.showEditBtn.bind(this, item, key)}
							onMouseLeave={this.hideEditBtn.bind(this, item, key)}
						>
							<span>
								{beforeStr}
								<span style={{ color: '#f50' }}>{searchValue}</span>
								{afterStr}
							</span>
							{
								item.isShow ? <span>
									{
										key === 'un' ?
											<Button type='link' size='small' disabled={item.childNode && item.childNode.length}
												onClick={this.editCategory.bind(this, item)}
											> 编辑</Button> : ''
									}
									<Button type='link' size='small' onClick={this.removeCategory.bind(this, item)}> 删除</Button>
								</span> : ''
							}
						</div>
					) : (
							<div className={style.treeItem} onMouseEnter={this.showEditBtn.bind(this, item, key)}
								onMouseLeave={this.hideEditBtn.bind(this, item, key)}
							>
								<span>
									{item.name}
								</span>
								{
									item.isShow ? <span>
										{
											key === 'un' ?
												<Button type='link' size='small' disabled={item.childNode && item.childNode.length}> 编辑</Button> : ''
										}
										<Button type='link' size='small' onClick={this.removeCategory.bind(this, item)}> 删除</Button>
									</span> : ''
								}
							</div>
						);
				if (item.childNode && item.childNode.length) {
					return (
						<TreeNode key={item.id} title={title}>
							{loop(item.childNode, key)}
						</TreeNode>
					);
				}
				return <TreeNode key={item.id} title={title} selectable={false} />;
			});
			return resultData;
		}

		return (
			<div>
				<div className={style.searchWrap}>
					<Input value={this.state.searchValue} onChange={this.changeSearchValue}
						placeholder={'请输入关键词'}
						prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
					/>
				</div>
				<div className={style.categoryWrap}>
					<div className={style.title}>未发布的目录</div>
					<Tree onExpand={this.onExpand}
						expandedKeys={expandedKeys}
						autoExpandParent={autoExpanded}
						style={{ maxHeight: 350, overflowY: 'auto' }}
					>
						{loop(this.state.unPublishData, 'un')}
					</Tree>
				</div>
				<div className={style.categoryWrap}>
					<div className={style.title}>已发布的目录</div>
					<Tree onExpand={this.onExpandCategory}
						expandedKeys={categoryExpandedKeys}
						autoExpandParent={autoExpanded}
						style={{ maxHeight: 350, overflowY: 'auto' }}
					>
						{loop(categoryList, 'category')}
					</Tree>
				</div>
				<Modal
					title={this.state.isAddCategory ? '新增数据目录' : '编辑数据目录'}
					visible={this.state.visible}
					footer={null}
					onCancel={this.closeEditCategory}
					destroyOnClose={true}
				>
					<EditAndNew type={this.state.isAddCategory} name={this.state.name} id={this.state.id}
						closeModal={this.closeEditCategory}
						getDirList={this.getDirList}
					/>
				</Modal>
				<Modal
					title='编辑子目录'
					visible={this.state.childEdit}
					footer={null}
					onCancel={this.closeEditChild}
					destroyOnClose={true}
					width='55%'
				>
					<EditChild
						closeModal={this.closeEditChild}
						getDirList={this.getDirList}
						editOrNew={true}
						currentNode={this.state.currentChild}
					/>
				</Modal>
			</div>
		);
	}
	private closeEditChild = () => {
		this.setState({
			childEdit: false
		});
	}
	//删除目录
	private removeCategory = (item) => {
		Modal.confirm({
			title: '删除',
			content: '是否确认要删除该目录',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				return new Promise(async (resolve, reject) => {
					try {
						const params = {
							id: item.id
						}
						const { status, message } = await request.post('/collection/info/DirectoryRoot/delete', params, {
							loading: true,
							loadingTitle: '删除中……'
						});
						if (status === 200) {
							Message.success('删除成功');
							this.unPublishedCategory();
							this.getCategoryTree();
							resolve();
						} else {
							Message.warn(message);
							reject(message);
						}
					} catch (e) {
						reject();
					}
				});
			}
		})
	}

	private showEditBtn = (item, key: string) => {
		if (key === 'un') {
			const { unPublishData } = this.state;
			let data = this.findData(item.id, unPublishData, true);
			this.setState({
				unPublishData: data
			})
		} else {
			const { categoryList } = this.state;
			let data = this.findData(item.id, categoryList, true);
			this.setState({
				categoryList: data
			})
		}
	}
	private hideEditBtn = (item, key: string) => {
		if (key === 'un') {
			const { unPublishData } = this.state;
			let data = this.findData(item.id, unPublishData, false);
			this.setState({
				unPublishData: data
			})
		} else {
			const { categoryList } = this.state;
			let data = this.findData(item.id, categoryList, false);
			this.setState({
				categoryList: data
			})
		}
	}
	private findData = (id, data: any[], value: boolean): any[] => {
		try {
			data.forEach(item => {
				if (item.id === id) {
					item.isShow = value;
					throw new Error();
				} else {
					//item.isShow = !value;
					if (item.childNode && item.childNode.length) {
						this.findData(id, item.childNode, value);
					}
				}
			});
		} catch (e) {

		}
		return data;
	}
	private editCategory = (row: any) => {
		if (row.rootId || row.rootName) {
			this.setState({
				childEdit: true,
				currentChild: row
			});
		} else {
			this.setState({
				visible: true,
				isAddCategory: false,
				id: row.id,
				name: row.name
			})
		}
	}
	private closeEditCategory = () => {
		this.setState({
			visible: false
		})
	}
	private changeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget;
		let { categoryExpandedKeys, categoryList } = this.state;
		let expandedKeys = this.state.keyList.map(item => {
			if (value && item.name.includes(value)) {
				return this.findPrimary(item.id, this.state.unPublishData);
			} else {
				return null;
			}
		}).filter((item, i, self) => item && self.indexOf(item) === i);
		categoryExpandedKeys = this.state.categoryKeyList.map(item => {
			if (value && item.name.includes(value)) {
				return this.findPrimary(item.id, categoryList);
			} else {
				return null;
			}
		}).filter((item, i, self) => item && self.indexOf(item) === i);
		this.setState({
			searchValue: value,
			autoExpanded: true,
			expandedKeys,
			categoryExpandedKeys
		});
	}
	private findPrimary = (key: string, data: any[]): string => {
		let primaryKey: any = '';
		data.forEach((item, index) => {
			if (item.childNode && item.childNode.length) {
				let isYes = item.childNode.some(child => child.id === key);
				if (isYes) {
					primaryKey = item.id;
				} else if (this.findPrimary(key, item.childNode)) {
					primaryKey = this.findPrimary(key, item.childNode);
				}
			}
		});
		return primaryKey;
	}
	private unPublishedCategory = async () => {
		try {
			const { status, data, message } = await request.post('/collection/info/DirectoryRoot/listAllData', {
				isPutaway: 0,
				searchValue: ''
			}, { loading: true, loadingTitle: '获取未发布目录中……' });
			if (status === 200) {
				let newArray = this.getKeyList([], data);
				this.setState({
					unPublishData: data,
					keyList: newArray
				});
			} else {
				Message.warn(message);
			}
		} catch (e) {
			Message.error('服务器错误');
		}
	}
	private getCategoryTree = async () => {
		try {
			const { status, data, message } = await request.post('/collection/info/DirectoryRoot/listAllData', {
				isPutaway: 1,
				searchValue: ''
			}, {
				loading: true,
				loadingTitle: '获取目录树中……'
			});
			if (status === 200) {
				let newArray = this.getKeyList([], data);
				this.setState({
					categoryList: data,
					categoryKeyList: newArray
				})
			} else {
				Message.warn(message);
			}
		} catch (e) {
			Message.error('服务器错误');
		}
	}
	private getDirList = async () => {
		this.unPublishedCategory();
		this.getCategoryTree();
		this.closeEditCategory();
	}
	private getKeyList = (newArray: any[], data: any[]): any[] => {
		data.forEach((item, index) => {
			newArray.push(item);
			if (item.childNode && item.childNode.length) {
				this.getKeyList(newArray, item.childNode);
			}
		});
		return newArray;
	}
}

export default LeftMain;