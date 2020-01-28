import React, { Component } from 'react';
import { Button, Table, Icon, Modal, message as Message } from 'antd';
import Detail from 'src/component/FileCollection/TableSync/Detail';
import request from 'src/utils/Request';
import TableHistory from '../History';
import TableSyncEdit from '../Edit';
import style from './style.module.less';
import { IPage } from './index';

export interface IDataListProps {
  dataList: any[],
  pageValue: IPage,
  changePage: (page: number) => void,
  changeRowHandler: (data: any[]) => void,
  selectedRow: any[],
  getDataList: () => void
}

export interface IDataListState {
  detailVisible: boolean;
  detailId: string | number;
  modalType: string;
  id: string;
}

class DataList extends Component<IDataListProps, IDataListState> {
  constructor(props) {
    super(props);
    this.state = {
      detailVisible: false,
      detailId: '',
      modalType: 'detail',
      id: ''
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
      },
    }
    const columns = [
      {
        title: '同步名称',
        dataIndex: 'syncName',
        key: 'syncName',
        render: (value, row) => (
          <Button type='link'
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
            return <span style={{ color: '#F4AB37' }}>失败</span>
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
          <Button type='link' onClick={this.showHistory.bind(this, row)}>查看</Button>
        )
      },
      {
        title: '操作',
        key: 'operation',
        render: (row) => {
          return (
            <div style={{ display: 'flex' }}>
              {
                row.status === 1 ?
                  <Button type='link'
                    size='small'
                    style={{ color: 'rgb(244, 171, 55)' }}
                    title={'重试'}
                    onClick={this.startTableSync.bind(this, row)}
                  >
                    <Icon type='undo'
                      className={'bigSize'} />
                  </Button> : row.status === 2 ?
                    <Button type='link'
                      size='small'
                      style={{ color: 'rgb(245, 108, 134)' }}
                      title={'停止'}
                      onClick={this.stopTableSync.bind(this, row)}
                    >
                      <Icon type='stop'
                        className={'bigSize'} />
                    </Button> :
                    row.status === 3 || row.status === 4 || row.status === 5 ?
                      <Button type='link'
                        size='small'
                        style={{ color: 'rgb(39, 202, 142)' }}
                        title={'启动'}
                        onClick={this.startTableSync.bind(this, row)}
                      >
                        <Icon type='play-circle'
                          className={'bigSize'} />
                      </Button> : ''
              }
              {
                row.status !== 2 ?
                  <Button size='small'
                    type='link'
                    title={'编辑'}
                    style={{ color: '#4887ED' }}
                    onClick={this.editTable.bind(this, row)}
                  >
                    <Icon type='edit'
                      className={'bigSize'} />
                  </Button> : ''
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
          rowKey='id'
          pagination={{ ...pageSetting, position: 'bottom' }}
          rowSelection={rowSelection}
        />
        <Modal visible={this.state.detailVisible}
          title={this.state.modalType === 'detail' ? '库表同步详情' : this.state.modalType === 'edit' ? '编辑库表同步' : '历史执行'}
          footer={null}
          onCancel={this.closeDetail}
          width={this.state.modalType === 'history' ? '70%' : '50%'}
          destroyOnClose={true}
          maskClosable={false}
        >
          {
            this.state.modalType === 'detail' ? <Detail id={this.state.detailId} /> : this.state.modalType === 'edit' ?
              <TableSyncEdit id={this.state.detailId} closeModal={this.editCloseModal} getDataList={this.props.getDataList} /> :
              <TableHistory historyId={this.state.id} />
          }
        </Modal>
      </div>
    );
  }
  private showHistory = (row) => {
    this.setState({
      modalType: 'history',
      detailVisible: true,
      id: row.id
    });
  }
  private startTableSync = (row) => {
    Modal.confirm({
      title: '启动库表同步',
      content: `是否确认启动${row.syncName}?`,
      okText: '确定',
      icon: <Icon type='question' className={'bigSize'} />,
      cancelText: '取消',
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const { status, message } = await request.post('/collection/data/sync/startTask', { ids: [row.id] }, {
              loading: true,
              loadingTitle: `${row.syncName}启动中……`
            });
            if (status === 200) {
              Message.success('启动成功');
              this.props.getDataList();
              resolve('成功');
            } else {
              Message.warn(message);
              reject(message);
            }
          } catch (e) {
            Message.error('服务器错误');
          }
        });
      },
      onCancel: () => {

      }
    })
  }
  private stopTableSync = (row) => {
    Modal.warning({
      title: '停止库表同步',
      content: `是否要停止${row.syncName}`,
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const { status, message } = await request.post('/collection/data/sync/stopTask', { ids: [row.id] }, {
              loading: true,
              loadingTitle: `正在停止${row.syncName}中……`
            });
            if (status === 200) {
              Message.success('停止成功');
              this.props.getDataList();
              resolve()
            } else {
              Message.warn(message);
              reject();
            }
          } catch (e) {
            Message.error('服务器错误');
          }
        })
      }
    })
  }
  private editCloseModal = (callBack?: () => void) => {
    this.setState({
      detailVisible: false
    }, () => {
      if (callBack && typeof callBack === 'function') {
        callBack();
      }
    })
  }

  private editTable = (row) => {
    this.setState({
      detailVisible: true,
      detailId: row.dataId,
      modalType: 'edit'
    })
  }
  private showDetails = (row) => {
    this.setState({
      detailVisible: true,
      detailId: row.dataId,
      modalType: 'detail'
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