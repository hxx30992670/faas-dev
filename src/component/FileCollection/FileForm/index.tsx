import * as React from 'react';
import { Form, Cascader, message as Message, Button, Upload, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from "antd/lib/upload";
import style from './style.module.less';
import request from "src/utils/Request";
import localSave from "src/utils/LocalSave";

export interface IFileFormProps extends FormComponentProps {
}

interface IFileFormState {
  categoryList: any[],
  fileList: any[]
}

class FileForm extends React.Component<IFileFormProps, IFileFormState> {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      fileList: []
    }
  }

  public componentDidMount() {
    this.getCatalogList();
  }

  public render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const displayRender = (label) => {
      return label[label.length - 1];
    }
    const filedNames = {
      label: 'name',
      children: 'childNode',
      value: 'id'
    }
    const props = {
      action: '/api/collection/info/DataFile/uploadFileResource',
      onChange: this.handleChange,
      multiple: false,
      headers: {
        mt: localSave.getSession('userInfo', true).mt
      }
    };
    return (
      <div className={style.container}>
        <Form {...formItemLayout}>
          <Form.Item label='所属目录'>
            {
              getFieldDecorator('category', {
                rules: [
                  { required: true, message: '所属目录不能为空' }
                ]
              })(
                <Cascader
                  fieldNames={filedNames}
                  options={this.state.categoryList}
                  displayRender={displayRender}
                  placeholder='请选择所属目录'
                />
              )
            }
          </Form.Item>
          <Form.Item label='选择上传文件'>
            <Upload {...props} fileList={this.state.fileList}
              beforeUpload={this.beforUpload}
            >
              <div className={style.uploadWrap}>
                <Button type='primary'>
                  <Icon type="upload" /> 选择文件
                </Button>
                <p className={style.tips}>*只能上传CSV和Excel(xls.xlsx)文件,大小不可超过20M</p>
              </div>
            </Upload>
          </Form.Item>
          <div>
            <Button onClick={this.validateField}>
              按钮
            </Button>
          </div>
        </Form>
      </div>
    );
  }
  public getCatalogList = async () => {
    try {
      const { data, message, status } = await request.post("/collection/info/DirectoryRoot/listRootAndSupDirectory", {}, {
        loading: true,
        loadingTitle: '获取目录数据中……'
      });
      if (status === 200) {
        this.setState({
          categoryList: data
        })
      } else {
        Message.error(message);
      }
    } catch (e) {
      throw Error(e);
    }
  }

  private validateField = () => {
    const { validateFields } = this.props.form;

    validateFields((error, value) => {
      if (error) {
        Message.error('按规则完善所有字段');
      } else {
        console.log(value);
      }
    })
  }

  private handleChange = (info: UploadChangeParam) => {
    console.log(info);
    let fileList: any[] = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response && file.response.status === 200) {
        file.url = file.response.data.address;
      }
      return file;
    });
    if (info.file.response && info.file.response.status !== 200) {
      this.setState({
        fileList: []
      });
      Message.error(info.file.response.message);
    } else {
      if (info.file.status) {
        this.setState({
          fileList
        });
      }
    }
  }
  // 上传前事件
  private beforUpload = (file) => {
    const nameArr = file.name.split('.');
    const type: string = nameArr[nameArr.length - 1];
    if (type.toLocaleLowerCase() === 'csv' || type.toLocaleLowerCase() === 'xlsx' || type.toLocaleLowerCase() === 'xls') {
      const size = file.size;
      const max = 1024 * 1024 * 20;
      if (size > max) {
        Message.error('文件大小超过20M');
        this.setState({
          fileList: []
        });
        return false;
      } else {
        return true;
      }
    } else {
      Message.error('不支持该文件类型');
      this.setState({
        fileList: []
      });
      return false;
    }

  }
}

export default Form.create({ name: 'fileForm' })(FileForm);
