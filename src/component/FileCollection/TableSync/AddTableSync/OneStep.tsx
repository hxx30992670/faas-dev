import React, {Component} from 'react';
import {Form, Cascader, message as Message, Select} from "antd";
import {FormComponentProps} from 'antd/lib/form';
import request from "src/utils/Request";

import {IFormData} from './index';

export interface IOneStepProps extends FormComponentProps {
  formData: IFormData,
  changeFormData: (data: any) => void
}

export interface IOneStepState {
  categoryList: any[],
  sourceDatabaseList: any[];
}

class OneStep extends Component<IOneStepProps, IOneStepState> {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      sourceDatabaseList: []
    }
    this.getCategoryList();
    this.getSourceDatabase();
  }

  public render() {
    const {getFieldDecorator} = this.props.form;
    const {formData} = this.props;
    const displayRender = (fields) => {
      return fields[fields.length - 1];
    }
    const filedNames = {
      label: 'name',
      children: 'childNode',
      value: 'id'
    }
    return (
      <div>
        <Form.Item label={'所属目录'}>
          {
            getFieldDecorator('category', {
              rules: [
                {required: true, message: '所属目录不能为空'}
              ],
              initialValue: formData.category
            })(
              <Cascader
                fieldNames={filedNames}
                displayRender={displayRender}
                options={this.state.categoryList}
                placeholder={'请选择所属目录'}
                style={{width: 260}}
                onChange={this.changeCategory}
              />
            )
          }
        </Form.Item>
        <Form.Item label={'源数据库'}>
          {
            getFieldDecorator('sourceDatabase', {
              rules: [
                {required: true, message: '源数据不能为空'}
              ],
              initialValue: formData.sourceDatabase
            })(
              <Select style={{width: 260}} onChange={this.changeSourceDatabase}>
                {
                  this.state.sourceDatabaseList.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            )
          }
        </Form.Item>
      </div>
    );
  }

  private getCategoryList = async () => {
    try {
      const {data, message, status} = await request.post("/collection/info/DirectoryRoot/listRootAndSupDirectory", {}, {
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
  private getSourceDatabase = async () => {
    try {
      const {status, message, data} = await request.post('/collection/info/DbSource/getAllDbsource', {}, {
        loading: true,
        loadingTitle: '获取源数据库表……'
      });
      if (status === 200) {
        this.setState({
          sourceDatabaseList: data
        });
      } else {
        Message.warn(message);
      }
    } catch (e) {
      Message.error('服务器错误');
    }
  }
  private changeCategory = (val: string[]) => {
    let {formData, changeFormData} = this.props;
    formData.category = val;
    changeFormData(formData);
  }
  private changeSourceDatabase = (val) => {
    let {formData, changeFormData} = this.props;
    formData.sourceDatabase = val;
    changeFormData(formData);
  }
}

export default OneStep;