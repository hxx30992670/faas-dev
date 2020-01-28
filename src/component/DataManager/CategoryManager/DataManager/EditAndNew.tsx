import * as React from 'react';
import { Button, Form, Input, message as Message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import style from './editAndNew.module.less';
import request from 'src/utils/Request';

export interface IEditAndNewProps extends FormComponentProps {
	id?: any,
	name: string,
	type: boolean,
	closeModal: () => void
	getDirList: () => void
}

export interface IEditAndNewState {
}

class EditAndNew extends React.Component<IEditAndNewProps, IEditAndNewState> {
	public render() {
		const formItemLayout = {
			labelCol: {
				xs: 24,
				sm: 5
			},
			wrapperCol: {
				xs: 24,
				sm: 17
			}
		}
		const { getFieldDecorator } = this.props.form;
		return (
			<div className={style.container}>
				<Form {...formItemLayout}>
					<Form.Item label={'目录名称'}>
						{
							getFieldDecorator('name', {
								validateTrigger: ['onBlur'],
								rules: [
									{ required: true, message: '目录名称不能为空' },
									{ max: 50, message: '目录名称长度不能超过50' },
									{ pattern: /^[^\s]+$/, message: '目录名称不能包含空格' }
								],
								initialValue: !this.props.type ? this.props.name : ''
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item label={' '} colon={false}>
						<div className={style.submitBox}>
							<Button type='primary' onClick={this.submitSave}>保存</Button>
							<Button onClick={this.closeModal}>取消</Button>
						</div>
					</Form.Item>
				</Form>
			</div>
		);
	}
	private closeModal = () => {
		this.props.closeModal();
	}
	private submitSave = () => {
		const { validateFields } = this.props.form;
		validateFields((error, value) => {
			if (error) {
				Message.warn(error.name.errors[0].message);
				return;
			}
			if (this.props.type) {
				this.addHandler(value);
			} else {
				this.editHandler(value);
			}
		})
	}
	private addHandler = async (value: any) => {
		try {
			const { status, message } = await request.post('/collection/info/DirectoryRoot/createRootDir', {
				name: value.name
			}, { loading: true, loadingTitle: '创建目录中……' });
			if (status === 200) {
				Message.success('创建成功');
				this.props.getDirList();
				this.closeModal();
			} else {
				Message.warn(message);
			}
		} catch (error) {
			Message.error('服务器错误');
		}
	}
	private editHandler = async (value: any) => {
		try {
			const { status, message } = await request.post('/collection/info/DirectoryRoot/update', {
				id: this.props.id,
				name: value.name
			}, {
				loading: true,
				loadingTitle: '保存修改中……'
			});
			if (status === 200) {
				Message.success('保存成功');
				this.props.getDirList();
			} else {
				Message.warn(message);
			}
		} catch (e) {
			Message.error('服务器错误');
		}
	}
}

export default Form.create<IEditAndNewProps>()(EditAndNew);