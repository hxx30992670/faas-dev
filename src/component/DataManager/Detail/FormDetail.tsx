import * as React from 'react';
import { IFormData } from './index';
import { Form, Input, Table, message as Message, Button } from 'antd';
import request from 'src/utils/Request';

export interface IFormDetailProps {
  formData: IFormData
}
export interface IFormDetailState {
  sdkAddress: string;
}
export default class FormDetail extends React.Component<IFormDetailProps, IFormDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      sdkAddress: ''
    }
    this.getSdkAddress();
  }
  public getSdkAddress = async () => {
    try {
      const { status, message, data } = await request.get('/collection-kafka-management/getCollaborationSdk');
      if (status === 200) {
        this.setState({
          sdkAddress: data
        })
      } else {
        Message.warn(message);
      }
    } catch (e) {
      Message.error('服务器错误');
    }
  }
  public render() {
    const { formData } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 3
      },
      wrapperCol: {
        xs: 24,
        sm: 19
      }
    }
    return (
      <div>
        <Form {...formItemLayout}>
          {
            formData.dataType === 4 ?
              <React.Fragment>
                <Form.Item label='业务ID'>
                  <Input value={formData.serviceId} readOnly={true} />
                </Form.Item>
                <Form.Item label='Topic ID'>
                  <Input value={formData.ToppicId} readOnly={true} />
                </Form.Item>
              </React.Fragment> : ''
          }
          <Form.Item label='数据名称'>
            <Input value={formData.name} readOnly={true} />
          </Form.Item>
          <Form.Item label='数据描述'>
            <Input value={formData.description} readOnly={true} />
          </Form.Item>
          <Form.Item label='数据用途'>
            <Input value={formData.dataUse} readOnly={true} />
          </Form.Item>
          <Form.Item label='所属系统'>
            <Input value={formData.dataSource} readOnly={true} />
          </Form.Item>
          <Form.Item label='数据类型'>
            <Input value={formData.dataType === 1 ? '文件' : formData.dataType === 2 ? '接口' : formData.dataType === 3 ? '库表' : '业务协同'} readOnly={true} />
          </Form.Item>
          <Form.Item label='所属目录'>
            <Input value={formData.rootSubName} readOnly={true} />
          </Form.Item>
          {
            formData.dataType !== 2 ?
              <Form.Item label='数据储存条数'>
                {
                  this.getDomElement()
                }
              </Form.Item> : ''
          }
          {
            formData.dataType !== 2 ?
              <Form.Item label='数据储存量'>
                <Input value={formData.saveNum + '(B)'} readOnly={true} />
              </Form.Item> : ''
          }
          <Form.Item label='创建时间'>
            <Input value={formData.createTime} readOnly={true} />
          </Form.Item>
          {
            formData.dataType === 1 ?
              <React.Fragment>
                <Form.Item label='文件格式'>
                  <Input value={formData.fileFormat} readOnly={true} />
                </Form.Item>
                <Form.Item label='文件'>
                  <Input value={formData.fileName} readOnly={true} />
                </Form.Item>
                <Form.Item label='数据字段'>
                  {
                    this.getMetaList()
                  }
                </Form.Item>
              </React.Fragment> : formData.dataType === 2 ?
                <React.Fragment>
                  <Form.Item label='接口地址'>
                    <Input value={formData.address} readOnly={true} />
                  </Form.Item>
                  <Form.Item label='返回格式'>
                    <Input value={formData.responseType === 1 ? 'JSON' : 'XML'} readOnly={true} />
                  </Form.Item>
                  <Form.Item label='请求方式'>
                    <Input value={formData.requestMode === 1 ? 'GET' : 'POST'} readOnly={true} />
                  </Form.Item>
                  <Form.Item label='请求参数说明'>
                    {this.getMetaList('request')}
                  </Form.Item>
                  <Form.Item label='返回参数说明'>
                    {this.getMetaList('response')}
                  </Form.Item>
                  <Form.Item label='错误说明'>
                    {this.getMetaList('error')}
                  </Form.Item>
                  <Form.Item label='调用示例'>
                    <Input.TextArea value={formData.requestDemo} readOnly={true} rows={4} />
                  </Form.Item>
                  <Form.Item label='返回示例'>
                    <Input.TextArea value={formData.responseDemo} readOnly={true} rows={4} />
                  </Form.Item>
                </React.Fragment> : formData.dataType === 3 ?
                  <React.Fragment>
                    <Form.Item label='源数据库'>
                      <Input value={formData.dbname} readOnly={true} />
                    </Form.Item>
                    <Form.Item label='源表'>
                      <Input value={formData.sourceTable} readOnly={true} />
                    </Form.Item>
                    <Form.Item label='同步策略'>
                      <Input value={formData.syncStrategy} readOnly={true} />
                    </Form.Item>
                    <Form.Item label='同步类型'>
                      <Input value={formData.dbtype === 1 ? '全量同步' : '增量同步'} readOnly={true} />
                    </Form.Item>
                    <Form.Item label='最后更新时间'>
                      <Input value={formData.updateTime} readOnly={true} />
                    </Form.Item>
                    <Form.Item label='数据字段'>
                      {this.getMetaList()}
                    </Form.Item>
                  </React.Fragment> : formData.dataType === 4 ?
                    <React.Fragment>
                      <Form.Item label='数据字段'>
                        {this.getMetaList()}
                      </Form.Item>
                      <Form.Item label=' ' colon={false}>
                        <Button type='primary' onClick={this.downloadSdk}>SDK包下载</Button>
                      </Form.Item>
                    </React.Fragment> : ''
          }
        </Form>
      </div >
    );
  }
  private downloadSdk = () => {
    const { sdkAddress } = this.state;
    if (sdkAddress) {
      window.open(sdkAddress);
    } else {
      Message.warn('无效的SDK地址')
    }
  }
  private getMetaList = (key?: string) => {
    const { formData } = this.props;
    let columns: any[] = [];
    if (formData.dataType === 1 || formData.dataType === 3 || formData.dataType === 4) {
      columns = [
        {
          title: '中文名称',
          dataIndex: 'name',
          width: 200
        },
        {
          title: '英文名称',
          dataIndex: 'nameEng',
          width: 200
        },
        {
          title: '类型',
          dataIndex: 'dataType',
          width: 100
        },
        {
          title: '描述',
          dataIndex: 'description',
          render: value => (
            <div style={{ wordBreak: 'break-all', wordWrap: 'break-word' }}>{value}</div>
          )
        }
      ]
      return (
        <Table columns={columns} dataSource={formData.metaList} rowKey='id' pagination={false} style={{ maxHeight: 300, overflowY: 'auto' }} />
      )

    } else if (formData.dataType === 2) {
      if (key === 'request') {
        columns = [
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '是否必填',
            dataIndex: 'must',
            render: value => (
              <span>{value ? '是' : '否'}</span>
            )
          },
          {
            title: '类型',
            dataIndex: 'type'
          },
          {
            title: '说明',
            dataIndex: 'desc'
          }
        ]
        return (
          <Table columns={columns} dataSource={formData.requestParam} rowKey='id' pagination={false} style={{ maxHeight: 300 }} />
        )
      } else if (key === 'response') {
        columns = [
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '类型',
            dataIndex: 'type'
          },
          {
            title: '说明',
            dataIndex: 'description'
          }
        ]
        return (
          <Table columns={columns} dataSource={formData.responseParam} rowKey='id' pagination={false} style={{ maxHeight: 300 }} />
        )
      } else if (key === 'error') {
        columns = [
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '说明',
            dataIndex: 'desc'
          }
        ]
        return (
          <Table columns={columns} dataSource={formData.errorCode} rowKey='id' pagination={false} style={{ maxHeight: 300 }} />
        )
      } else {
        return '';
      }
    } else {
      return '';
    }

  }
  private getDomElement = () => {
    const { formData } = this.props;
    if (formData.dataType !== 2) {
      if (formData.syncNum === 0) {
        if (formData.dataType === 1) {
          return (
            formData.fileStatus === 2 ?
              <p style={{ color: '#ff7d27' }}>{formData.syncNum}(该文件入库失败，请先删除该条数据，并重新采集)</p> :
              formData.fileStatus === 0 ?
                <p style={{ color: '#669933' }}>{formData.syncNum}(文件入库中)</p> : ''
          )
        } else if (formData.dataType === 3) {
          return (
            <p style={{ color: '#ff7d27' }}>{formData.syncNum}(该库表数据对应同步过程未启动或启动失败)</p>
          )
        } else {
          return (
            <Input value={formData.syncNum} />
          )
        }
      } else {
        return (
          <Input value={formData.syncNum} />
        )
      }
    } else {
      return '';
    }
  }
}
