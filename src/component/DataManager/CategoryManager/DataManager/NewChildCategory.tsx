import * as React from 'react';
import { Form, Select, message as Msg, Input, Radio, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import request from 'src/utils/Request';

export interface INewChildCategoryProps extends FormComponentProps {
  closeModal: () => void;
  getDirList: () => void;
  editOrNew?: boolean;
  currentNode?: any
}
export interface INewChildCategoryState {
  categoryList: any[]
}


class NewChildCategory extends React.Component<INewChildCategoryProps, INewChildCategoryState> {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: []
    }
  }

  public componentDidMount() {
    this.getRootCategoryList();
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
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const getDataFormat = () => {
      let dataType: number = getFieldValue('dataType');
      if (dataType === 1) {
        return (
          <Select placeholder='请选择' style={{ width: 260 }}>
            <Select.Option value='Csv'>Csv</Select.Option>
            <Select.Option value='Excel'>Excel</Select.Option>
          </Select>
        );
      } else if (dataType === 2) {
        return (
          <Select placeholder='请选择' style={{ width: 260 }}>
            <Select.Option value='Json'>Json</Select.Option>
            <Select.Option value='Xml'>Xml</Select.Option>
          </Select>
        )
      } else if (dataType === 3) {
        return (
          <Select placeholder='请选择' style={{ width: 260 }}>
            <Select.Option value='Oracle'>Oracle</Select.Option>
            <Select.Option value='Mysql'>Mysql</Select.Option>
            <Select.Option value='PostgreSQL'>PostgreSQL</Select.Option>
          </Select>
        )
      } else {
        return (
          <Select disabled={true} placeholder='请先选择数据类型' style={{ width: 260 }}>
            <Select.Option value='Csv'>Csv</Select.Option>
            <Select.Option value='Excel'>Excel</Select.Option>
          </Select>
        )
      }
    }
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label='所属目录'>
            {
              getFieldDecorator('category', {
                rules: [
                  { required: true, message: '所属目录不能为空' }
                ],
                initialValue: this.props.currentNode ? this.props.currentNode.rootId : undefined
              })(
                <Select style={{ width: 260 }} placeholder='请选择'>
                  {
                    this.state.categoryList.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label='子目录名称'>
            {
              getFieldDecorator('name', {
                validateTrigger: ['onBlur'],
                rules: [
                  { required: true, message: '子目录名称不能为空' }
                ],
                initialValue: this.props.currentNode ? this.props.currentNode.name : undefined
              })(
                <Input disabled={!getFieldValue('category')}
                  placeholder={getFieldValue('category') ? '请输入' : '请先选择所属目录'}
                />
              )
            }
          </Form.Item>
          <Form.Item label='数据类型'>
            {
              getFieldDecorator('dataType', {
                rules: [
                  { required: true, message: '数据类型不能为空' }
                ],
                initialValue: this.props.currentNode ? Number(this.props.currentNode.dataType) : undefined
              })(
                <Select style={{ width: 260 }} placeholder='请选择' onChange={this.changeDataType}>
                  <Select.Option value={1}>文件</Select.Option>
                  <Select.Option value={2}>接口</Select.Option>
                  <Select.Option value={3}>库表</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label='数据格式'>
            {
              getFieldDecorator('dataFormat', {
                validateTrigger: ['onChange'],
                rules: [
                  { required: true, message: '数据格式不能为空' }
                ],
                initialValue: this.props.currentNode ? this.props.currentNode.dataFormat : undefined
              })(
                getDataFormat()
              )
            }
          </Form.Item>
          <Form.Item label='共享权限'>
            {
              getFieldDecorator('sharePermission', {
                rules: [
                  { required: true, message: '共享权限不能为空' }
                ],
                initialValue: this.props.currentNode ? Number(this.props.currentNode.shareType) : undefined
              })(
                <Radio.Group>
                  <Radio value={1}>申请使用</Radio>
                  <Radio value={2}>无需申请</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label='开放权限'>
            {
              getFieldDecorator('openPermission', {
                rules: [
                  { required: true, message: '开发权限不能为空' }
                ],
                initialValue: this.props.currentNode ? Number(this.props.currentNode.shareOpenType) : undefined
              })(
                <Radio.Group>
                  <Radio value={1}>有条件开放</Radio>
                  <Radio value={2}>无条件开放</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label=' ' colon={false}>
            <div>
              <Button type='primary' style={{ marginRight: 20 }} onClick={this.saveHandler}>保存</Button>
              <Button onClick={this.props.closeModal}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
  private changeDataType = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      dataFormat: undefined
    })
  }
  private getRootCategoryList = async () => {
    try {
      const { status, message, data } = await request.post('/collection/info/DirectoryRoot/listAllRootDirectory', {}, {
        loading: true,
        loadingTitle: '获取根目录列表中……'
      });
      if (status === 200) {
        this.setState({
          categoryList: data
        });
      } else {
        Msg.warn(message);
      }
    } catch (e) {
      Msg.error('服务器错误');
    }
  }
  private saveHandler = () => {
    const { validateFields } = this.props.form;
    validateFields((error, value): any => {
      if (error) {
        return Msg.warn('请按规则完善所有字段');
      }
      if (this.props.editOrNew) {
        this.editSave(value);
      } else {
        this.newAdd(value);
      }
    });
  }
  private editSave = async (value: any) => {
    const params = {
      id: this.props.currentNode.id,
      dataFormat: value.dataFormat,
      dataType: value.dataType,
      name: value.name,
      rootId: value.category,
      shareOpenType: value.openPermission,
      shareType: value.sharePermission
    }
    try {
      const { status, message } = await request.post('/collection/info/DirectorySub/update', params, {
        loading: true,
        loadingTitle: '修改子目录中……'
      });
      if (status === 200) {
        Msg.success('修改成功');
        this.props.getDirList();
        this.props.closeModal();
      } else {
        Msg.warn(message);
      }
    } catch (error) {
      Msg.error('服务器错误');
    }
  }
  private newAdd = async (value: any) => {
    const params = {
      dataFormat: value.dataFormat,
      dataType: value.dataType,
      name: value.name,
      rootId: value.category,
      shareOpenType: value.openPermission,
      shareType: value.sharePermission
    }
    try {
      const { status, message } = await request.post('/collection/info/DirectorySub/createSubdirectory', params, {
        loading: true,
        loadingTitle: '创建子目录中……'
      });
      if (status === 200) {
        Msg.success('创建成功');
        this.props.getDirList();
        this.props.closeModal();
      } else {
        Msg.warn(message);
      }
    } catch (error) {
      Msg.error('服务器错误');
    }
  }
}

export default Form.create<INewChildCategoryProps>()(NewChildCategory);
