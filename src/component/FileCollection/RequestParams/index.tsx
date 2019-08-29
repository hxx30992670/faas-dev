import * as React from 'react';
import { Table, Button, Icon, Form, Input, Select, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import style from './style.module.less';

interface IRequestParamsProps extends FormComponentProps {
}
interface IRequestParamsProps {
  fieldList: any[],
  changeFields: (data: any[]) => void,
}

export default class RequestParams extends React.Component<IRequestParamsProps> {
  public render() {
    const typeList = [
      { key: Math.random(), text: 'Bigint', value: 1 },
      { key: Math.random(), text: 'Varchar', value: 2 },
      { key: Math.random(), text: 'Double', value: 3 },
      { key: Math.random(), text: 'Datetime', value: 4 },
      { key: Math.random(), text: 'time', value: 41 },
      { key: Math.random(), text: 'date', value: 43 },
    ];
    const columns = [
      {
        title: (
          <div className={style.headerBox}>
            <span className={style.mark}>*</span>
            <span className={style.text}>名称</span>
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        render: (text, row) => {
          return (
            <Form.Item>
              {
                this.props.form.getFieldDecorator('requestName' + row.id, {
                  validateTrigger: ['onBlur'],
                  rules: [
                    { required: true, message: '名称不能为空' },
                    { max: 64, message: '名称最长不能超出64' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '名称必须是字母、数字、下划线' },
                    { pattern: /[a-zA-Z]+/, message: '名称必须包含字母' },
                    { pattern: /^[^\s]+$/g, message: '名称不能包含空格' }
                  ],
                  initialValue: text,
                })(<Input onChange={this.changeInput.bind(this, row, 'name')} />)
              }

            </Form.Item>
          )
        }
      },
      {
        title: (
          <div className={style.headerBox}>
            <span className={style.mark}>*</span>
            <span className={style.text}>是否必填</span>
          </div>
        ),
        dataIndex: 'must',
        key: 'must',
        render: (text, row) => {
          return (
            <Form.Item>
              {
                this.props.form.getFieldDecorator('requestMust' + row.id, {
                  validateTrigger: ['onChange'],
                  rules: [
                    { required: true, message: '是否必填不能为空' },
                  ],
                  initialValue: text,
                })(
                  <Select onChange={this.changeSelect.bind(this, row, 'must')}>
                    <Select.Option value={1}>是</Select.Option>
                    <Select.Option value={2}>否</Select.Option>
                  </Select>
                )
              }

            </Form.Item>
          )
        }
      },
      {
        title: (
          <div className={style.headerBox}>
            <span className={style.mark}>*</span>
            <span className={style.text}>类型</span>
          </div>
        ),
        dataIndex: 'type',
        key: 'type',
        render: (text, row) => {
          return (
            <Form.Item>
              {
                this.props.form.getFieldDecorator('requestType' + row.id, {
                  validateTrigger: ['onChange'],
                  rules: [
                    { required: true, message: '类型不能为空' },
                  ],
                  initialValue: text,
                })(
                  <Select onChange={this.changeSelect.bind(this, row, 'type')}>
                    {
                      typeList.map(item => (
                        <Select.Option key={item.key} value={item.value}>{item.text}</Select.Option>
                      ))
                    }
                  </Select>
                )
              }

            </Form.Item>
          )
        }
      },
      {
        title: (
          <div className={style.headerBox}>
            <span className={style.mark}>*</span>
            <span className={style.text}>说明</span>
          </div>
        ),
        dataIndex: 'desc',
        key: 'desc',
        render: (text, row) => {
          return (
            <Form.Item>
              {
                this.props.form.getFieldDecorator('requestDesc' + row.id, {
                  validateTrigger: ['onBlur'],
                  rules: [
                    { required: true, message: '说明不能为空' },
                    { max: 100, message: '说明最长不能超出100' },
                    { pattern: /^[^\s]+$/g, message: '名称不能包含空格' }
                  ],
                  initialValue: text,
                })(<Input onChange={this.changeInput.bind(this, row, 'desc')} />)
              }

            </Form.Item>
          )
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: 120,
        render: (text, row) => (
          <div>
            <Button type='link' title={'新增'} onClick={this.addRow}>
              <Icon type="plus" />
            </Button>
            <Button type='link' title={'删除'} style={{ color: 'red' }} onClick={this.removeRow.bind(this, row)}>
              <Icon type={'delete'} />
            </Button>
          </div>
        )
      }
    ];
    const rowClassName = (record, index) => 'editable-row'
    return (
      <div className={style.container}>
        <Table dataSource={this.props.fieldList} columns={columns} rowKey='id' rowClassName={rowClassName} bordered={true}
          pagination={false}
        />
      </div>
    );
  }
  public addRow = () => {
    let { fieldList } = this.props;
    fieldList = [...fieldList, {
      id: Date.now(),
      name: '',
      type: 1,
      must: 1,
      desc: ''
    }];
    this.props.changeFields(fieldList);
  }
  public removeRow = (row) => {
    let { fieldList, changeFields } = this.props;
    if (fieldList.length <= 1) {
      message.warning('请求参数说明最少保留一条记录');
      return;
    }
    fieldList = fieldList.filter(item => item.id !== row.id);
    changeFields(fieldList);
  }
  private changeInput = (row, key, val: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...this.props.fieldList];
    const index = newData.findIndex((data: any) => row.id === data.id);
    const item = newData[index];
    item[key] = val.currentTarget.value
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.changeFields(newData);
  }
  private changeSelect = (row, key, val) => {
    const newData = [...this.props.fieldList];
    const index = newData.findIndex((data: any) => row.id === data.id);
    const item = newData[index];
    item[key] = val;
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.changeFields(newData);
  }
}
