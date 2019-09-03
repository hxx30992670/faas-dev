import React, {ChangeEvent, Component} from 'react';
import {Form, Input} from "antd";
import {FormComponentProps} from 'antd/lib/form';
import {IFormData} from "./index";

export interface IThreeStepProps extends FormComponentProps {
	formData: IFormData,
	changeFormData: (data: any) => void
}

export interface IThreeStepState {

}

class ThreeStep extends Component<IThreeStepProps, IThreeStepState> {
	public render() {
		const {getFieldDecorator} = this.props.form;
		const {formData} = this.props;
		return (
			<div>
				<Form.Item label={'数据名称'}>
					{
						getFieldDecorator('dataName', {
							rules: [
								{required: true, message: '数据名称不能为空'}
							],
							initialValue: formData.dataName
						})(
							<Input onChange={this.changeFormDataValue.bind(this, 'dataName')}/>
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
							<Input.TextArea onChange={this.changeFormDataValue.bind(this, 'dataDescription')}
								autosize={{minRows: 4, maxRows: 6}}/>
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
							<Input.TextArea onChange={this.changeFormDataValue.bind(this, 'dataUse')}
								autosize={{minRows: 4, maxRows: 6}}/>
						)
					}
				</Form.Item>
				<Form.Item label={'所属系统'}>
					{
						getFieldDecorator('dataSource', {
							rules: [
								{required: true, message: '数据描述不能为空'}
							],
							initialValue: formData.dataSource
						})(
							<Input.TextArea onChange={this.changeFormDataValue.bind(this, 'dataSource')} autosize={{minRows: 4, maxRows: 6}} />
						)
					}
				</Form.Item>
			</div>
		);
	}

	private changeFormDataValue = (key, e: ChangeEvent<HTMLInputElement>) => {
		const {formData, changeFormData} = this.props;
		formData[key] = e.currentTarget.value;
		changeFormData(formData);
	}
}

export default ThreeStep;