import * as React from 'react';
import { Tabs, message as Message } from 'antd';
import Search from 'src/component/DataManager/DataList/search';
import TableList from 'src/component/DataManager/DataList/tableList';
import request from 'src/utils/Request';
//import style from './style.module.less';

export interface IDataListProps {
}

export interface IDataListState {
  activeTab: string,
  searchValue: ISearch,
  dataList: any[],
  pageObject: IPage
}

export interface ISearch {
  dataType: string | undefined;
  dataName: any;
  dateRang: any[]
}
export interface IPage {
  currentPage: number,
  total: number,
  pageSize: number
}

export default class DataList extends React.Component<IDataListProps, IDataListState> {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      searchValue: {
        dataType: undefined,
        dataName: undefined,
        dateRang: []
      },
      dataList: [],
      pageObject: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
    this.getDataList();
  }

  public render() {
    return (
      <div className={'main-container'}>
        <Tabs
          type='card'
          activeKey={this.state.activeTab}
        >
          <Tabs.TabPane
            key='1'
            tab='文件采集'
          >
            <div className='tabs-wrap'>
              <Search searchValue={this.state.searchValue} getDataList={this.getDataList} total={this.state.pageObject.total}
                changeSearchValue={this.changeSearchValue}
                resetSearch={this.resetScreen}
              />
              <TableList dataList={this.state.dataList} pageObject={this.state.pageObject} changePage={this.changePageData}
                getDataList={this.getDataList}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }

  public changeSearchValue = (key: string, value: any) => {
    const { searchValue } = this.state;
    searchValue[key] = value;
    this.setState({
      searchValue
    }, () => {
      if (key === 'dataType' || key === 'dateRang') {
        this.getDataList();
      }
    })
  }

  private getDataList = async () => {
    try {
      const params = {
        dataType: this.state.searchValue.dataType === '' ? null : this.state.searchValue.dataType,
        name: this.state.searchValue.dataName === '' ? null : this.state.searchValue.dataName,
        pageIndex: this.state.pageObject.currentPage,
        pageSize: this.state.pageObject.pageSize,
        startTime: null,
        endTime: null
      }
      if (this.state.searchValue.dateRang && this.state.searchValue.dateRang.length) {
        params.startTime = this.state.searchValue.dateRang[0];
        params.endTime = this.state.searchValue.dateRang[1];
      }

      const { status, data, message, total } = await request.post('/collection/info/Data/listSelect', params, {
        loading: true,
        loadingTitle: '数据列表加载中……'
      });
	    let { pageObject } = this.state;
	    pageObject.total = total || 0;
      if (status === 200) {
        this.setState({
          dataList: data,
          pageObject
        })
      } else if (status === 204) {
        Message.warning('数据列表为空');
        this.setState({
					dataList: [],
	        pageObject
        })
      } else {
        Message.warning(message);
      }
    } catch (e) {

    }
  }
  private changePageData = (num) => {
    const { pageObject } = this.state;
    pageObject.currentPage = num;
    this.setState({
      pageObject
    }, () => {
      this.getDataList();
    });
  }
  private resetScreen = () => {
  	const {pageObject} = this.state;
  	pageObject.currentPage = 1;
    this.setState({
      searchValue: {
        dataType: undefined,
        dataName: undefined,
        dateRang: []
      },
	    pageObject
    }, () => {
      this.getDataList();
    })
  }
}