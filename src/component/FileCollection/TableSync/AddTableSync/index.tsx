import * as React from 'react';
import {Steps, Icon, Form, Button, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import OneStep from './OneStep';
import TwoStep from "./TwoStep";
import ThreeStep from "./ThreeStep";
import style from './style.module.less';

export interface IAddTableSyncProps {
	closeAddTableSync: () => void
}

export interface IAddTableSyncProps extends FormComponentProps {

}

export interface IFormData {
  category: string[],
  sourceDatabase: string;
  sourceTable: string;
	fieldList: any[];
	type: number |string;
	syncUnit: number | undefined;
	specificTime: string | number;
	oneWeek: number | string;
	oneMonth: number | string;
	oneYear: number | string;
	syncType: number;
	timeStamp: number | string;
	syncName: string;
	dataName: string;
	dataDescription: string;
	dataUse: string;
	dataSource: string;
}

export interface IAddTableSyncState {
  currentStep: number;
  formData: IFormData;
	stepStatus: any;
}

class AddTableSync extends React.Component<IAddTableSyncProps, IAddTableSyncState> {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 2,
	    stepStatus: 'process',
      formData: {
        category: [],
        sourceDatabase: '',
	      sourceTable: '',
	      fieldList: [],
	      type: 1,
	      syncUnit: undefined,
	      specificTime: '',
	      oneWeek: '',
	      oneMonth: '',
	      oneYear: '',
	      syncType: 1,
	      timeStamp: '',
	      syncName: '',
	      dataName: '',
	      dataDescription: '',
	      dataUse: '',
	      dataSource: ''
      }
    }
  }
	public componentDidMount(): void {
  	console.log(this.props);
	}

	public render() {
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 3
      },
      wrapperCol: {
        xs: 24,
        sm: 19
      }
    }
    return (
      <div className={style.container}>
        <Steps current={this.state.currentStep}
          /*onChange={this.changeStep}*/
	        status={this.state.stepStatus}
        >
          <Steps.Step icon={<Icon type="setting"
            className={'bigSize'}
            style={{position: 'relative', top: -6}} />}
            title="1、配置数据库" />
          <Steps.Step icon={<Icon type="setting"
            style={{position: 'relative', top: -6}} />}
            title="2、配置同步策略" />
          <Steps.Step icon={<Icon type="setting"
            style={{position: 'relative', top: -6}} />}
            title="3、配置数据信息" />
        </Steps>
        <div className={style.formWrap}>
          <Form {...formItemLayout}>
            {
              this.state.currentStep === 0 ? <OneStep {...this.props} formData={this.state.formData}
                changeFormData={this.changeFormData} /> : this.state.currentStep === 1 ?
	              <TwoStep {...this.props} formData={this.state.formData} changeFormData={this.changeFormData} />:
	              this.state.currentStep === 2 ?
	              <ThreeStep {...this.props} formData={this.state.formData} changeFormData={this.changeFormData} /> : ''
            }
            <Form.Item label={' '} colon={false}>
	            <div className={style.btnBox}>
		            {
			            this.state.currentStep > 0 ? <Button type='primary' onClick={this.prevStep}>
				            上一步
			            </Button> : ''
		            }
		            <Button type='primary' onClick={this.nextStep}>{this.state.currentStep < 2 ? '下一步' : '提交'}</Button>
		            <Button type='default' onClick={this.props.closeAddTableSync}>取消</Button>
	            </div>
            </Form.Item>
          </Form>

        </div>
      </div>
    );
  }

  /*private changeStep = (val) => {
    this.setState({
      currentStep: val
    })
  }*/
  private changeFormData = (data: any) => {
    this.setState({
      formData: data
    })
  }
  private prevStep = () => {
  	let {currentStep} = this.state;
  	currentStep -= 1;
  	this.setState({
		  currentStep
	  })
  }
  private nextStep = () => {
  	const {validateFields} = this.props.form;
	  validateFields((error, value) => {
	  	if(error) {
	  		message.warn('请按规则完善所有字段');
	  		this.setState({
				  stepStatus: 'error'
			  });
	  		return;
		  }
		  this.setState({
			  stepStatus: 'process'
		  });
	  	if(this.state.currentStep < 2) {
	  		let {currentStep} = this.state;
	  		currentStep += 1;
	  		this.setState({
				  currentStep
			  });
		  }
	  })
  }
}

export default AddTableSync;
