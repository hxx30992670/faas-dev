import * as React from 'react';
import style from './publishRecord.module.less';
import { Table, message as Msg, notification, Icon, Pagination, Button } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import request from 'src/utils/Request';

export interface IPublishRecordProps {
}
export interface IPublishRecordState {
  tableList: any[],
  currentPage: number;
  pageSize: number;
  total: number;
}
interface IColumn {
  id: any;
  key?: any;
  name: string;
  createTime: string;
  auditResult: string;
  rootName: string;
  reason?: any
}
export default class PublishRecord extends React.Component<IPublishRecordProps, IPublishRecordState> {
  constructor(props) {
    super(props);
    this.state = {
      tableList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  }
  public componentDidMount() {
    this.getTableDataList();
  }

  public render() {
    const columns: Array<ColumnProps<IColumn>> = [
      {
        title: '目录名称',
        dataIndex: 'name',
        render: (value: string, row: IColumn) => (
          <span>{row.rootName}/{row.name}</span>
        )
      },
      {
        title: '发布时间',
        dataIndex: 'createTime'
      },
      {
        title: '目录状态',
        dataIndex: 'auditResult',
        render: (value: number, row: IColumn) => {
          if (value === 2) {
            return <span>审核通过</span>
          } else if (value === 1) {
            return <span style={{ color: '#ffab2e', cursor: 'pointer' }} onClick={this.showMessage.bind(this, row)}>审核未通过</span>
          } else {
            return <span>待审核</span>
          }
        }
      }
    ]
    return (
      <div className={style.container}>
        <Table<IColumn> columns={columns} dataSource={this.state.tableList} bordered={true}
          className='custom-table'
          pagination={false}
        />
        <div className={style.pageWrap}>
          <Pagination
            total={this.state.total}
            pageSize={this.state.pageSize}
            current={this.state.currentPage}
            showQuickJumper={{ goButton: <Button type='primary' style={{ marginLeft: 10 }}>确定</Button> }}
            showTotal={(total, range) => (
              <span>共计：{total}条数据</span>
            )}
            hideOnSinglePage={true}
            onChange={this.changePage}
          />
        </div>
      </div>
    );
  }
  private changePage = (page: number) => {
    this.setState({
      currentPage: page
    }, () => {
      this.getTableDataList();
    })
  }
  private getTableDataList = async () => {
    try {
      const params = {
        auditResult: 9,
        name: '',
        pageSize: this.state.pageSize,
        pageIndex: this.state.currentPage
      }
      const { status, message, data, total } = await request.post('/collection/info/DirectoryRoot/listRootAndSupDirectoryByStatus', params, {
        loading: true,
        loadingTitle: '获取发布记录中……'
      });
      if (status === 200) {
        data.forEach(item => {
          item.key = Math.random()
        });
        this.setState({
          tableList: data,
          total
        });
      } else {
        Msg.warn(message);
      }
    } catch (error) {
      Msg.error('内部错误');
    }
  }
  private showMessage = (row: IColumn) => {
    if (!row.reason) {
      notification.open({
        message: '审核未通过',
        description: '暂无驳回理由',
        icon: <Icon type='exclamation-circle' theme='filled' style={{ color: '#FF8000' }} />,
        key: row.key
      })
    }
  }
}
