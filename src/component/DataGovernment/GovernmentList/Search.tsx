import * as React from 'react';
import style from './main.module.less';
import { Button, Icon, Input } from 'antd';
import { ChangeEvent } from 'react';


export interface ISearchProps {
	searchValue: any;
	changeSearchValue: (value: any) => void;
	changeCurrentPage: (page: number) => void;
	newAdd: () => void
}

export interface ISearchState {

}

class Search extends React.Component<ISearchProps, ISearchState> {
	public render() {
		return (
			<div className={style.searchWrap}>
				<div className={style.left}>
					<div>
						<Input.Search addonBefore={<Icon type='search' />} enterButton='搜索'
							value={this.props.searchValue}
							placeholder='请输入名称进行搜索'
							onChange={this.changeInputValue}
							onSearch={this.searchTableData}
						/>
					</div>
				</div>
				<div className={style.right}>
					<Button type='primary' title='新建' onClick={this.props.newAdd}>
						<Icon type='file-add' />
					</Button>
					<Button type='default' title='刷新' onClick={this.reloadTableList}>
						<Icon type='redo' />
					</Button>
				</div>
			</div>
		);
	}
	private changeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
		this.props.changeSearchValue(e.currentTarget.value);
	}
	private searchTableData = () => {
		this.props.changeCurrentPage(1);
	}
	private reloadTableList = async () => {
		await this.props.changeSearchValue(undefined);
		this.props.changeCurrentPage(1);
	}
}

export default Search;