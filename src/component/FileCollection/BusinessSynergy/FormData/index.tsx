import * as React from 'react';
import style from './style.module.less';
import {Form, Cascader, Input, message as Message, Button} from 'antd';
import {RouteComponentProps} from 'react-router-dom';

const {Item} = Form;
import {FormComponentProps} from 'antd/lib/form';
import {IField} from './FieldList';
import FieldList from './FieldList';
import request from '../../../../utils/Request';

export interface IFormDataProps extends FormComponentProps {

}
export interface IFormDataProps extends RouteComponentProps {

}


interface IFormDataState {
	categoryList: any[],
	fieldList: IField[]
}

class FormData extends React.Component<IFormDataProps, IFormDataState> {
	constructor(props) {
		super(props);
		this.state = {
			categoryList: [],
			fieldList: [
				{
					id: Date.now(),
					name: '',
					nameEng: '',
					type: '',
					description: ''
				}
			]
		}
	}
	public componentDidMount(): void {
		this.getCatalogList();
	}

	public render() {
		const formItemLayout = {
			labelCol: {
				xs: 24,
				sm: 2
			},
			wrapperCol: {
				xs: 24,
				sm: 20
			}
		}
		const {getFieldDecorator} = this.props.form;
		const displayRender = (field: any[]) => {
			return field[field.length - 1];
		}
		const filedNames = {
			label: 'name',
			children: 'childNode',
			value: 'id'
		}
		return (
			<div className={style.container}>
				<Form {...formItemLayout}>
					<Item label={'所属目录'}>
						{
							getFieldDecorator('category', {
								rules: [
									{required: true, message: '所属目录不能为空'}
								]
							})(
								<Cascader
									fieldNames={filedNames}
									displayRender={displayRender}
									options={this.state.categoryList}
									placeholder={'请选择所属目录'}
									className={style.customSelect}
								/>
							)
						}
					</Item>
					<Item label={'数据名称'}>
						{
							getFieldDecorator('dataName', {
								rules: [
									{required: true, message: '数据名称不能为空'}
								]
							})(
								<Input/>
							)
						}
					</Item>
					<Item label={'数据描述'}>
						{
							getFieldDecorator('dataDesc', {
								rules: [
									{required: true, message: '数据描述不能为空'}
								]
							})(
								<Input.TextArea autosize={{minRows: 3, maxRows: 5}}/>
							)
						}
					</Item>
					<Item label={'数据用途'}>
						{
							getFieldDecorator('dataUse', {
								rules: [
									{required: true, message: '数据用途不能为空'}
								]
							})(
								<Input.TextArea autosize={{minRows: 3, maxRows: 5}}/>
							)
						}
					</Item>
					<Item label={'所属系统'}>
						{
							getFieldDecorator('dataSource', {
								rules: [
									{required: true, message: '所属系统不能为空'}
								]
							})(
								<Input.TextArea autosize={{minRows: 3, maxRows: 5}}/>
							)
						}
					</Item>
					<Item label={'数据字段'}>
						<FieldList
							fieldList={this.state.fieldList}
							form={this.props.form}
							addFieldRow={this.addFieldRow}
							removeFieldRow={this.removeFieldRow}
							changeFieldData={this.changeFieldData}
						/>
					</Item>
					<Item label={'数据包'}>
						{
							getFieldDecorator('dataTag', {
								rules: [
									{required: true, message: '数据包不能为空'}
								],
							})(
								<Input.TextArea autosize={{minRows: 3, maxRows: 5}} />
							)
						}
					</Item>
					<Item label={' '} colon={false}>
						<Button type='primary' onClick={this.submitHandler}>提交</Button>
					</Item>
				</Form>
			</div>
		);
	}

	private getCatalogList = async () => {
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

	private submitHandler = () => {
		const {validateFields} = this.props.form;
		validateFields(async (error,value) => {
			if(error) {
				Message.warn('请按规则完善所有字段');
				return;
			}
			const params = {
				subDirectoryId: value.category[1],
				dataName: value.dataName,
				dataDescription: value.dataDesc,
				dataPurpose: value.dataUse,
				dataSource: value.dataSource,
				dataField: this.state.fieldList.map(item => {
					return {
						chineseName: item.name,
						description: item.description,
						englishName: item.nameEng,
						type: item.type
					}
				}),
				dataPackage: value.dataTag
			}
			try {
				const {message, status} = await request.post('/collection-kafka-management/createSynergyData', params, {
					loading: true,
					loadingTitle: '保存中……'
				});
				if(status === 200) {
					Message.success('保存成功！').then(() => {
						this.props.history.push('/data-manager/data-list');
					}, () => {})
				} else {
					Message.warn(message);
				}
			} catch (e) {
				Message.error('服务器错误');
			}
		});
	}
	private addFieldRow = () => {
		let {fieldList} = this.state;
		fieldList = [...fieldList, {
			id: Date.now(),
			name: '',
			nameEng: '',
			type: '',
			description: ''
		}];
		this.setState({
			fieldList
		})
	}
	private removeFieldRow = (row: IField) => {
		let {fieldList} = this.state;
		if(fieldList.length <= 1) {
			Message.warn('数据字段至少需要一条数据');
			return;
		}
		fieldList = fieldList.filter(item => item.id !== row.id);
		this.setState({
			fieldList
		})
	}
	private changeFieldData = (data: IField[]) => {
		this.setState({
			fieldList: data
		})
	}
}

export default Form.create<IFormDataProps>()(FormData);