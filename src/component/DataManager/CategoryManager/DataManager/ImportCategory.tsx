import * as React from 'react';
import { Form, Upload, Button, Icon, message as Message, List } from 'antd';
import request from 'src/utils/Request';
//import localSave from 'src/utils/LocalSave';
//import { UploadChangeParam } from 'antd/lib/upload';

export interface IImportCategoryProps {
  closeModal: () => void
}
export interface IImportCategoryState {
  fileList: any[],
  uploading: boolean;
  errorList: any[];
}

export default class ImportCategory extends React.Component<IImportCategoryProps, IImportCategoryState> {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      errorList: []
    }
  }

  public render() {
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 4
      },
      wrapperCol: {
        xs: 24,
        sm: 18
      }
    }
    /*  const props = {
       action: '/api/collection/info/DirectoryRoot/dirModelUpload',
       multiple: false,
       headers: {
         mt: localSave.getSession('userInfo', true).mt
       }
     }; */
    let listItem: any[] = [];
    if (this.state.errorList.length) {
      listItem = this.state.errorList.map(item => (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', height: '100%' }}>
          <p>{item.dirName}</p>
          <p style={{ color: '#f00' }}>{item.reason}</p>
        </div>
      ))
    }
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label='选择上传文件'>
            <Upload fileList={this.state.fileList}
              beforeUpload={this.beforUpload}
              onRemove={this.removeFile}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button type='primary' loading={this.state.uploading}>
                  <Icon type='upload' /> 选择文件
                </Button>
                <p style={{ marginLeft: 20 }}>只能上传专用模板文件</p>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label=' ' colon={false}>
            <div>
              <Button type='primary' onClick={this.submitFile} loading={this.state.uploading}>导入</Button>
              <Button style={{ marginLeft: 20 }} onClick={this.props.closeModal}>取消</Button>
            </div>
          </Form.Item>
        </Form>
        {
          this.state.errorList.length ?
            <div style={{ display: 'flex', justifyContent: 'center', maxHeight: 400, overflowY: 'auto' }}>
              <List
                bordered={false}
                dataSource={listItem}
                style={{ width: '60%' }}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            </div> : ''
        }
      </div>
    );
  }
  private removeFile = () => {
    this.setState({
      fileList: [],
      errorList: []
    })
  }
  private submitFile = async () => {
    const { fileList } = this.state;
    if (!fileList.length) {
      return Message.warn('请选择要上传的文件');
    }
    const formData = new FormData();

    fileList.forEach(file => {
      formData.append('file', file);
    });
    this.setState({
      uploading: true
    });
    try {
      const { status, message, data } = await request.post('/collection/info/DirectoryRoot/dirModelUpload', formData, {
        loading: true,
        loadingTitle: '上传文件中……'
      }, true);
      if (status === 200) {
        Message.success('上传成功');
        this.setState({
          uploading: false,
          fileList: fileList.map(item => {
            item.status = 'done';
            item.response = message;
            return item;
          }, () => {
            this.props.closeModal();
          })
        });
      } else {
        Message.warn(message);
        this.setState({
          uploading: false,
          fileList: fileList.map(item => {
            item.status = 'error';
            item.response = message;
            return item;
          }),
          errorList: data && data.length ? data : []
        })
      }
    } catch (e) {
      Message.error('内部错误');
      this.setState({
        uploading: false,
        fileList: [],
      })
    }
  }
  /* private handleChange = (info: UploadChangeParam): any => {

    let fileList: any[] = [...info.fileList];
    if (!fileList.length) {
      this.setState({
        fileList: []
      });
      return;
    }
    fileList = fileList.slice(-1);
    if (info.file.response && info.file.response.status !== 200) {
      Message.error(info.file.response.message);
      fileList = fileList.map(file => {
        file.status = 'error'
        return file;
      });
      this.setState({
        fileList
      });
    } else {
      if (info.file.status) {
        this.setState({
          fileList,
        });
      }
    }
  } */
  private beforUpload = (file) => {
    const nameArr = file.name.split('.');
    const type: string = nameArr[nameArr.length - 1];
    console.log(file);
    if (type.toLocaleLowerCase() === 'csv' || type.toLocaleLowerCase() === 'xlsx' || type.toLocaleLowerCase() === 'xls') {
      const size = file.size;
      const max = 1024 * 500;
      if (size > max) {
        Message.error('文件大小超过500KB');
      } else {
        this.setState({
          fileList: [file]
        })
      }
    } else {
      Message.error('只能上传CSV、Excel文件');
    }
    return false;
  }
}
