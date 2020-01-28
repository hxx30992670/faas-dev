import React, {ChangeEvent, Component, Fragment} from 'react';
import style from './style.module.less';
import {Button, Form, Input, message as Message, Radio, Select, TimePicker} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import request from 'src/utils/Request';
import moment from 'moment';
export interface ITableSyncEditProps extends FormComponentProps {
	id: string| number;
	closeModal: (callBack?:any) => void;
	getDataList: () => void;
}
export interface ITableSyncEditState {
	formData: IFormData
}
export interface IFormData {
	id: number|string;
	dataId: number|string;
	sourceData: string;
	sourceTable: string;
	syncType: number| string;
	syncStrategy: number|string;
	specificTime: string;
	oneWeek: number|string;
	oneMonth: number|string;
	oneYear: number|string;
	saveType: number|string;
	timeStamp: string;
	syncName: string;
	dataName: string;
	dataDescription: string;
	dataUse: string;
	dataSource: string;
	timestampArr: any[]
}

class TableSyncEdit extends Component<ITableSyncEditProps, ITableSyncEditState> {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				id: '',
				dataId: '',
				sourceData: '',
				sourceTable: '',
				syncType:'',
				syncStrategy: '',
				specificTime: '',
				oneWeek: '',
				oneMonth: '',
				oneYear: '',
				saveType: '',
				timeStamp: '',
				syncName: '',
				dataName: '',
				dataDescription: '',
				dataUse: '',
				dataSource: '',
				timestampArr: []
			}
		}
		this.getDetailData();

	}

	public render() {
		const formItemLayout = {
			labelCol: {
				xs: 24,
				sm:3
			},
			wrapperCol: {
				xs: 24,
				sm: 19
			}
		}
		const {getFieldDecorator} = this.props.form;
		const {formData} = this.state;
		return (
			<div className={style.container}>
				<Form {...formItemLayout}>
					<Form.Item label={'源数据库'}>
						<Input value={this.state.formData.sourceData} disabled={true}/>
					</Form.Item>
					<Form.Item label={'源表'}>
						<Input value={this.state.formData.sourceTable} disabled={true}/>
					</Form.Item>
					<Form.Item label={'同步策略'} hasFeedback={true}>
						{
							getFieldDecorator('syncType', {
								rules: [
									{required: true, message: '同步策略不能为空'}
								],
								initialValue: formData.syncType
							})(
								<Select className={style.customSelect} onChange={this.changeSelect.bind(this,'syncType')}>
									<Select.Option value={1}>手动</Select.Option>
									<Select.Option value={2}>自动</Select.Option>
								</Select>
							)
						}
					</Form.Item>
					{
						formData.syncType === 2 ?
							<Form.Item label={'同步周期'} hasFeedback={true}>
								{
									getFieldDecorator('syncStrategy', {
										rules: [
											{required: true, message: '同步周期不能为空'}
										],
										initialValue: formData.syncStrategy
									})(
										<Select style={{width: 260}} onChange={this.changeSelect.bind(this,'syncStrategy')}>
											<Select.Option value={4}>按天</Select.Option>
											<Select.Option value={3}>按周</Select.Option>
											<Select.Option value={2}>按月</Select.Option>
											<Select.Option value={1}>按年</Select.Option>
										</Select>
									)
								}
							</Form.Item> : ''
					}
					{
						this.createUnitDom()
					}
					<Form.Item label={'同步类型'}>
						{
							getFieldDecorator('saveType', {
								rules: [
									{required: true, message: '同步类型不能为空'}
								],
								initialValue: formData.saveType
							})(
								<Radio.Group onChange={this.changeSyncType}>
									<Radio value={2}>增量同步</Radio>
									<Radio value={1}>全量同步</Radio>
								</Radio.Group>
							)
						}
					</Form.Item>
					{
						formData.saveType === 2 ?
							<Form.Item label={'选择时间戳'}>
								{
									getFieldDecorator('timeStamp', {
										rules: [
											{required: true, message: '时间戳不能为空'}
										],
										initialValue: formData.timeStamp
									})(
										<Select className={style.customSelect} onChange={this.changeSelect.bind(this,'timeStamp')}>
											{
												formData.timestampArr.map(item => (
													<Select.Option value={item.nameEng} key={item.nameEng}>{item.name}</Select.Option>
												))
											}
										</Select>
									)
								}
							</Form.Item>
							: ''
					}
					<Form.Item label={'同步名称'}>
						{
							getFieldDecorator('syncName', {
								rules: [
									{required: true, message: '同步名称不能为空'}
								],
								initialValue: formData.syncName
							})(
								<Input disabled={true}/>
							)
						}
					</Form.Item>
					<Form.Item label={'数据名称'}>
						{
							getFieldDecorator('dataName', {
								rules: [
									{required: true, message: '数据名称不能为空'}
								],
								initialValue: formData.dataName
							})(
								<Input disabled={true}/>
							)
						}
					</Form.Item>
					<Form.Item label={'数据描述'}>
						{
							getFieldDecorator('dataDescription', {
								rules: [
									{required: true, message: '数据描述不能为空'}
								],
								initialValue: formData.dataDescription
							})(
								<Input.TextArea onChange={this.changeInput.bind(this,'dataDescription')} autosize={{minRows:3, maxRows:6}}/>
							)
						}
					</Form.Item>
					<Form.Item label={'数据用途'}>
						{
							getFieldDecorator('dataUse', {
								rules: [
									{required: true, message: '数据用途不能为空'}
								],
								initialValue: formData.dataUse
							})(
								<Input.TextArea onChange={this.changeInput.bind(this,'dataUse')} autosize={{minRows:3, maxRows:6}}/>
							)
						}
					</Form.Item>
					<Form.Item label={'所属系统'}>
						{
							getFieldDecorator('dataSource', {
								rules: [
									{required: true, message: '所属系统不能为空'}
								],
								initialValue: formData.dataSource
							})(
								<Input.TextArea onChange={this.changeInput.bind(this,'dataSource')} autosize={{minRows:3, maxRows:6}}/>
							)
						}
					</Form.Item>
					{/*确认取消按钮*/}
					<Form.Item label={' '} colon={false}>
						<div className={style.submitBox}>
							<Button type='primary' onClick={this.saveEdit}>保存</Button>
							<Button onClick={this.props.closeModal.bind(this, null)}>取消</Button>
						</div>
					</Form.Item>
				</Form>
			</div>
		);
	}
	private saveEdit = async () => {
		const {validateFields} = this.props.form;
		const {formData} = this.state;
		validateFields(async (error, value) => {
			if(error) {
				Message.warn('请按规则完善所有字段');
				return;
			}
			const params = {
				id: formData.id,
				dataId: formData.dataId,
				dataSource: formData.dataSource,
				day: formData.oneMonth,
				description: formData.dataDescription,
				hour: formData.specificTime,
				month: formData.oneYear,
				purpose: formData.dataUse,
				syncType: formData.saveType,
				syncUnit: formData.syncStrategy,
				timestampColumn: formData.timeStamp,
				week: formData.oneWeek,
				type: formData.syncType
			}
			try{
				const {status, message} = await request.post('/collection/info/DbSync/update', params, {
					loading: true,
					loadingTitle: '修改库表同步中……'
				});
				if(status === 200) {
					Message.success('修改成功');
					setTimeout(() => {
						this.props.closeModal(this.props.getDataList);
					},1000);
				} else {
					Message.warn(message);
				}
			}catch (e) {
				Message.error('服务器错误');
			}
		})
	}
	private createUnitDom = () => {
		const {formData} = this.state;
		const {getFieldDecorator} = this.props.form;
		const days: any[] = [];
		const months: any [] = [];
		for(let i=1; i<=12; i++) {
			months.push(i);
		}
		if(formData.syncStrategy === 1) {
			if(formData.oneYear === 1 || formData.oneYear === 3 || formData.oneYear ===5 || formData.oneYear === 7 || formData.oneYear === 8 || formData.oneYear === 10 || formData.oneYear === 12) {
				for(let i=1; i<=31; i++) {
					days.push(i);
				}
			} else if (formData.oneYear === 4 || formData.oneYear === 6 || formData.oneYear===9 || formData.oneYear === 11) {
				for(let i=1; i<=30; i++) {
					days.push(i);
				}
			} else if(formData.oneYear === 2) {
				for(let i=1; i<=28; i++) {
					days.push(i);
				}
			} else {
				for(let i=1; i<=31; i++) {
					days.push(i);
				}
			}
		} else {
			for(let i=1; i<=31; i++) {
				days.push(i);
			}
		}


		if(formData.syncType === 2 && formData.syncStrategy === 4) {
			return (
				<Form.Item label={'具体时间'} hasFeedback={true} >
					{
						getFieldDecorator('specificTime', {
							rules: [
								{required: true, message: '具体时间不能为空'}
							],
							initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
						})(
							<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} className={style.customSelect} />
						)
					}
				</Form.Item>
			)
		} else if(formData.syncType === 2 && formData.syncStrategy === 3) {
			return  (
				<Fragment>
					<Form.Item label={'每周'} hasFeedback={true}>
						{
							getFieldDecorator('oneWeek', {
								rules: [
									{required: true, message: '每周不能为空'}
								],
								initialValue: formData.oneWeek
							} ) (
								<Select style={{width: 260}} onChange={this.changeSelect.bind(this,'oneWeek')}>
									<Select.Option value={0}>一</Select.Option>
									<Select.Option value={1}>二</Select.Option>
									<Select.Option value={2}>三</Select.Option>
									<Select.Option value={3}>四</Select.Option>
									<Select.Option value={4}>五</Select.Option>
									<Select.Option value={5}>六</Select.Option>
									<Select.Option value={6}>日</Select.Option>
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={'具体时间'} hasFeedback={true}>
						{
							getFieldDecorator('specificTime', {
								rules: [
									{required: true, message: '具体时间不能为空'}
								],
								initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
							})(
								<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} className={style.customSelect} />
							)
						}
					</Form.Item>
				</Fragment>
			);
		} else if(formData.syncType === 2 && formData.syncStrategy === 2) {
			return (
				<Fragment>
					<Form.Item label={'每月'} hasFeedback={true}>
						{
							getFieldDecorator('oneMonth', {
								rules: [
									{required: true, message: true}
								],
								initialValue: formData.oneMonth
							})(
								<Select style={{width: 260}} onChange={this.changeSelect.bind(this,'oneMonth')}>
									{
										days.map((item,index) => (
											<Select.Option key={index} value={item}>{item + '日'}</Select.Option>
										))
									}
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={'具体时间'} hasFeedback={true}>
						{
							getFieldDecorator('specificTime', {
								rules: [
									{required: true, message: '具体时间不能为空'}
								],
								initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
							})(
								<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} className={style.customSelect} />
							)
						}
					</Form.Item>
				</Fragment>
			)
		} else if(formData.syncType === 2 && formData.syncStrategy === 1) {
			return (
				<Fragment>
					<Form.Item label={'每年'} hasFeedback={true}>
						{
							getFieldDecorator('oneYear', {
								rules: [
									{required: true, message: '每年不能为空'}
								],
								initialValue: formData.oneYear
							})(
								<Select style={{width: 260}} onChange={this.changeSelect.bind(this,'oneYear')}>
									{
										months.map((item,index) => (
											<Select.Option key={index} value={item}>{item + '月'}</Select.Option>
										))
									}
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={'每月'} hasFeedback={true}>
						{
							getFieldDecorator('oneMonth', {
								rules: [
									{required: true, message: true}
								],
								initialValue: formData.oneMonth
							})(
								<Select style={{width: 260}} onChange={this.changeSelect.bind(this,'oneMonth')}>
									{
										days.map((item,index) => (
											<Select.Option key={index} value={item}>{item + '日'}</Select.Option>
										))
									}
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={'具体时间'} hasFeedback={true}>
						{
							getFieldDecorator('specificTime', {
								rules: [
									{required: true, message: '具体时间不能为空'}
								],
								initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
							})(
								<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} className={style.customSelect} />
							)
						}
					</Form.Item>
				</Fragment>
			)
		} else {
			return  '';
		}
	}
	private getDetailData = async() => {
		const params = {
			id: this.props.id
		}
		try {
			const { status, message, data } = await request.post('/collection/info/Data/selectByPrimaryKey', params, {
				loading: true,
				loadingTitle: '获取详情数据中……'
			});
			if(status === 200) {
				let {formData} = this.state;
				formData = {
					id: data.dbSyncAndSourceEntity.id,
					dataId: data.dbSyncAndSourceEntity.dataId,
					sourceData: data.dbSyncAndSourceEntity.dbSourceEntity.name,
					sourceTable: data.dbSyncAndSourceEntity.sourceTable,
					syncType: data.dbSyncAndSourceEntity.type,
					syncStrategy: data.dbSyncAndSourceEntity.syncUnit,
					specificTime: data.dbSyncAndSourceEntity.time,
					oneWeek: data.dbSyncAndSourceEntity.week,
					oneMonth: data.dbSyncAndSourceEntity.day ? Number(data.dbSyncAndSourceEntity.day) : '',
					oneYear: data.dbSyncAndSourceEntity.month ? Number(data.dbSyncAndSourceEntity.month) : '',
					saveType: data.dbSyncAndSourceEntity.syncType,
					syncName: data.dbSyncAndSourceEntity.syncName,
					dataName: data.dataEntity.name,
					dataDescription: data.dataEntity.description,
					dataUse: data.dataEntity.purpose,
					dataSource: data.dataEntity.dataSource,
					timeStamp: data.dbSyncAndSourceEntity.timestampColumn,
					timestampArr: data.directoryMetaEntityList.filter(item => {
						const type: string = item.type.toString();
						return type.startsWith('4');
					})
				}
				this.setState({
					formData
				})
			} else {
				Message.warn(message);
			}
		}catch (e) {
			Message.error('服务器错误');
		}
	}
	private changeSelect = (key, val) => {
		const {formData} = this.state;
		formData[key] = val;
		this.setState({
			formData
		});
	}
	private setDate = (time, timeString) => {
		const {formData} = this.state;
		formData.specificTime = timeString;
		this.setState({
			formData
		})
	}
	private changeSyncType = (e) => {
		const {formData} = this.state;
		formData['saveType'] = e.target.value;
		this.setState({
			formData
		})
	}
	private changeInput = (key,e:ChangeEvent<HTMLInputElement>) => {
		const {formData} = this.state;
		formData[key] = e.currentTarget.value;
		this.setState({
			formData
		});
	}
}

export default Form.create<ITableSyncEditProps>()(TableSyncEdit);