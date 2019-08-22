import * as React from 'react';
import { Form, Cascader, message as Message, Button, Upload, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from "antd/lib/upload";
import style from './style.module.less';
import request from "src/utils/Request";
import localSave from "src/utils/LocalSave";
import FieldTable from '../FieldTable/index';
import { portForm } from "../FieldTable/table";

export interface IFileFormProps extends FormComponentProps {

}

interface IFileFormState {
  categoryList: any[],
  fileList: any[],
  fieldList: any[],
  dataPrview: any[],

}

class FileForm extends React.Component<IFileFormProps, IFileFormState, any> {
  public fieldEl;
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      fileList: [],
      fieldList: [],
      dataPrview: []
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
    // const getFieldRef = (el) => this.fieldEl = el;
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
            <div className={style.formRow}>
              <Upload {...props} fileList={this.state.fileList}
                beforeUpload={this.beforUpload}
                className={style.customUpload}
              >
                <div className={style.uploadWrap}>
                  <Button type='primary'>
                    <Icon type="upload" /> 选择文件
                  </Button>
                  <p className={style.tips}>*只能上传CSV和Excel(xls.xlsx)文件,大小不可超过20M</p>
                </div>
              </Upload>
              {
                this.state.fieldList.length ? <Button type='link'>数据预览</Button> : ''
              }
            </div>
            {
              this.state.fieldList.length ? <FieldTable  {...this.props} fieldList={this.state.fieldList}
                changeFields={this.changeFields} getRowRef={this.getRowRef} /> : ''
            }
          </Form.Item>
          <Form.Item label='数据名称'>
            {
              getFieldDecorator("dataName", {
                validateTrigger: ["onBlur"],
                rules: [
                  { required: true, message: '数据名称不能为空' },
                  { max: 64, message: '数据名称长度不能超过64' }
                ]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label='数据描述'>
            {
              getFieldDecorator("dataDescription", {
                validateTrigger: ["onBlur"],
                rules: [
                  { required: true, message: '数据描述不能为空' },
                  { max: 100, message: '数据描述长度不能超过100' }
                ]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label='数据用途'>
            {
              getFieldDecorator("dataUse", {
                validateTrigger: ["onBlur"],
                rules: [
                  { required: true, message: '数据用途不能为空' },
                  { max: 64, message: '数据描述长度不能超过64' }
                ]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label='所属系统'>
            {
              getFieldDecorator("dataSource", {
                validateTrigger: ["onBlur"],
                rules: [
                  { required: true, message: '所属系统不能为空' },
                  { max: 64, message: '所属系统长度不能超过64' }
                ]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label=' ' colon={false}>
            <Button onClick={this.validateField}>
              提交
            </Button>
          </Form.Item>
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

  public changeFields = (data: any[]) => {
    this.setState({
      fieldList: data
    });
  }

  public getRowRef = (el: any) => {
    this.fieldEl = el;
  }

  private validateField: () => void = () => {
    const { validateFields } = this.props.form;
    console.log(this.fieldEl);
    portForm.forEach(form => {
      form.validateFields((error, value) => {
        if (error) {
          console.log(error);
        } else {
          console.log(value);
        }
      })
    })
    /* this.fieldEl.props.form.validateFields((error, value) => {
      if (error) {
        console.log(error);
      } else {
        console.log(value);
      }
    }); */
    validateFields((error, value) => {
      if (error) {
        Message.error('按规则完善所有字段');
      } else {
        const { fileList } = this.state;
        if (!fileList.length) {
          Message.warning('没有上传文件');
          return;
        }
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
        console.log(file);
        this.setState({
          fieldList: file.response.data.directoryEntityList.map(field => {
            field.key = Math.random();
            // field.nameEng = "12323";
            return field;
          })
        });
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
