import * as React from 'react';
import * as style from './style.module.less';
import { RouteComponentProps } from "react-router-dom";

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
        Login页
      </div>
    );
  }
}
