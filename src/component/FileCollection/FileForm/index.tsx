import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Cascader, message as Message, Button, Upload, Icon, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from "antd/lib/upload";
import style from './style.module.less';
import request from "src/utils/Request";
import localSave from "src/utils/LocalSave";
import FieldTable from '../FieldTable/index';
import { portForm } from "../FieldTable/table";
import PrviewData from "../DataPrview/index";
const { confirm } = Modal;

export interface IFileFormProps extends RouteComponentProps {

}

export interface IFileFormProps extends FormComponentProps {

}

interface IFileFormState {
  categoryList: any[],
  fileList: any[],
  fieldList: any[],
  dataPrview: any[],
  headerList: any[],
  visible: boolean,
  sufixName: string,
  fileName: string,
}

class FileForm extends React.Component<IFileFormProps, IFileFormState, any> {
  public fieldEl;
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      fileList: [],
      fieldList: [],
      dataPrview: [],
      headerList: [],
      visible: false,
      sufixName: '',
      fileName: ''
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
          <Form.Item label={'所属目录'}>
            <div className='form-inline'>
              {
                getFieldDecorator('category', {
                  rules: [
                    { required: true, message: '所属目录不能为空' }
                  ]
                })(
                  <Cascader
                    fieldNames={filedNames}
                    displayRender={displayRender}
                    options={this.state.categoryList}
                    placeholder={'请选择所属目录'}
                    style={{ width: 260 }}
                  />

                )
              }
              <p className={'tips'}>
                *无关联目录，请先
				        <span>创建目录！</span>
                <Icon type="info-circle" style={{ color: 'rgb(47,145,216)', marginLeft: 15 }} />
              </p>
            </div>
          </Form.Item>
          <Form.Item label='选择上传文件'>
            <div className={style.formRow}>
              <Upload {...props} fileList={this.state.fileList}
                beforeUpload={this.beforUpload}
                className={style.customUpload}
                onRemove={this.removeUpload}
              >
                <div className={style.uploadWrap}>
                  <Button type='primary'>
                    <Icon type="upload" /> 选择文件
                  </Button>
                  <p className={style.tips}>*只能上传CSV和Excel(xls.xlsx)文件,大小不可超过20M</p>
                </div>
              </Upload>
              {
                this.state.dataPrview.length ? <Button type='link' onClick={this.openModal}>数据预览</Button> : ''
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
            <Button type='primary' onClick={this.validateField}>
              提交
            </Button>
          </Form.Item>
        </Form>
        <Modal
          title='数据预览'
          visible={this.state.visible}
          okText='关闭'
          footer={null}
          maskClosable={false}
          onCancel={this.closeModal}
          width='60%'
        >
          <PrviewData dataList={this.state.dataPrview} tableHeader={this.state.headerList} />
        </Modal>
      </div>
    );
  }
  public openModal = () => {
    this.setState({
      visible: true
    })
  }
  public closeModal = () => {
    this.setState({
      visible: false
    })
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
      } else if (status === 204) {
        Message.warning('目录数据为空');
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

  private getType(str: string) {
    switch (str) {
      case "Bigint":
        return 1;
      case "Varchar":
        return 2;
      case "Double":
        return 3;
      case 'Datetime':
        return 4;
      case 'time':
        return 41;
      case 'date':
        return 43;
      default:
        return 2;
    }
  }

  private validateField: () => void = () => {
    const { validateFields } = this.props.form;
    validateFields(async (error, value) => {
      if (error) {
        Message.error('按规则完善所有字段');
      } else {
        const { fileList } = this.state;
        if (!fileList.length) {
          Message.warning('没有上传文件');
          return;
        } else {
          let bOn: boolean = true;
          portForm.forEach(form => {
            form.validateFields((fieldError, fieldValue) => {
              if (fieldError) {
                bOn = false;
              }
            })
          });
          if (!bOn) {
            Message.warning('请填写字段信息');
          } else {
            const metaList = this.state.fieldList.map(item => {
              item.rootId = value.category[0];
              item.subId = value.category[1];
              item.type = this.getType(item.type);
              return item;
            })
            const params = {
              address: this.state.fileList[0].url,
              dataName: value.dataName,
              dataSource: value.dataSource,
              description: value.dataDescription,
              format: this.state.sufixName,
              name: value.dataName,
              purpose: value.dataUse,
              rootId: value.category[0],
              subId: value.category[1],
              metaInsertParam: metaList
            }
            try {
              const { status, message } = await request.post('/collection/info/DataFile/insert', params, { loading: true, loadingTitle: '文件采集中……' });
              if (status === 200) {
                Message.success('文件采集成功');
                this.props.history.push('/data-manager/data-list');
              } else {
                Message.warning(message);
              }
            } catch (e) {
              Message.error('服务器错误');
            }
            console.log(value);
            console.log(this.state.fieldList);
          }
        }
      }
    })
  }

  private removeUpload = async () => {
    try {
      const result: any = await new Promise((resolve, reject) => {
        confirm({
          title: '删除',
          content: '是否要删除该文件？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.setState({
              fileList: [],
              fieldList: [],
              dataPrview: [],
              headerList: []
            })
            return resolve();
          },
          onCancel: () => {
            return reject();
          }
        })
      });
      console.log(result);
      return result;
    } catch (e) {
      return false;
    }
  }

  private handleChange = (info: UploadChangeParam) => {
    let fileList: any[] = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response && file.response.status === 200) {
        file.url = file.response.data.address;
        const headerList = file.response.data.previewData[0];

        let prviewList = file.response.data.previewData.slice(1);
        prviewList = prviewList.map((data: any) => {
          const result: any = {
            key: Math.random(),
          };
          data.forEach((child, index) => {
            result[headerList[index]] = child
          });
          return result;
        })
        this.setState({
          fieldList: file.response.data.directoryEntityList.map(field => {
            field.key = Math.random();
            // field.nameEng = "12323";
            return field;
          }),
          headerList,
          dataPrview: prviewList
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
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
          dataName: info.file.name
        })
        const sufixName = info.file.name.split('.');
        this.setState({
          fileList,
          sufixName: sufixName[sufixName.length - 1],
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
