import * as React from 'react';
import {Steps, Icon, Form} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import OneStep from './OneStep';
import style from './style.module.less';

export interface IAddTableSyncProps extends FormComponentProps {
}

export interface IFormData {
  category: string[],
  sourceDatabase: string;
}

export interface IAddTableSyncState {
  currentStep: number;
  formData: IFormData
}

class AddTableSync extends React.Component<IAddTableSyncProps, IAddTableSyncState> {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      formData: {
        category: [],
        sourceDatabase: ''
      }
    }
  }

  public render() {
    const formItemLayou = {
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
          onChange={this.changeStep}
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
          <Form {...formItemLayou}>
            {
              this.state.currentStep === 0 ? <OneStep {...this.props} formData={this.state.formData}
                changeFormData={this.changeFormData} /> : ''
            }
          </Form>
        </div>
      </div>
    );
  }

  private changeStep = (val) => {
    this.setState({
      currentStep: val
    })
  }
  private changeFormData = (data: any) => {
    this.setState({
      formData: data
    })
  }
}

export default Form.create()(AddTableSync);
