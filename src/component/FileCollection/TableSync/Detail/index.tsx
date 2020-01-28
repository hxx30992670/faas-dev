import * as React from 'react';
import style from './style.module.less';
import { Form, Input, message as Message } from 'antd';
import request from 'src/utils/Request';

export interface ITableSyncDetailProps {
  id: string | number
}
export interface ITableSyncDetailState {
  detailData: IDetail
}

export interface IDetail {
  name: any;
  sourceTable: any;
  syncStrategy: any;
  syncType: any;
  saveType: any;
  timestampColumn: any;
  syncName: any;
  dataName: any;
  description: any;
  purpose: any;
  dataSource: any;
}

export default class TableSyncDetail extends React.Component<ITableSyncDetailProps, ITableSyncDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      detailData: {
        name: '',
        sourceTable: '',
        syncStrategy: '',
        syncType: '',
        saveType: '',
        timestampColumn: '',
        syncName: '',
        dataName: '',
        description: '',
        purpose: '',
        dataSource: ''
      }
    }
    this.getDetailData();
  }

  public render() {
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
    const { detailData } = this.state;
    return (
      <div className={style.container}>
        <Form {...formItemLayout}>
          <Form.Item label='源数据库'>
            <Input value={detailData.name} readOnly={true} />
          </Form.Item>
          <Form.Item label='源表'>
            <Input value={detailData.sourceTable} readOnly={true} />
          </Form.Item>
          <Form.Item label='同步策略'>
            <Input value={detailData.syncStrategy} readOnly={true} />
          </Form.Item>
          <Form.Item label='同步类型'>
            <Input value={detailData.syncType === 1 ? '全量同步' : detailData.syncType === 2 ? '增量同步' : ''} readOnly={true} />
          </Form.Item>
          {
            detailData.saveType === 2 ?
              <Form.Item label='选择时间戳字段'>
                <Input value={detailData.timestampColumn} readOnly={true} />
              </Form.Item> : ''
          }
          <Form.Item label='同步名称'>
            <Input value={detailData.syncName} readOnly={true} />
          </Form.Item>
          <Form.Item label='数据名称'>
            <Input value={detailData.dataName} readOnly={true} />
          </Form.Item>
          <Form.Item label='数据描述'>
            <Input value={detailData.description} readOnly={true} />
          </Form.Item>
          <Form.Item label='数据用途'>
            <Input value={detailData.purpose} readOnly={true} />
          </Form.Item>
          <Form.Item label='所属系统'>
            <Input value={detailData.dataSource} readOnly={true} />
          </Form.Item>
        </Form>
      </div>
    );
  }

  public getDetailData = async () => {
    const params = {
      id: this.props.id
    }
    try {
      const { status, message, data } = await request.post('/collection/info/Data/selectByPrimaryKey', params, {
        loading: true,
        loadingTitle: '获取详情数据中……'
      });
      if (status === 200) {
        let { detailData } = this.state;

        detailData = {
          name: data.dbSyncAndSourceEntity.dbSourceEntity.name,
          sourceTable: data.dbSyncAndSourceEntity.sourceTable,
          syncStrategy: data.dbSyncAndSourceEntity.syncStrategy,
          syncType: data.dbSyncAndSourceEntity.syncType,
          saveType: data.dbSyncAndSourceEntity.syncType,
          timestampColumn: data.dbSyncAndSourceEntity.timestampColumn,
          syncName: data.dbSyncAndSourceEntity.syncName,
          dataName: data.dataEntity.name,
          description: data.dataEntity.description,
          purpose: data.dataEntity.purpose,
          dataSource: data.dataEntity.dataSource
        }
        if (detailData.saveType === 2 && detailData.timestampColumn !== '') {
          const timestampColumnArr: any[] = data.directoryMetaEntityList.filter(item => {
            let type: string = item.type.toString();
            return type.startsWith('4');
          });
          const currentTimeStampColumn = timestampColumnArr.find(item => item.nameEng === data.dbSyncAndSourceEntity.timestampColumn);
          detailData.timestampColumn = currentTimeStampColumn.name;
        }
        this.setState({
          detailData
        })
      } else {
        Message.warning(message);
      }
    } catch (e) {
      Message.error('服务器错误');
    }
  }
}
