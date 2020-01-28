import * as React from 'react';
import {Form, Input, Select, message as Msg, Button, Icon} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import request from 'src/utils/Request';
import style from './main.module.less';

export interface INewDataSourceProps extends FormComponentProps{

}

export interface INewDataSourceState {
	dbTypeList: any[],
	selectDataType: any,
	saveBon: number
}

class NewDataSource extends React.Component<INewDataSourceProps, INewDataSourceState> {
	constructor(props) {
		super(props);
		this.state = {
			dbTypeList: [],
			selectDataType: undefined,
			saveBon: 0
		}
	}
	public componentDidMount(): void {
		this.getDbTypeList();
	}

	public render() {
		const formItemLayout = {
			labelCol: {
				xs: 24,
				sm: 4
			},
			wrapperCol: {
				xs: 24,
				sm: 18
			}
		}
		const {getFieldDecorator} = this.props.form;
		const versionList =this.state.dbTypeList.length ?  this.state.dbTypeList.filter(item => item.dbType === this.state.selectDataType) : [];
		return (
			<div>
				<Form {...formItemLayout}>
					<Form.Item label={'数据源名称'}>
						{
							getFieldDecorator('name', {
								rules: [
									{required: true, message: '数据源名称不能为空'}
								]
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item label={'数据源类型'}>
						{
							getFieldDecorator('type', {
								rules: [
									{required: true, message: '数据源类型不能为空'}
								]
							})(
								<Select style={{width: 260}} onChange={this.selectDataType}>
									<Select.Option value={1}>Mysql</Select.Option>
									<Select.Option value={2}>Oracle</Select.Option>
									<Select.Option value={3}>Postgres</Select.Option>
								</Select>
							)
						}
					</Form.Item>
					{
						this.state.selectDataType === 3 ?
							<Form.Item label={'数据库模式'}>
								{
									getFieldDecorator('databaseMode', {
										rules: [
											{required: true, message: '数据库模式不能为空'}
										]
									})(
										<Input />
									)
								}
							</Form.Item> : ''
					}
					<Form.Item label={'服务器地址'}>
						{
							getFieldDecorator('address', {
								rules: [
									{required: true, message: '服务器地址不能为空'}
								]
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item label={'端口'}>
						{
							getFieldDecorator('port', {
								rules: [
									{required: true, message: '端口不能为空'},
									{pattern: /^\d+$/g, message: '端口只能使用数字'}
								]
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item label={'数据库名称'}>
						{
							getFieldDecorator('databaseName', {
								rules: [
									{required: true, message: '数据库名称不能为空'}
								]
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item label={'用户名'}>
						{
							getFieldDecorator('user', {
								rules: [
									{required: true, message: '用户名不能为空'}
								]
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item label={'密码'}>
						{
							getFieldDecorator('password', {
								rules: [
									{required: true, message: '密码不能为空'}
								]
							})(
								<Input.Password />
							)
						}
					</Form.Item>
					<Form.Item label={'版本号'}>
						{
							getFieldDecorator('version', {
								rules: [
									{required: true, message: '版本号不能为空'}
								],
								//initialValue: versionList.length ? versionList[0].version : undefined
							})(
								<Select style={{width: 260}} placeholder={'请先选择数据类型'}>
									{
										versionList.map(item => (
											<Select.Option key={item.version} value={item.version}>{item.version}</Select.Option>
										))
									}
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={' '} colon={false}>
						<div className={style.submitBox}>
							<div className={style.left}>
								<Button onClick={this.validateDatabase}>验证</Button>
								{
									this.state.saveBon === 2 ?
										<p className={'validate-icon'}>
											<Icon type='check-circle' theme='filled'  style={{color: 'green'}}/>
											<span>成功</span>
										</p>:
										this.state.saveBon === 1 ?
										<p className={'validate-icon'}>
											<Icon type='close-circle'  style={{color: '#f4ab37'}} theme='filled' />
											<span>失败</span>
										</p> : ''
								}
							</div>
							<div className={style.right}>
								<p className={style.tips}>
									*数据验证通过后才可保存
								</p>
								<Button type={'primary'} disabled={this.state.saveBon !== 2}>
									保存
								</Button>
							</div>
						</div>
					</Form.Item>
				</Form>
			</div>
		);
	}
	private selectDataType = (val) => {
		this.setState({
			selectDataType: val
		}, () => {
			this.props.form.setFieldsValue({
				version: undefined
			});
		})
	}
	private getDbTypeList = async () => {
		try {
			const {status, message, data} = await request.post('/collection/info/DbSource/selectDatabaseVersion', {
				databaseType: ''
			}, {
				loading: true,
				loadingTitle: '获取数据库版本中……'
			});
			if(status === 200) {
				this.setState({
					dbTypeList: data
				});
			} else {
				Msg.warn(message);
			}
		} catch (e) {
			Msg.error('服务器错误');
		}
	}
	private validateDatabase = () => {
		const {validateFields} = this.props.form;
		validateFields(async (error, value) => {
			if(error) {
				Msg.warn('请按规则完善所有字段信息');
				return;
			}
			const params = {
				dbType: value.type,
				host: value.address,
				port: value.port,
				databaseName: value.databaseName,
				user: value.user,
				pwd: value.password,
				version: value.version,
				schemaName: value.databaseMode
			}
			try {
				const {status} = await request.post('/collection/data/database/testConnection', params, {
					loading: true,
					loadingTitle: '验证中……'
				});
				if(status === 200) {
					Msg.success('验证成功');
					this.setState({
						saveBon: 2
					});
				} else {
					Msg.warn('验证失败');
					this.setState({
						saveBon: 1
					});
				}
			} catch (e) {
				Msg.warn('服务器错误');
			}
		});
	}
}

export default Form.create()(NewDataSource);