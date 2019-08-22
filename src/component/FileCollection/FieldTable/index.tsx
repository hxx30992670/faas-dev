import * as React from 'react';
import { Table } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import { EditableCell, EditableFormRow } from './table';
import style from "./style.module.less";

interface IFieldTableProps extends FormComponentProps {
  fieldList: any[],
  changeFields: (data: any[]) => void,
  getRowRef: (el: any) => void
}

class FieldTable extends React.Component<IFieldTableProps, any> {
  public rowEL: any
  constructor(props: IFieldTableProps) {
    super(props);
  }
  public componentDidMount() {
    this.props.getRowRef(this.rowEL);
  }

  public render() {
    console.log(this.props.fieldList);
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
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
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        editable: true
      },
      {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        editable: true
      }
    ];
    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          inputtype: col.dataIndex === 'type' ? 'select' : 'input',
          title: col.title,
          handleSave: this.handleSave,
        }),
      }
    })
    const rowClassName = (record, index) => 'editable-row'
    return (
      <div className={style.container}>
        <Table bordered={true} columns={columns} dataSource={this.props.fieldList} components={components}
          rowClassName={rowClassName} ref={el => this.rowEL = el} pagination={false}
        />
      </div>
    );
  }
  public validateTable = () => {
    this.props.form.validateFields((error, values) => {
      if (error) {
        console.log(error);
      } else {
        console.log(values)
      }
    })
  }

  public handleSave = (row: any) => {
    const newData = [...this.props.fieldList];
    const index = newData.findIndex((data: any) => row.key === data.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.changeFields(newData);
  };
}


export default FieldTable

