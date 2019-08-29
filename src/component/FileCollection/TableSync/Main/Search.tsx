import React, {ChangeEvent, Component} from 'react';
import {Select, Input, Icon, Button} from 'antd';
import style from './style.module.less';
import {ISearch} from './index';

export interface ISearchProps {
	searchValue: ISearch;
	getTableSyncDataList: () => void;
	changeSearchValue: (value: ISearch, bOn?: boolean) => void;
	resetHandler: () => void
}

export interface ISearchState {
	selectStatus: number | undefined,
	syncName: string | undefined,
}

class Search extends Component<ISearchProps, ISearchState> {
	constructor(props) {
		super(props);
		this.state = {
			selectStatus: undefined,
			syncName: ''
		}
	}

	public render() {
		return (
			<div className={style.searchWrap}>
				<div className={style.left}>
					<div>
						<Select style={{width: 260}} value={this.props.searchValue.status}
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
						<Input.Search addonBefore={<Icon type='search'/>} enterButton='搜索'
              value={this.props.searchValue.syncName}
              placeholder='请输入名称进行搜索'
              onChange={this.changeDataName}
              style={{width: 350}}
              onSearch={this.props.getTableSyncDataList}
						/>
					</div>
				</div>
				<div className={style.right}>
					<Button type={'primary'} title={'新增'}>
						<Icon type="file-add" theme="filled" />
					</Button>
					<Button type='danger' title='删除'>
						<Icon type="delete" theme="filled" />
					</Button>
					<Button title={'刷新'} style={{background: '#a1a7b3', borderColor: '#a1a7b3'}} onClick={this.props.resetHandler}>
						<Icon type="redo" style={{color: '#fff'}} />
					</Button>
					<Button title='启动' style={{background: '#27ca8e', borderColor: '#27ca8e'}}>
						<Icon type="play-square" theme="filled" style={{color: '#fff'}} />
					</Button>
					<Button title='暂停' style={{background: '#f4ab37', borderColor: '#f4ab37'}}>
						<Icon type="pause-circle" theme="filled" style={{color: '#fff'}} />
					</Button>
				</div>
			</div>
		);
	}
	//搜索栏选择类型
	private selectStatus = (val) => {
		const {searchValue} = this.props;
		searchValue.status = val;
		this.props.changeSearchValue(searchValue, true);
	}
	private changeDataName = (e:ChangeEvent<HTMLInputElement>) => {
		const {searchValue} = this.props;
		searchValue.syncName = e.currentTarget.value;
		this.props.changeSearchValue(searchValue);
	}
}

export default Search;