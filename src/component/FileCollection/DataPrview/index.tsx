import * as React from 'react';
import style from "./style.module.less";
import {Table} from 'antd';

export interface IDataPrviewProps {
  dataList: any[],
  tableHeader: any[],
}

export default class DataPrview extends React.Component<IDataPrviewProps> {
  public render() {
    const columns = this.props.tableHeader.map((item: string) => {
      return {
        title: item,
        dataIndex: item,
        key: Math.random(),
      }
    })
    return (
      <div className={style.container}>
        <Table columns={columns} dataSource={this.props.dataList} bordered={true} pagination={false} />
      </div>
    );
  }
}
