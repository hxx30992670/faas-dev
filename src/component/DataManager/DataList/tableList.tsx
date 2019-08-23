import * as React from 'react';
import style from './style.module.less';
import { IPage } from 'src/views/DataManager/DataManager/DataList/index';
import { Table } from 'antd';

export interface ITableListProps {
  dataList: any[],
  pageObject: IPage
}
export interface ITableListState {
  selectRows: any[]
}


export default class TableList extends React.Component<ITableListProps, ITableListState> {
  constructor(props) {
    super(props);
    this.state = {
      selectRows: []
    }
  }
  public render() {
    console.log(this.props.dataList);
    const pageSetting = {
      showTotal: (total) => {
        return `共计：${total}数据`;
      },
      defaultCurrent: this.props.pageObject.currentPage,
      defaultPageSize: this.props.pageObject.pageSize,
      total: this.props.pageObject.total
    }
    return (
      <div className={style.tableWrap}>
        <Table pagination={pageSetting} />
      </div>
    );
  }
}
