import * as React from 'react';
import {ChangeEvent} from 'react'
import {Button, Form, Input, Select, Table, Icon} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColumnProps} from 'antd/lib/table';
import style from "./style.module.less";

interface IFieldListProps extends FormComponentProps {
	fieldList: IField[],
	addFieldRow: () => void,
	removeFieldRow: (row: IField) => void
	changeFieldData: (data: IField[]) => void
}

interface IFieldListState {

}

export interface IField {
	id: any;
	name: string;
	nameEng: string;
	type: number | string;
	description: string;
}

class FieldList extends React.Component<IFieldListProps, IFieldListState> {
	public render() {
		const rowClassName = () => 'editable-row'
		const columns: Array<ColumnProps<IField>> = [
			{
				title: (
					<div className={style.headerBox}>
						<span className={style.mark}>*</span>
						<span className={style.text}>中文名称</span>
					</div>
				),
				dataIndex: 'name',
				render: (value, row) => (
					<Form.Item>
						{
							this.props.form.getFieldDecorator('name' + row.id, {
								rules: [
									{required: true, message: '中文名称不能为空'}
								],
								initialValue: value
							})(
								<Input onChange={this.changeInputValue.bind(this, 'name', row)}/>
							)
						}
					</Form.Item>
				)
			},
			{
				title: (
					<div className={style.headerBox}>
						<span className={style.mark}>*</span>
						<span className={style.text}>英文名称</span>
					</div>
				),
				dataIndex: 'nameEng',
				render: (value, row) => (
					<Form.Item>
						{
							this.props.form.getFieldDecorator('nameEng' + row.id, {
								rules: [
									{required: true, message: '英文名称不能为空'}
								],
								initialValue: value
							})(
								<Input onChange={this.changeInputValue.bind(this, 'nameEng', row)}/>
							)
						}
					</Form.Item>
				)
			},
			{
				title: (
					<div className={style.headerBox}>
						<span className={style.mark}>*</span>
						<span className={style.text}>类型</span>
					</div>
				),
				dataIndex: 'type',
				render: (value, row) => (
					<Form.Item>
						{
							this.props.form.getFieldDecorator('type' + row.id, {
								rules: [
									{required: true, message: '类型不能为空'},
								],
								initialValue: value
							})(
								<Select onChange={(val) => this.changeSelectValue('type', row, val)}>
									<Select.Option value={1}>Bigint</Select.Option>
									<Select.Option value={2}>Varchar</Select.Option>
									<Select.Option value={3}>Double</Select.Option>
									<Select.Option value={4}>Datetime</Select.Option>
									<Select.Option value={5}>Array</Select.Option>
									<Select.Option value={6}>Object</Select.Option>
								</Select>
							)
						}
					</Form.Item>
				)
			},
			{
				title: (
					<div className={style.headerBox}>
						<span className={style.mark}>*</span>
						<span className={style.text}>说明</span>
					</div>
				),
				dataIndex: 'description',
				render: (value, row) => (
					<Form.Item>
						{
							this.props.form.getFieldDecorator('description', {
								rules: [
									{required: true, message: '说明不能为空'}
								],
								initialValue: value
							})(
								<Input onChange={this.changeInputValue.bind(this, 'description', row)}/>
							)
						}
					</Form.Item>
				)
			},
			{
				title: '操作',
				key: 'operation',
				dataIndex: 'operation',
				render: (value, row) => {
					return (
						<div>
							<Button type={'link'} title={'增加'} onClick={this.props.addFieldRow}>
								<Icon type={'file-add'} className={'bigSize'} />
							</Button>
							<Button type={'link'} title={'删除'} onClick={this.props.removeFieldRow.bind(this,row)}>
								<Icon type="delete" className={'bigSize'} style={{color: 'red'}} />
							</Button>
						</div>
					)
				}
			}
		]
		return (
			<div>
				<Table<IField> columns={columns} dataSource={this.props.fieldList} rowKey={'id'} bordered={true}
					rowClassName={rowClassName} className={style.customTable} pagination={false}/>
			</div>
		);
	}

	private changeInputValue = (key: string, row: IField, e: ChangeEvent<HTMLInputElement>) => {
		const {fieldList, changeFieldData} = this.props;
		fieldList.forEach(item => {
			if (item.id === row.id) {
				item[key] = e.currentTarget.value;
			}
		});
		changeFieldData(fieldList);
	}

	private changeSelectValue(key: string, row, val) {
		const {fieldList, changeFieldData} = this.props;
		fieldList.forEach(item => {
			if (item.id === row.id) {
				item[key] = val;
			}
		});
		changeFieldData(fieldList);
	}
}

export default FieldList;