import * as React from 'react';
import style from './style.module.less';
import { message as Message } from 'antd';
import request from 'src/utils/Request';
import FormDetail from './FormDetail';

export interface IDataDetailProps {
  id: any,
  syncNum: any,
  saveNum: any
}
export interface IDataDetailState {
  formData: IFormData
}
export interface IFormData {
  dataType: number;
  serviceId: number | string;
  ToppicId: string | number;
  name: string;
  description: string;
  dataUse: string;
  dataSource: string;
  rootSubName: string;
  syncNum: any;
  fileStatus: number | string;
  saveNum: any;
  createTime: string;
  fileFormat: string;
  fileName: string;
  metaList: any[];
  address: string;
  responseType: number;
  requestMode: number;
  requestParam: any[];
  responseParam: any[];
  errorCode: any[];
  requestDemo: string;
  responseDemo: string;
  dbname: string;
  sourceTable: string;
  syncStrategy: string;
  dbtype: number;
  updateTime: string;
  error?: string;
}

export default class DataDetail extends React.Component<IDataDetailProps, IDataDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        dataType: 0,
        serviceId: '',
        ToppicId: '',
        name: '',
        description: '',
        dataUse: '',
        dataSource: '',
        rootSubName: '',
        syncNum: 0,
        fileStatus: '',
        saveNum: 0,
        createTime: '',
        fileFormat: '',
        fileName: '',
        metaList: [],
        address: '',
        responseType: 0,
        requestMode: 0,
        requestParam: [],
        responseParam: [],
        errorCode: [],
        requestDemo: '',
        responseDemo: '',
        dbname: '',
        sourceTable: '',
        syncStrategy: '',
        dbtype: 0,
        updateTime: '',
        error: ''
      }
    }
    this.getDetailData();
  }

  public render() {
    return (
      <div className={style.container}>
        <FormDetail formData={this.state.formData} />
      </div>
    );
  }
  private getDetailData = async () => {
    try {
      const { status, data, message } = await request.post('/collection/info/Data/selectByPrimaryKey', {
        id: this.props.id
      }, {
          loading: true,
          loadingTitle: '正在获取数据详情……'
        });
      if (status === 200) {
        const { formData } = this.state;
        formData.dataType = data.dataEntity.dataType;
        formData.name = data.dataEntity.name;
        formData.description = data.dataEntity.description;
        formData.dataUse = data.dataEntity.purpose;
        formData.dataSource = data.dataEntity.dataSource;
        formData.rootSubName = data.dataEntity.rootName + '/' + data.dataEntity.subName;
        formData.createTime = data.dataEntity.createTime;
        formData.syncNum = this.props.syncNum;
        formData.saveNum = this.props.saveNum;
        if (formData.dataType === 1) {
          formData.fileFormat = data.dataFileEntity.format;
          formData.fileName = data.dataFileEntity.name;
          formData.metaList = data.directoryMetaEntityList;
          formData.fileStatus = data.dataEntity.status;
        } else if (formData.dataType === 2) {
          formData.address = data.dataApiEntity.address;
          formData.responseType = data.dataApiEntity.responseType;
          formData.requestMode = data.dataApiEntity.requestMode;
          formData.requestParam = data.dataApiEntity.requsetParam ? JSON.parse(data.dataApiEntity.requsetParam) : [];
          formData.responseParam = data.dataApiEntity.responseParam ? JSON.parse(data.dataApiEntity.responseParam) : [];
          formData.requestDemo = data.dataApiEntity.requsetDemo;
          formData.responseDemo = data.dataApiEntity.responseDemo;
          formData.errorCode = data.dataApiEntity.errorCode ? JSON.parse(data.dataApiEntity.errorCode) : [];
        } else if (formData.dataType === 3) {
          formData.dbname = data.dbSyncAndSourceEntity.dbSourceEntity.name;
          formData.sourceTable = data.dbSyncAndSourceEntity.sourceTable;
          formData.syncStrategy = data.dbSyncAndSourceEntity.syncStrategy;
          formData.dbtype = data.dbSyncAndSourceEntity.type;
          formData.metaList = data.directoryMetaEntityList;
          formData.updateTime = data.dataEntity.updateTime;
        } else if (formData.dataType === 4) {
          const serviceId: any[] = data.dataCollaboration.tableName.split('_');
          serviceId.shift();
          formData.serviceId = serviceId.join('_');
          formData.ToppicId = serviceId.join('_');
          formData.metaList = data.directoryMetaEntityList;
        }
        this.setState({
          formData
        });
      } else {
        Message.warn(message);
      }
    } catch (e) {
      Message.error('服务器错误');
    }
  }
}
