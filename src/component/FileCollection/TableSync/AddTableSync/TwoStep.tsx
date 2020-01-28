import React, {ChangeEvent, Component, Fragment} from 'react';
import {TimePicker, Form, Select, Radio, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {IFormData} from './index';
import moment from 'moment';

export interface ITwoStepProps extends FormComponentProps{
	formData: IFormData,
	changeFormData: (data: any) => void
}
export interface ITwoStepState {

}

class TwoStep extends Component<ITwoStepProps, ITwoStepState> {
	public render() {
		const {getFieldDecorator} = this.props.form;
		const {formData} = this.props;
		return (
			<div>
				<Form.Item label={'同步策略'}>
					{
						getFieldDecorator('type', {
							rules: [
								{required: true, message: '同步策略不能为空'}
							],
							initialValue: formData.type
						})(
							<Select onChange={this.changeFormDataValue.bind(this,'type')} style={{width: 260}}>
								<Select.Option value={1}>手动</Select.Option>
								<Select.Option value={2}>自动</Select.Option>
							</Select>
						)
					}
				</Form.Item>
				{
					this.props.formData.type === 2 ?
						<Form.Item label={'同步周期'}>
							{
								getFieldDecorator('syncUnit', {
									rules: [
										{required: true, message: '同步周期不能为空'}
									],
									initialValue: formData.syncUnit
								})(
									<Select style={{width: 260}} onChange={this.changeFormDataValue.bind(this,'syncUnit')}>
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
						getFieldDecorator('syncType', {
							rules: [
								{required: true, message: '同步类型不能为空'}
							],
							initialValue: formData.syncType
						})(
							<Radio.Group onChange={this.changeSyncType}>
								<Radio value={2}>增量同步</Radio>
								<Radio value={1}>全量同步</Radio>
							</Radio.Group>
						)
					}
				</Form.Item>
				{
					this.props.formData.syncType === 2 ?
						<Form.Item label={'选择时间戳'}>
							{
								getFieldDecorator('timeStamp', {
									rules: [
										{required: true, message: '时间戳不能为空'}
									],
									initialValue: formData.timeStamp
								})(
									<Select style={{width: 260}} onChange={this.changeFormDataValue.bind(this,'timeStamp')}>
										{
											formData.fieldList.map(item => {
												const type: string = item.type.toString();
												if(type.startsWith('4')) {
													return (
														<Select.Option key={item.nameEng} value={item.nameEng}>{item.name}</Select.Option>
													)
												} else  {
													return  ''
												}
											})
										}
									</Select>
								)
							}
						</Form.Item> : ''
				}
				<Form.Item label={'同步名称'}>
					{
						getFieldDecorator('syncName', {
							rules: [
								{required: true, message: '同步名称不能为空'}
							],
							initialValue: formData.syncName
						})(
							<Input onChange={this.editFormData.bind(this,'syncName')} />
						)
					}
				</Form.Item>
			</div>
		);
	}
	private createUnitDom = () => {
		const {formData} = this.props;
		const {getFieldDecorator} = this.props.form;
		const days: any[] = [];
		const months: any [] = [];
		for(let i=1; i<=12; i++) {
			months.push(i);
		}
		if(formData.syncUnit === 1) {
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


		if(formData.type === 2 && formData.syncUnit === 4) {
			return (
				<Form.Item label={'具体时间'}>
					{
						getFieldDecorator('specificTime', {
							rules: [
								{required: true, message: '具体时间不能为空'}
							],
							initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
						})(
							<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} />
						)
					}
				</Form.Item>
			)
		} else if(formData.type === 2 && formData.syncUnit === 3) {
			return  (
				<Fragment>
					<Form.Item label={'每周'}>
						{
							getFieldDecorator('oneWeek', {
								rules: [
									{required: true, message: '每周不能为空'}
								],
								initialValue: formData.oneWeek
							} ) (
								<Select style={{width: 260}} onChange={this.changeFormDataValue.bind(this,'oneWeek')}>
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
					<Form.Item label={'具体时间'}>
						{
							getFieldDecorator('specificTime', {
								rules: [
									{required: true, message: '具体时间不能为空'}
								],
								initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
							})(
								<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} />
							)
						}
					</Form.Item>
				</Fragment>
			);
		} else if(formData.type === 2 && formData.syncUnit === 2) {
			return (
				<Fragment>
					<Form.Item label={'每月'}>
						{
							getFieldDecorator('oneMonth', {
								rules: [
									{required: true, message: true}
								],
								initialValue: formData.oneMonth
							})(
								<Select style={{width: 260}} onChange={this.changeFormDataValue.bind(this,'oneMonth')}>
									{
										days.map((item,index) => (
											<Select.Option key={index} value={item}>{item + '日'}</Select.Option>
										))
									}
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={'具体时间'}>
						{
							getFieldDecorator('specificTime', {
								rules: [
									{required: true, message: '具体时间不能为空'}
								],
								initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
							})(
								<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} />
							)
						}
					</Form.Item>
				</Fragment>
			)
		} else if(formData.type === 2 && formData.syncUnit === 1) {
			return (
				<Fragment>
					<Form.Item label={'每年'}>
						{
							getFieldDecorator('oneYear', {
								rules: [
									{required: true, message: '每年不能为空'}
								],
								initialValue: formData.oneYear
							})(
								<Select style={{width: 260}} onChange={this.changeFormDataValue.bind(this,'oneYear')}>
									{
										months.map((item,index) => (
											<Select.Option key={index} value={item}>{item + '月'}</Select.Option>
										))
									}
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={'每月'}>
						{
							getFieldDecorator('oneMonth', {
								rules: [
									{required: true, message: true}
								],
								initialValue: formData.oneMonth
							})(
								<Select style={{width: 260}} onChange={this.changeFormDataValue.bind(this,'oneMonth')}>
									{
										days.map((item,index) => (
											<Select.Option key={index} value={item}>{item + '日'}</Select.Option>
										))
									}
								</Select>
							)
						}
					</Form.Item>
					<Form.Item label={'具体时间'}>
						{
							getFieldDecorator('specificTime', {
								rules: [
									{required: true, message: '具体时间不能为空'}
								],
								initialValue: formData.specificTime? moment(formData.specificTime, 'HH:mm:ss'): null
							})(
								<TimePicker  onChange={this.setDate} placeholder={'请选择时间'} />
							)
						}
					</Form.Item>
				</Fragment>
			)
		} else {
			return  '';
		}
	}
	private changeFormDataValue = (key,val) => {
		console.log(val);
		const {formData, changeFormData} = this.props;
		formData[key] = val;
		changeFormData(formData);
	}
	private editFormData = (key,e:ChangeEvent<HTMLInputElement>) => {
		const {formData, changeFormData} = this.props;
		formData[key] = e.currentTarget.value;
		changeFormData(formData);
	}
	private changeSyncType = (e) => {
		const {formData, changeFormData} = this.props;
		formData['syncType'] = e.target.value;
		changeFormData(formData);
	}
	private setDate = (time, timeString) => {
		const {formData, changeFormData} = this.props;
		formData.specificTime = timeString;
		changeFormData(formData);
	}
}

export default TwoStep;