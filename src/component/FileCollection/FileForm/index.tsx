import * as React from 'react';
import {Form, Cascader, message as Message, Button,Upload, Icon} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import style from './style.module.less';
import request from "src/utils/Request";

export interface IFileFormProps extends FormComponentProps {
}

interface IFileFormState{
  categoryList: any[],
  fileList: any[]
}

class FileForm extends React.Component<IFileFormProps,IFileFormState> {
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
    const {getFieldDecorator} = this.props.form;
    const displayRender = (label) => {
      return label[label.length -1];
    }
    const filedNames = {
      label: 'name',
      children: 'childNode', 
      value: 'id'
    }
    const props = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange: this.handleChange,
      multiple: false,
    };
    return (
      <div className={style.container}>
        <Form {...formItemLayout}>
          <Form.Item label='所属目录'>
            {
              getFieldDecorator('category', {
                rules: [
                  {required: true, message: '所属目录不能为空'}
                ]
              })(
                <Cascader
                  fieldNames={filedNames}
                  options={this.state.categoryList}
                  displayRender={displayRender}
                />
              )
            }
          </Form.Item>
          <Form.Item label='选择上传文件'>
            {
              getFieldDecorator('filelist', {
                rules: [
                  {required: true, message: '上传文件不能为空'}
                ]
              })(
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> 上传文件
                  </Button>
                </Upload>
              )
            }
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
  public getCatalogList = async() => {
    try{
      const {data,message,status} = await request.post("/collection/info/DirectoryRoot/listRootAndSupDirectory", {},{
        loading:true,
        loadingTitle: '获取目录数据中……'
      });
      if(status === 200) {
        console.log(data);
        this.setState({
          categoryList: data
        })
      }else {
        Message.error(message);
      }
    }catch(e) {
      throw Error(e);
    }
  }

  private validateField = () => {
    const {validateFields} = this.props.form;

    validateFields((error,value) => {
      if(error) {
        Message.error('按规则完善所有字段');
      }else {
        console.log(value);
      }
    })
  }

  private handleChange = (info) => {
    const {setFieldsValue} = this.props.form;
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    fileList = [fileList[fileList.length -1]];
    console.log(fileList);
    setFieldsValue({
      "filelist": {
        file: info.file,
        filelist: fileList
      }
    })
  }
}

export default Form.create({name: 'fileForm'})(FileForm);
