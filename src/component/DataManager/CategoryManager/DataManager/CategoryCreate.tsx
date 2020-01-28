import * as React from 'react';
import { Button, Form, Modal } from 'antd';
import style from './categoryCreate.module.less';
import { FormComponentProps } from 'antd/lib/form';
import NewCategory from './EditAndNew';
import NewChild from './NewChildCategory';
import ImportCategory from './ImportCategory';

export interface ICategoryCreateProps extends FormComponentProps {
	leftComponent: any
}

export interface ICategoryCreateState {
	visible: boolean;
	modalType: number;
	importCatetory: boolean;
}

class CategoryCreate extends React.Component<ICategoryCreateProps, ICategoryCreateState> {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			modalType: 1,
			importCatetory: false,
		}
	}

	public render() {
		/* const getTitle = () => (
			<span>231312</span>
		) */
		const { modalType } = this.state;
		return (
			<div className={style.container}>
				<Button shape='round' icon={'plus'} onClick={this.openNewAddCategory}>
					新增数据目录
				</Button>
				<Button shape='round' icon='plus' onClick={this.openNewChildCategory}>
					新增数据子目录
				</Button>
				<Button shape='round' onClick={this.openImportCategory}>
					导入目录
				</Button>
				<Button shape='round' onClick={this.downloadTemplate}>
					导出目录导入模板
				</Button>
				<Modal visible={this.state.visible} title={<span style={{ fontSize: 18 }}>{modalType === 1 ? '新增数据目录' : modalType === 2 ? '新增数据子目录' : ''}</span>} footer={null} destroyOnClose={true} onCancel={this.closeModal} width={modalType === 1 ? '35%' : '55%'}>
					{
						this.state.modalType === 1 ?
							<NewCategory name='' type={true} closeModal={this.closeModal}
								getDirList={this.getDataList}
							/> :
							<NewChild
								closeModal={this.closeModal}
								getDirList={this.getDataList}
							/>
					}
				</Modal>
				<Modal
					visible={this.state.importCatetory}
					title={<span style={{ fontSize: 18 }}>导入目录</span>}
					footer={null}
					destroyOnClose={true}
					onCancel={this.closeImport}
					width='35%'
				>
					<ImportCategory closeModal={this.closeImport} />
				</Modal>
			</div>
		);
	}
	private downloadTemplate = () => {
		window.open('/api/collection/info/DirectoryRoot/downloadModelFile');
	}
	private openImportCategory = () => {
		this.setState({
			importCatetory: true
		});
	}
	private closeImport = () => {
		this.setState({
			importCatetory: false
		});
	}
	private openNewAddCategory = () => {
		this.setState({
			visible: true,
			modalType: 1
		});
	}
	private openNewChildCategory = () => {
		this.setState({
			modalType: 2,
			visible: true,
		});
	}
	private closeModal = () => {
		this.setState({
			visible: false
		})
	}
	private getDataList = () => {
		const { current } = this.props.leftComponent;
		current.getCategoryTree();
		current.unPublishedCategory();
	}
}

export default Form.create<ICategoryCreateProps>()(CategoryCreate);