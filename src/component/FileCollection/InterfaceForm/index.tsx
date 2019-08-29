import * as React from 'react';
import { Form, Cascader, message as Message, Icon, Input, Select, Button } from "antd";
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from "react-router-dom";
import request from 'src/utils/Request';
import RequestParams from 'src/component/FileCollection/RequestParams';
import ResponseParams from 'src/component/FileCollection/ResponseParams';
import ErrorCode from 'src/component/FileCollection/ErrorCode';
import style from './style.module.less';
//import { requestForm } from "../RequestParams/table";
//import { responseForm } from '../ResponseParams/table';
//import { errorForm } from "../ErrorCode/table";
export interface IInterfaceFormProps extends FormComponentProps {

}
export interface IInterfaceFormProps extends RouteComponentProps {

}
export interface IInterfaceFormState {
	categoryList: any[];
	requestParams: any[];
	responseParams: any[];
	errorCode: any[];
	interfacePass: boolean,
	responseText: string
}

class InterfaceForm extends React.Component<IInterfaceFormProps, IInterfaceFormState>{
	constructor(props) {
		super(props);
		this.state = {
			categoryList: [],
			requestParams: [
				{ id: Date.now(), name: '', must: 1, type: 1, desc: '' }
			],
			responseParams: [
				{ id: Date.now(), name: '', nameEng: '', type: 1, description: '', length: 5000, rootId: '', subId: '' }
			],
			errorCode: [
				{ id: Date.now(), name: '', desc: '' }
			],
			interfacePass: false,
			responseText: ''
		}
		this.getCategoryList();
	}

