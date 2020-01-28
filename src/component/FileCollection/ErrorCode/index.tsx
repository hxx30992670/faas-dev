import * as React from 'react';
import {Table, Button, Icon, Form, Input, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColumnProps} from 'antd/lib/table'
import style from './style.module.less';

export interface IErrorCodeProps extends FormComponentProps {
}

export interface IErrorCodeProps {
	fieldList: any[],
	changeFields: (data: any[]) => void,
}
export interface IErrorCodeState {

}
interface IFiled {
	id: string|number;
	name: string;
	desc: string;
}

 class ErrorParams extends React.Component<IErrorCodeProps, IErrorCodeState> {
	constructor(props) {
		super(props);
	}

	public render() {
		const {fieldList} = this.props;
		const columns: Array<ColumnProps<IFiled>> = [
			{
				title: (
					<div className={style.headerBox}>
						<span className={style.mark}>*</span>
						<span className={style.text}>名称</span>
					</div>
				),
				dataIndex: 'name',
				render: (text, record: IFiled) => {
					return (
						<Form.Item>
							{
								this.props.form.getFieldDecorator('errorName' + record.id, {
									validateTrigger: ['onBlur'],
									rules: [
										{required: true, message: '名称不能为空'},
										{max: 64, message: '名称最长不能超出64'},
										{pattern: /^[a-zA-Z0-9_]+$/, message: '名称必须是字母、数字、下划线'},
										{pattern: /[a-zA-Z]+/, message: '名称必须包含字母'},
										{pattern: /^[^\s]+$/g, message: '名称不能包含空格'}
									],
									initialValue: text,
								})(<Input onChange={this.changeInputValue.bind(this, record, 'name')}/>)
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
				render: (text, record: IFiled) => {
					return (
						<Form.Item>
							{
								this.props.form.getFieldDecorator('errorDesc' + record.id, {
									validateTrigger: ['onBlur'],
									rules: [
										{required: true, message: '说明不能为空'},
										{max: 100, message: '说明最长不能超出100'},
										{pattern: /^[^\s]+$/g, message: '名称不能包含空格'}
									],
									initialValue: text,
								})(<Input onChange={this.changeInputValue.bind(this, record, 'desc')}/>)
							}

						</Form.Item>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				width: 120,
				render:(text, record: IFiled) => {
					return (
						<div>
							<Button type='link' title={'新增'} onClick={this.addRow}>
								<Icon type='plus'/>
							</Button>
							<Button type='link' title={'删除'} style={{color: 'red'}} onClick={this.removeRow.bind(this, record)}>
								<Icon type={'delete'}/>
							</Button>
						</div>
					)
				}
			}
		];
		//const rowClassName = (record, index) => 'editable-row'
		return (
			<Table<IFiled> dataSource={fieldList} columns={columns} rowKey='id'
				bordered={true}
				pagination={false}
				rowClassName={()=> 'editable-row'} />
		);
	}

	public addRow = () => {
		let {fieldList} = this.props;
		fieldList = [...fieldList, {
			id: Date.now(),
			name: '',
			desc: ''
		}];
		this.props.changeFields(fieldList);
	}
	public removeRow = (row) => {
		let {fieldList, changeFields} = this.props;
		if (fieldList.length <= 1) {
			message.warning('错误码说明最少保留一条记录');
			return;
		}
		fieldList = fieldList.filter(item => item.id !== row.id);
		changeFields(fieldList);
	}
	public changeInputValue = (row, key, e) => {
		const {fieldList} = this.props;
		//const newData = [...this.props.fieldList];
		fieldList.forEach(item => {
			if(item.id === row.id) {
				item[key] = e.currentTarget.value;
			}
		});
		//const index = fieldList.findIndex((data: any) => row.id === data.id);
		//const item = fieldList[index];
		//item[key] = e.currentTarget.value;
		/*newData.splice(index, 1, {
			...item,
			...row,
		});*/
		this.props.changeFields(fieldList);
	}
}

export default ErrorParams;
