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
  dataType: string;
  dataName: string;
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
        dataType: '',
        dataName: '',
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
              <Search searchValue={this.state.searchValue} />
              <TableList dataList={this.state.dataList} pageObject={this.state.pageObject} />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
  private async getDataList() {
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
      if (status === 200) {
        let { pageObject } = this.state;
        pageObject.total = total;
        this.setState({
          dataList: data,
          pageObject
        })
      } else if (status === 204) {
        Message.warning('数据列表为空');
      } else {
        Message.warning(message);
      }
    } catch (e) {

    }
  }
}