	public render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 2 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 19 }
			}
		}
		const filedNames = {
			label: 'name',
			children: 'childNode',
			value: 'id'
		};
		const displayRender = (label) => {
			return label[label.length - 1];
		};

		/*验证数据名称是否重复*/
		const repeatName = async (rule, value, callBack) => {
			if (value) {
				const { status } = await request.post('/collection/info/Data/selectDataByName', { name: value });
				if (status === 200) {
					callBack();
				} else {
					callBack(Error('数据名称重复'));
				}
			} else {
				callBack();
			}
		}

		return (
			<Form {...formItemLayout} style={{fontSize: 12}}>
				<Form.Item label={'所属目录'} >
					<div className='form-inline'>
						{
							getFieldDecorator('category', {
								rules: [
									{ required: true, message: '所属目录不能为空' }
								]
							})(
								<Cascader
									fieldNames={filedNames}
									displayRender={displayRender}
									options={this.state.categoryList}
									placeholder={'请选择所属目录'}
									style={{ width: 260 }}
								/>

							)
						}
						<p className={'tips'}>
							*无关联目录，请先
									<span>创建目录！</span>
							<Icon type="info-circle" style={{ color: 'rgb(47,145,216)', marginLeft: 15 }} />
						</p>
					</div>
				</Form.Item>
				<Form.Item label={'数据名称'}>
					{
						getFieldDecorator('dataName', {
							validateTrigger: ['onBlur'],
							rules: [
								{ required: true, message: '数据名称不能为空' },
								{ max: 50, message: '数据名称长度不能超过50' },
								{ pattern: /^[^\s]+$/g, message: '数据名称不能有空格' },
								{ validator: repeatName }
							]
						})(
							<Input placeholder={'请输入'} />
						)
					}
				</Form.Item>
				<Form.Item label={'数据描述'}>
					{
						getFieldDecorator('dataDescription', {
							validateTrigger: ['onBlur'],
							rules: [
								{ required: true, message: '数据描述不能为空' },
								{ max: 100, message: '数据描述长度不能超过100' },
								{ pattern: /^[^\s]+$/g, message: '数据描述不能有空格' }
							]
						})(
							<Input placeholder={'请输入'} />
						)
					}
				</Form.Item>
				<Form.Item label={'数据用途'}>
					{
						getFieldDecorator('dataUse', {
							validateTrigger: ['onBlur'],
							rules: [
								{ required: true, message: '数据用途不能为空' },
								{ max: 100, message: '数据用途长度不能超过100' },
								{ pattern: /^[^\s]+$/g, message: '数据用途不能有空格' }
							]
						})(
							<Input placeholder={'请输入'} />
						)
					}
				</Form.Item>
				<Form.Item label={'所属系统'}>
					{
						getFieldDecorator('dataSource', {
							validateTrigger: ['onBlur'],
							rules: [
								{ required: true, message: '所属系统不能为空' },
								{ max: 100, message: '所属系统长度不能超过100' },
								{ pattern: /^[^\s]+$/g, message: '所属系统不能有空格' }
							]
						})(
							<Input placeholder={'请输入'} />
						)
					}
				</Form.Item>
				<Form.Item label={'接口地址'}>
					{
						getFieldDecorator('interfaceAddress', {
							validateTrigger: ['onBlur'],
							rules: [
								{ required: true, message: '接口地址不能为空' },
								{ max: 100, message: '接口地址长度不能超过100' },
								{ pattern: /^[^\s]+$/g, message: '接口地址不能有空格' }
							]
						})(
							<Input placeholder={'请输入'} />
						)
					}
				</Form.Item>
				<Form.Item label={'返回格式'}>
					{
						getFieldDecorator('responseFormat', {
							rules: [
								{ required: true, message: '返回格式不能为空' }
							],
							initialValue: 1
						})(
							<Select style={{ width: 260 }}>
								<Select.Option value={1}>JSON</Select.Option>
								<Select.Option value={2}>XML</Select.Option>
							</Select>
						)
					}
				</Form.Item>
				<Form.Item label={'请求方式'}>
					{
						getFieldDecorator('requestMethod', {
							rules: [
								{ required: true, message: '请求方式不能为空' }
							],
							initialValue: 1
						})(
							<Select style={{ width: 260 }}>
								<Select.Option value={1}>GET</Select.Option>
								<Select.Option value={2}>POST</Select.Option>
							</Select>
						)
					}
				</Form.Item>
				<Form.Item label={<span><i className={style.red}>*</i>请求参数说明</span>}>
					<RequestParams {...this.props} fieldList={this.state.requestParams} changeFields={this.changeRequestParams} />
				</Form.Item>
				<Form.Item label={<span><i className={style.red}>*</i>返回参数说明</span>}>
					<ResponseParams fieldList={this.state.responseParams} changeFields={this.changeResponseParams} {...this.props} />
				</Form.Item>
				<Form.Item label={<span><i className={style.red}>*</i>错误码说明</span>}>
					<ErrorCode fieldList={this.state.errorCode} changeFields={this.changeErrorCode} {...this.props} />
				</Form.Item>
				<Form.Item label={'调用示例'}>
					{
						getFieldDecorator('callExample', {
							rules: [
								{ required: true, message: '调用示例不能为空' },
							]
						})(
							<Input.TextArea autosize={{ minRows: 4, maxRows: 8 }} placeholder={'请输入'} />
						)
					}
				</Form.Item>
				{
					this.state.interfacePass ? (
						<Form.Item label={<span>返回示例</span>}>
							<Input.TextArea readOnly={true} value={this.state.responseText} />
						</Form.Item>
					) : ''
				}
				<Form.Item label={' '} colon={false}>
					<div className={style.btnBox}>
						<Button type='default' onClick={this.validateRegister}>验证</Button>
						<span className={style.tips}>*接口注册需验证通过才可提交</span>
					</div>
					<div className={style.passBox}>
						<Button type='primary' disabled={!this.state.interfacePass} onClick={this.submitHandler}>提交</Button>
					</div>
				</Form.Item>
			</Form>
		)
	}
	private submitHandler = async () => {
		this.props.form.validateFields((error: any, value) => {
			if (error) {
				Message.warning('请按规则完善所有字段');
				return;
			} else {
				console.log(value);
				this.saveAndPostInterface(value);
			}
		});
	}
	private saveAndPostInterface = async (value: any) => {
		try {
			const responseParams = this.state.responseParams.map(item => {
				item.rootId = value.category[0];
				item.subId = value.category[1];
				return item;
			});
			const params = {
				address: value.interfaceAddress,
				dataName: value.dataName,
				dataSource: value.dataSource,
				description: value.dataDescription,
				errorCode: JSON.stringify(this.state.errorCode),
				purpose: value.dataUse,
				requestMode: value.requestMethod,
				requestDemo: value.callExample,
				requestParam: JSON.stringify(this.state.requestParams),
				responseParam: JSON.stringify(responseParams),
				responseDemo: this.state.responseText,
				metaInsertParam: responseParams,
				responseType: value.responseFormat,
				rootId: value.category[0],
				subId: value.category[1]
			}
			const { status, message } = await request.post('/collection/info/DataApi/insert', params, {
				loading: true,
				loadingTitle: '接口注册中……'
			});
			if (status === 200) {
				let msg = await Message.success('接口注册成功');
				if (msg) {
					this.props.history.push('/data-manager/data-list');
				}
			} else {
				Message.warn(message);
			}
		} catch (e) {
			Message.error('服务器错误');
		}
	}
	private validateRegister = async () => {
		this.props.form.validateFields(['requestMethod', 'callExample', 'responseFormat', 'interfaceAddress'], async (error, value) => {
			if (error) {
				Message.warning('验证接口必须填写请求方式、接口地址、返回格式以及调用示例');
			} else {
				try {

					const params = {
						method: value.requestMethod,
						param: value.callExample,
						paramType: value.responseFormat,
						url: value.interfaceAddress
					}
					const { status, data, message } = await request.post('/collection/info/validateOnlineController/OnlineValidateInterface',
						params,
						{ loading: true, loadingTitle: '接口测试中……' });
					if (status === 200) {
						const result = typeof data === 'string' ? JSON.parse(data) : data;
						if (result.status === 200) {
							Message.success('验证通过');
							this.setState({
								interfacePass: true,
								responseText: result.result
							});
						} else {
							Message.error(result.result);
						}
					} else {
						Message.warning(message);
					}
				} catch (e) {
					Message.error('服务器错误');
				}
			}
		})
	}
	private changeRequestParams = (data: any[]) => {
		this.setState({
			requestParams: data
		});
	};
	private changeResponseParams = (data: any[]) => {
		this.setState({
			responseParams: data
		})
	}
	private changeErrorCode = (data: any[]) => {
		this.setState({
			errorCode: data
		})
	}
	private getCategoryList = async () => {
		try {
			const { status, message, data } = await request.post('/collection/info/DirectoryRoot/listRootAndSupDirectory', {}, {
				loading: true,
				loadingTitle: '获取目录列表中……'
			});
			if (status === 200) {
				this.setState({
					categoryList: data
				})
			} else if (status === 204) {
				Message.warning('目录数据为空');
				this.setState({
					categoryList: []
				});
			} else {
				Message.warning(message);
			}
		} catch (e) {
			Message.error('服务器错误');
		}
	}
}


export default Form.create({
	name: 'interfaceForm'
})(InterfaceForm);