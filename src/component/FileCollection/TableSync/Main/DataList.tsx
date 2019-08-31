import React, {Component} from 'react';
import {Button, Table, Icon, Modal} from "antd";
import Detail from "src/component/FileCollection/TableSync/Detail";
import style from './style.module.less';
import {IPage} from './index';

export interface IDataListProps {
  dataList: any[],
  pageValue: IPage,
  changePage: (page: number) => void,
  changeRowHandler: (data: any[]) => void,
  selectedRow: any[]
}

export interface IDataListState {
  detailVisible: boolean;
  detailId: string | number;
}

class DataList extends Component<IDataListProps, IDataListState> {
  constructor(props) {
    super(props);
    this.state = {
      detailVisible: false,
      detailId: ''
    }
  }

  public render() {
    //console.log(this.props.dataList);
    const pageSetting = {
      showTotal: (total) => {
        return `共计：${total}数据`;
      },
      current: this.props.pageValue.currentPage,
      defaultPageSize: this.props.pageValue.pageSize,
      total: this.props.pageValue.total,
      hideOnSinglePage: true,
      onChange: (page: number) => {
        this.props.changePage(page);
      }
    }
    const columns = [
      {
        title: '同步名称',
        dataIndex: 'syncName',
        key: 'syncName',
        render: (value, row) => (
          <Button type="link"
            onClick={this.showDetails.bind(this, row)}>{value}</Button>
        )
      },
      {
        title: '数据名称',
        dataIndex: 'dataName',
        key: 'dataName',
      },
      {
        title: '数据源',
        dataIndex: 'dbSourceName'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime'
      },
      {
        title: '同步类型',
        dataIndex: 'syncType',
        width: 100,
        render: (value) => {
          if (value === 1) {
            return <span>全量同步</span>
          } else {
            return <span>增量同步</span>
          }
        }
      },
      {
        title: '同步策略',
        dataIndex: 'syncStrategy'
      },
      {
        title: '运行次数',
        dataIndex: 'successSizes',
        width: 100,
        render: (value, row) => (
          <span>{value + row.defeatedSizes}</span>
        )
      },
      {
        title: '失败/成功/手动停止次数',
        width: 180,
        dataIndex: 'defeatedSizes',
        render: (value, row) => (
          <span>
						{row.successSizes + '/' + value + '/' + row.stopSizes}
					</span>
        )
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        render: (value) => {
          if (value === 1) {
            return <span style={{color: '#F4AB37'}}>失败</span>
          } else if (value === 2) {
            return <span>运行中</span>
          } else if (value === 3) {
            return <span>已停止</span>
          } else if (value === 4) {
            return <span>装备完毕</span>
          } else if (value === 5) {
            return <span>同步完成</span>
          } else {
            return <span>同步中</span>
          }
        }
      },
      {
        title: '最后一次执行时间',
        dataIndex: 'lastExecuteTime',
        width: 160
      },
      {
        title: '历史执行',
        dataIndex: 'historyRun',
        render: (value, row) => (
          <Button type="link">查看</Button>
        )
      },
      {
        title: '操作',
        key: 'operation',
        render: (row) => {
          return (
            <div style={{display: 'flex'}}>
              {
                row.status === 1 ?
                  <Button type="link"
                    size="small"
                    style={{color: 'rgb(244, 171, 55)'}}>
                    <Icon type="undo"
                      className={'bigSize'} />
                  </Button> : row.status === 2 ?
                  <Button type="link"
                    size="small"
                    style={{color: 'rgb(245, 108, 134)'}}>
                    <Icon type="stop"
                      className={'bigSize'} />
                  </Button> :
                  row.status === 3 || row.status === 4 || row.status === 5 ?
                    <Button type="link"
                      size="small"
                      style={{color: 'rgb(39, 202, 142)'}}><Icon type="play-circle"
                      className={'bigSize'} /></Button> : ''
              }
              {
                row.status !== 2 ?
                  <Button size="small"
                    type="link"
                    style={{color: '#4887ED'}}><Icon type="edit"
                    className={'bigSize'} /></Button> : ''
              }
            </div>
          )
        }
      }
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.props.changeRowHandler(selectedRows);
      }
    }
    return (
      <div className={style.tableWrap}>
        <Table bordered={true}
          columns={columns}
          dataSource={this.props.dataList}
          rowKey="id"
          pagination={pageSetting}
          rowSelection={rowSelection}
        />
        <Modal visible={this.state.detailVisible}
          title="库表同步详情"
          footer={null}
          onCancel={this.closeDetail}
          width="50%"
          destroyOnClose={true}
          maskClosable={false}
        >
          <Detail id={this.state.detailId} />
        </Modal>
      </div>
    );
  }

  private showDetails = (row) => {
    this.setState({
      detailVisible: true,
      detailId: row.dataId
    });
  }
  private closeDetail = () => {
    this.setState({
      detailVisible: false,
      detailId: ''
    })
  }
}

export default DataList;