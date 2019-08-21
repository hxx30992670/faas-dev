import * as React from 'react';
// import style from './style.module.less';
import {Table, Form} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import EditCell from "./td";
// import { FromTo } from 'moment';
// const EditableContext = React.createContext({});

export interface IFieldTableProps extends FormComponentProps {
  fieldList: any[],
}

class FieldTable extends React.Component<IFieldTableProps, any> {
  constructor(props: IFieldTableProps) {
    super(props);
    
  }
  
  public render() {
    console.log(this.props.form)
    let columns = [
      {
        title: '中文名称',
        dataIndex: 'name',
        key: 'name',
        editable: true,
      },
      {
        title: '英文名称',
        dataIndex: 'nameEng',
        key: 'nameEng',
        editable: true,
      }
    ];
    const Component = {
      body: {
        cell: EditCell
      }
    }
    columns = columns.map(item => {
      return {
        ...item,
        onCell: record => ({
          record,
          dataIndex: item.dataIndex,
          title: item.title,
        }),
      }
    })
    return (
      <Table columns={columns} dataSource={this.props.fieldList} components={Component}/>
    );
  }
  public validateTable = () => {
    this.props.form.validateFields((error, values) => {
      if(error) {
        console.log(error);
      }else {
        console.log(values)
      }
    })
  }
}

export default Form.create({
  name: 'formTable'
})(FieldTable)