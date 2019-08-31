import React, {Component} from 'react';
import style from './style.module.less';
import Search from './Search';
import DataList from "./DataList";
import {message as Message} from "antd";
import request from 'src/utils/Request';

export interface ITableSyncMainProps {

}

export interface ITableSyncMainState {
  dataList: any[],
  searchValue: ISearch,
  pageValue: IPage,
  selectedRow: any[]
}

export interface ISearch {
  status: string | undefined,
  syncName: string | undefined
}

export interface IPage {
  currentPage: number;
  pageSize: number;
  total: number;
}

class TableSyncMain extends Component<ITableSyncMainProps, ITableSyncMainState> {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      searchValue: {
        status: undefined,
        syncName: '',
      },
      pageValue: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selectedRow: []
    }
    this.getTableSyncDataList();
  }

  public render() {
    return (
      <div className={style.container}>
        <Search getTableSyncDataList={this.getTableSyncDataList}
          searchValue={this.state.searchValue}
          changeSearchValue={this.changeSearchHandler}
          resetHandler={this.resetHandler}
          selectedRow={this.state.selectedRow}
          getDataList={this.getTableSyncDataList}
        />
        <DataList pageValue={this.state.pageValue}
          dataList={this.state.dataList}
          changePage={this.changePageNumber}
          selectedRow={this.state.selectedRow}
          changeRowHandler={this.changeRowHandler}
        />
      </div>
    );
  }

  public getTableSyncDataList = async () => {
    try {
      const params = {
        status: this.state.searchValue.status,
        syncName: this.state.searchValue.syncName,
        pageIndex: this.state.pageValue.currentPage,
        pageSize: this.state.pageValue.pageSize
      }
      const {status, data, message, total} = await request.post('/collection/info/DbSync/listSelect', params, {
        loading: true,
        loadingTitle: '获取库表同步数据中……'
      });
      if (status === 200) {
        let {pageValue} = this.state;
        pageValue.total = total;
        this.setState({
          dataList: data,
          pageValue
        })
      } else if (status === 204) {
        Message.warning('无数据');
        let {pageValue} = this.state;
        pageValue.total = 0;
        this.setState({
          dataList: [],
          pageValue
        })
      } else {
        Message.warning(message);
      }
    } catch (e) {
      Message.error('服务器错误');
    }
  }
  public changePageNumber = (page: number) => {
    let {pageValue} = this.state;
    pageValue.currentPage = page;
    this.setState({
      pageValue
    }, () => {
      this.getTableSyncDataList();
    })
  }
  public changeSearchHandler = (value: ISearch, bOn?: boolean) => {
    this.setState({
      searchValue: value
    }, () => {
      if (bOn) {
        this.getTableSyncDataList();
      }
    })
  }
  //刷新
  public resetHandler = () => {
    let {pageValue, searchValue} = this.state;
    pageValue.currentPage = 1;
    searchValue.status = undefined;
    searchValue.syncName = '';
    this.setState({
      pageValue,
      searchValue
    }, () => {
      this.getTableSyncDataList();
    })
  }
  public changeRowHandler = (data: any[]) => {
    this.setState({
      selectedRow: data
    })
  }
}

export default TableSyncMain;