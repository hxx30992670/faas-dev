import * as React from 'react';
import { Form, Input, Spin, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'react-redux';
import style from './style.module.less';
import { StoreState } from 'src/types/index';
import request from 'src/utils/Request';
import LocalSave from 'src/utils/LocalSave';
import {RouteComponentProps} from 'react-router-dom';
interface ILoginFormProps extends FormComponentProps {
  loading: boolean,
  loadingTitle: string,
}
interface ILoginFormProps extends RouteComponentProps {

}
export interface ILoginFormState {
  code: string,
  cToken: string
}
const mapStateToProps = (state: StoreState) => ({
  loading: state.loading,
  loadingTitle: state.loadingTitle
})

class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      cToken: ''
    }
  }

  public componentDidMount() {
    this.getCode();
  }
  public render() {
    // const Code = this.state.code ? require(this.state.code) : ''
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style.container}>
        <Spin spinning={this.props.loading} tip={this.props.loadingTitle}>
          <Form
            className='login-form'
            {...formItemLayout}
          >
            <Form.Item
              hasFeedback={true}
              label='用户名'
            >
              {
                getFieldDecorator('userName', {
                  validateTrigger: ["onBlur"],
                  rules: [
                    {
                      required: true,
                      message: '用户名不能为空',
                    },
                    {
                      max: 20,
                      min: 4,
                      message: '用户名长度必须在6至20位之间，'
                    },
                    {
                      pattern: /^[a-zA-Z]+[a-zA-Z0-9]+$/,
                      message: '用户名必须以字母开头，并且只能包含字母和数字'
                    }
                  ]
                })(<Input />)
              }
            </Form.Item>
            <Form.Item
              label='密码'
              hasFeedback={true}
            >
              {
                getFieldDecorator('password', {
                  validateTrigger: ["onBlur"],
                  rules: [
                    { required: true, message: '密码不为空' },
                    { max: 20, min: 4, message: '密码长度为6至20之间' },
                  ]
                })(<Input.Password />)
              }
            </Form.Item>
            <Form.Item
              label='验证码'
            >
              {
                getFieldDecorator('code', {
                  validateTrigger: ['onBlur'],
                  rules: [
                    { required: true, message: '验证码不能为空' }
                  ]
                })(
                  <div className={style.codeWrap}>
                    <Input
                    />
                    {
                      this.state.code && <img src={this.state.code} alt="" />
                    }
                  </div>
                )
              }
            </Form.Item>
          </Form>
          <div className={style.submitBox}>
            <Button type='primary' onClick={this.submitLogin}>登陆</Button>
            <Button type='default' onClick={this.resetForm}>取消</Button>
          </div>
        </Spin>
      </div>
    );
  }
  // 获取验证码
  public getCode = async () => {
    try {
      const result: any = await request.post('/usergroup/login/verificationCode', {}, { loading: true });
      if (result.status === 200) {
        console.log(result.img);
        this.setState({
          code: result.img,
          cToken: result.token
        });
      }
    } catch (e) {
      throw Error(e);
    }
  }
  // 清空内容
  public resetForm = () => {
    const { resetFields } = this.props.form;
    resetFields();
  }

  // 登陆
  public submitLogin = () => {
    const { validateFields } = this.props.form;
    validateFields(async (error, values) => {
      if (error) {
        message.error('请按规则完善所有字段');
      } else {
        const { status, data, message: msg } = await request.post("/usergroup/login/userLogin", {
          code: values.code,
          ctoken: this.state.cToken,
          name: values.userName,
          password: values.password
        }, { loading: true, loadingTitle: '登陆中……' });
        if (status === 200) {
          LocalSave.saveSession('userInfo', data);
          const {mt} = data;
          console.log(mt);
          if((mt as string).startsWith("data_admin")) {
            this.props.history.push('/data-manager');
          }
        } else {
          message.warning(msg);
        }
      }

    });
  }
}

const FormWrap = Form.create({ name: 'login-form' })(LoginForm)

export default connect(mapStateToProps, null)(FormWrap);
