import React, { ChangeEvent, Component } from 'react';
import { Form, Cascader, message as Message, Select, Table, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import request from 'src/utils/Request';
import { IFormData } from './index';
import style from './style.module.less'


export interface IOneStepProps extends FormComponentProps {
	formData: IFormData,
	changeFormData: (data: any) => void
}

export interface IOneStepState {
	categoryList: any[],
	sourceDatabaseList: any[];
	sourceTableList: any[];
	fieldList: any[];
}

class OneStep extends Component<IOneStepProps, IOneStepState> {
	constructor(props) {
		super(props);
		this.state = {
			categoryList: [],
			sourceDatabaseList: [],
			sourceTableList: [],
			fieldList: []
		}
	}
	public componentDidMount(): void {
		this.getCategoryList();
		this.getSourceDatabase();
		if (this.props.formData.sourceDatabase) {
			this.getSourceTableListData(this.props.formData.sourceDatabase);
		}
	}

	public render() {
		const { getFieldDecorator } = this.props.form;
		const { formData } = this.props;
		const displayRender = (fields) => {
			return fields[fields.length - 1];
		};
		const filedNames = {
			label: 'name',
			children: 'childNode',
			value: 'id'
		};
		const columns = [
			{
				title: '中文名称',
				dataIndex: 'name',
				render: (value, row) => (
					<Form.Item hasFeedback={true}>
						{
							getFieldDecorator('fieldName' + row.nameEng, {
								rules: [
									{ required: true, message: '中文名称不能为空' }
								],
								initialValue: value,
							})(<Input placeholder={'请输入'} onChange={this.changeFieldName.bind(this, row, 'name')} />)
						}
					</Form.Item>
				)
			},
			{
				title: '英文名称',
				dataIndex: 'nameEng',
			},
			{
				title: '类型',
				dataIndex: 'dataType',
			},
			{
				title: '长度',
				dataIndex: 'length',
				render: (value, row) => {
					if (value === 0 && row.dataType.toLowerCase() !== 'decimal') {
						return (
							<span>-</span>
						)
					} else {
						return <span>{value}</span>
					}
				}
			},
			{
				title: '说明',
				dataIndex: 'description',
				render: (value, row) => (
					<Form.Item hasFeedback={true}>
						{
							getFieldDecorator('fieldDescription' + row.nameEng, {
								rules: [
									{ required: true, message: '说明不能为空' }
								],
								initialValue: value
							})(
								<Input onChange={this.changeFieldName.bind(this, row, 'description')} />
							)
						}
					</Form.Item>
				)
			}
		];
		const rowClassName = () => 'editable-row'
		return (
			<div>
				<Form.Item label={'所属目录'} hasFeedback={true}>
					{
						getFieldDecorator('category', {
							rules: [
								{ required: true, message: '所属目录不能为空' }
							],
							initialValue: formData.category
						})(
							<Cascader
								fieldNames={filedNames}
								displayRender={displayRender}
								options={this.state.categoryList}
								placeholder={'请选择所属目录'}
								style={{ width: 260 }}
								onChange={this.changeCategory}
							/>
						)
					}
				</Form.Item>
				<Form.Item label={'源数据库'} hasFeedback={true}>
					{
						getFieldDecorator('sourceDatabase', {
							rules: [
								{ required: true, message: '源数据不能为空' }
							],
							initialValue: formData.sourceDatabase
						})(
							<Select style={{ width: 260 }} onChange={this.changeSourceDatabase}>
								{
									this.state.sourceDatabaseList.map((item) => (
										<Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
									))
								}
							</Select>
						)
					}
				</Form.Item>
				<Form.Item label={'源表'} hasFeedback={true}>
					{
						getFieldDecorator('sourceTable', {
							rules: [
								{ required: true, message: '源表不能为空' }
							],
							initialValue: formData.sourceTable
						})(
							<Select key={'2'} disabled={this.props.formData.sourceDatabase === ''} style={{ width: 260 }}
								onChange={this.changeSourceTable}>
								{
									this.state.sourceTableList.map((item, index) => (
										<Select.Option key={index} value={item.tableName}>
											{item.tableName}
										</Select.Option>
									))
								}
							</Select>
						)
					}
				</Form.Item>
				<Form.Item label={'信息项'}>
					<Table dataSource={this.props.formData.fieldList} columns={columns} rowKey={'nameEng'}
						rowClassName={rowClassName} bordered={true} pagination={false} className={style.customTable}
					/>
				</Form.Item>
			</div>
		);
	}

	private getCategoryList = async () => {
		try {
			const { data, message, status } = await request.post('/collection/info/DirectoryRoot/listRootAndSupDirectory', {}, {
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
			const { status, message, data } = await request.post('/collection/info/DbSource/getAllDbsource', {}, {
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
		let { formData, changeFormData } = this.props;
		formData.category = val;
		changeFormData(formData);
	}
	private changeSourceDatabase = (val) => {
		let { formData, changeFormData } = this.props;
		formData.sourceDatabase = val;
		this.getSourceTableListData(formData.sourceDatabase);
		changeFormData(formData);
	}
	private changeSourceTable = async (val) => {
		let { formData, changeFormData } = this.props;
		formData.sourceTable = val;
		await changeFormData(formData);
		this.getTableFieldListData();
	}
	private getSourceTableListData = async (id) => {
		try {
			const params = {
				dataSourceId: id
			}
			const { status, message, data } = await request.post('/collection/data/database/getTables', params, {
				loading: true,
				loadingTitle: '获取源表数据中……'
			});
			if (status === 200) {
				this.setState({
					sourceTableList: data
				});
			} else {
				this.setState({
					sourceTableList: []
				});
				Message.warn(message);
			}
		} catch (e) {

		}
	}
	private getTableFieldListData = async () => {
		try {
			const params = {
				dataSourceId: this.props.formData.sourceDatabase,
				tableName: this.props.formData.sourceTable
			}
			const { status, message, data } = await request.post('/collection/data/database/getColumns', params, {
				loading: true,
				loadingTitle: '获取表字段中……'
			});
			if (status === 200) {
				const { formData, changeFormData } = this.props;
				formData.fieldList = data;
				changeFormData(formData);
			} else if (status === 204) {
				Message.warn('该表没有字段数据……');
				this.setState({
					fieldList: []
				});
			} else {
				Message.warn(message);
			}
		} catch (e) {
			Message.error('服务器错误');
		}
	}
	private changeFieldName = (row, key, e: ChangeEvent<HTMLInputElement>) => {
		let { formData, changeFormData } = this.props;
		formData.fieldList.forEach(item => {
			if (item.nameEng === row.nameEng) {
				item.name = e.currentTarget.value
			}
		});
		changeFormData(formData);
	}
}

export default OneStep;