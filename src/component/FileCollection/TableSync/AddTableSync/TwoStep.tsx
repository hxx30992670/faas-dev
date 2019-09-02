import React, {Component} from 'react';
import {Form, Select} from "antd";
import {FormComponentProps} from 'antd/lib/form';
import {IFormData} from "./index";

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
									]
								})(
									<Select>
										<Select.Option value={1}>按天</Select.Option>
									</Select>
								)
							}
						</Form.Item> : ''
				}
			</div>
		);
	}
	private changeFormDataValue = (key,val) => {
		const {formData, changeFormData} = this.props;
		formData[key] = val;
		changeFormData(formData);
	}
}

export default TwoStep;