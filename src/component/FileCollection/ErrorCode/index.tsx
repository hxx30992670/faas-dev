import * as React from 'react';
import {Button, Table, Icon, message as Message} from 'antd';
import { FormComponentProps } from "antd/lib/form";
import { EditableCell, EditableFormRow } from './table';
import style from "./style.module.less";

interface IRequestParamsProps extends  FormComponentProps {

}

interface IRequestParamsProps{
  fieldList: any[],
  changeFields : (data: any[]) => void,
}


interface IRules {
  required?: boolean,
  message: string,
  validator?: any,
  max?: number,
  pattern?: RegExp
}

class RequestParams extends React.Component<IRequestParamsProps, any> {
  public rowEL: any;
  constructor(props: IRequestParamsProps) {
    super(props);
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
            <span className={style.text}>名称</span>
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
            <span className={style.text}>说明</span>
          </div>
        ),
        dataIndex: 'description',
        key: 'description',
        editable: true
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
				    <Button type='link' title={'删除'} style={{color: 'red'}} onClick={this.removeRow.bind(this, row)}>
					    <Icon type={'delete'} />
				    </Button>
			    </div>
		    )
	    }
    ];
    const getSelectOptions = (dataIndex: string) => {
    	let result: any[] = [];
    	if(dataIndex === 'must') {
    		result = [
			    {key: Math.random(), text: '是', value: 1},
			    {key: Math.random(), text: '否', value: 2}
		    ]
	    }else if(dataIndex === 'type') {
    		result = [
			    {key: Math.random(), text: 'Bigint', value: 1},
			    {key: Math.random(), text: 'Varchar', value: 2},
			    {key: Math.random(), text: 'Double', value: 3},
			    {key: Math.random(), text: 'Datetime', value: 4},
			    {key: Math.random(), text: 'time', value: 41},
			    {key: Math.random(), text: 'date', value: 43},
		    ]
	    } else {
    		result = [];
	    }
    	return result;
    }
    columns = columns.map((col: any) => {
	    return {
		    ...col,
		    onCell: record => ({
			    record,
			    editable: col.editable,
			    dataIndex: col.dataIndex,
			    inputtype: col.dataIndex === 'type' ? 'select' : col.dataIndex === 'must' ? 'select' : 'input',
			    selectoption: getSelectOptions(col.dataIndex),
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
          rowClassName={rowClassName} ref={el => this.rowEL = el} pagination={false} rowKey={'id'}
        />
      </div>
    );
  }
  public getRule = (value: string): any[] => {
    let result: IRules[] = [];
    if (value === 'name') {
      result = [
        { required: true, message: '名称不能为空' },
        { max: 64, message: '名称最长不能超出64' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '名称必须是字母、数字、下划线' },
        { pattern: /[a-zA-Z]+/, message: '名称必须包含字母' },
        { pattern: /^[^\s]+$/g, message: '名称不能包含空格' }
      ]
    } else if (value === 'must') {
      result = [
        { required: true, message: '是否必填不能为空' },
      ]
    } else if (value === 'type') {
      result = [
        { required: true, message: '类型不能为空' }
      ]
    } else if (value === 'description') {
      result = [
        { required: true, message: '说明不能为空' },
	      { max: 100, message: '说明长度不能超出100' },
	      { pattern: /^[^\s]+$/g, message: '说明不能包含空格' }
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
    const index = newData.findIndex((data: any) => row.id === data.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.changeFields(newData);
  };

  private addRow = () => {
  	let fieldList: any[] = this.props.fieldList;
  	let newData = {
		  id: Math.random(),
		  name: '',
		  description: ''
	  }
  	fieldList.push(newData);
  	this.props.changeFields(fieldList);
  }
  private removeRow = (row: any) => {
  	let {fieldList} = this.props;
  	if(fieldList.length > 1) {
  		fieldList = fieldList.filter(item => item.id !== row.id);
  		this.props.changeFields(fieldList);
	  }else {
  		Message.warning('错误码说明至少保留一行');
	  }
  }
}


export default RequestParams

