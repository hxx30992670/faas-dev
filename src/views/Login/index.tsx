import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import LoginForm from 'src/component/Login/LoginForm/index';
import style from './style.module.less';

export interface ILoginProps extends RouteComponentProps {

}
export interface ILoginState {
  address?: string
}
export default class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      address: '/login'
    }
  }

  public render() {
    console.log(this.props.match.path === '/login');
    return (
      <div className={style.container}>
        <div className={style.loginWrap}>
          <h3 className={style.title}>跨部门大数据应用平台</h3>
          <LoginForm {...this.props} />
        </div>
      </div>
    );
  }
}
