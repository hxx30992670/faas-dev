import * as React from 'react';
import Style from './style.module.less';
import { Layout, Button } from 'antd';
import { RouteComponentProps, Switch, Route, Redirect } from "react-router-dom";
import moment from "moment";
import MainMenu from "../MainMenu/index";
import FileCollection from "src/views/DataManager/DataCollection/FileCollection/index";
import InterfaceRegister from 'src/views/DataManager/DataCollection/IntefaceRegister/index';
import TableSync from 'src/views/DataManager/DataCollection/TableSync/index';
import DataList from 'src/views/DataManager/DataManager/DataList';
import CategoryManager from 'src/views/DataManager/DataManager/CategoryManager';
import GovernmentList from 'src/views/DataManager/DataGovernment/GovernmentList';
import DataTrace from 'src/views/DataManager/DataGovernment/DataTrace';
import { changeRoute } from "src/actions";
import { connect } from 'react-redux';
import { StoreState } from 'src/types';
import { Dispatch } from 'redux';
const { Header, Sider, Content } = Layout;

const mapStateToProps = (state: StoreState) => ({
  currentRoute: state.currentRoute
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onChangeMenuSelect: (payload: string) => dispatch(changeRoute(payload))
})

export interface IMainTemplateProps extends RouteComponentProps {
  currentRoute?: string,
  onChangeMenuSelect: (payload: string) => void
}

export interface IMainTemplateState {
  isIn?: boolean,
  address?: string,
}



class MainTemplate extends React.Component<IMainTemplateProps, IMainTemplateState> {
  constructor(props: IMainTemplateProps) {
    super(props);
  }
  public shouldComponentUpdate(prevProps: IMainTemplateProps, prevState: IMainTemplateState) {
    prevProps.onChangeMenuSelect(this.props.location.pathname);
    return true;
  }
  public render() {
    const { match } = this.props;
    return (
      <Layout className={Style.container}>
        <Header className={Style.customHeader}>
          <div className={Style.headerWrap}>
            <h3 className={Style.title}>
              中云FAAS平台
            </h3>
            <div className={Style.loginInfo}>
              <p className={Style.time}>{moment().format('YYYY-MM-DD dddd')}</p>
              <p className={Style.currentLogin}>
                <span>管理员：</span>
                <span>Data</span>
              </p>
              <Button type='link' className={Style.logoutLink}>注销</Button>
            </div>
          </div>
        </Header>
        <Layout>
          <Sider width={'auto'}>
            <MainMenu role={1} />
          </Sider>
          <Content>
            <Switch>
              <Redirect exact={true} path={`${match.path}`} to={`${match.path}/file-collection`} />
              <Route path={`${match.path}/file-collection`} component={FileCollection} />
              <Route path={`${match.path}/interface-register`} component={InterfaceRegister} />
              <Route path={`${match.path}/table-sync`} component={TableSync} />
              <Route path={`${match.path}/data-list`} component={DataList} />
              <Route path={`${match.path}/category-manager`} component={CategoryManager} />
              <Route path={`${match.path}/government-list`} component={GovernmentList} />
              <Route path={`${match.path}/data-trace`} component={DataTrace} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
  public testButton = () => {
  }
  public showBox = () => {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainTemplate);