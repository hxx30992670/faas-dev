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

interface IRules {
  required?: boolean,
  message: string,
  validator?: any,
  max?: number,
  pattern?: RegExp
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
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    let columns = [
      {
        title: (
          <div className={style.headerBox}>
            <span className={style.mark}>*</span>
            <span className={style.text}>中文名称</span>
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        editable: true,
      },
      {
        title: (
          <div className={style.headerBox}>
            <span className={style.mark}>*</span>
            <span className={style.text}>英文名称</span>
          </div>
        ),
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
        title: (
          <div className={style.headerBox}>
            <span className={style.mark}>*</span>
            <span className={style.text}>说明</span>
          </div>
        ),
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
          rules: this.getRule(col.dataIndex),
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
  public getRule = (value: string): any[] => {
    let result: IRules[] = [];
    if (value === 'name') {
      result = [
        { required: true, message: '中文名称不能为空' },
        { max: 64, message: '中文名称最长不能超出64' },
        { pattern: /^[\u4e00-\u9fa5 a-zA-Z0-9_]+$/, message: '中文名称必须是字母、中文、数字、下划线' },
        { pattern: /[\u4e00-\u9fa5 a-zA-Z]+/, message: '中文名称必须包含中文或者字母' },
        { pattern: /^[^\s]+$/g, message: '中文名称不能包含空格' }
      ]
    } else if (value === 'nameEng') {
      result = [
        { required: true, message: '英文名称不能为空' },
        { max: 64, message: '英文名称最长不能超出64' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '英文名称必须是字母、数字、下划线' },
        { pattern: /[a-zA-Z]+/, message: '英文名称必须包含字母' },
        { pattern: /^[^\s]+$/g, message: '英文名称不能包含空格' }
      ]
    } else if (value === 'type') {
      result = [
        { required: true, message: '类型不能为空' }
      ]
    } else if (value === 'description') {
      result = [
        { required: true, message: '说明不能为空' }
      ]
    }
    return result;
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

