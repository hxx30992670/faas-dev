import * as React from 'react';
import style from "./style.module.less";
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { changeRoute } from "src/actions";
import { connect } from 'react-redux';
import { StoreState } from 'src/types';
import { Dispatch } from 'redux';
const { SubMenu, Item } = Menu;

const mapStateToProps = (state: StoreState) => ({
  currentRoute: state.currentRoute
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSelectMenuItem: (payload: string) => dispatch(changeRoute(payload))
});
interface IMenuItem {
  path: string,
  name: string,
  icon?: string,
  children?: IMenuItem[]
}
export interface IMainMenuProps extends RouteComponentProps {
  role: number,
  currentRoute: string,
  onSelectMenuItem: (payload: string) => void
}
export interface IMainMenuState {
  menuList: IMenuItem[],
  openKeys: string[],
  defaultRoute: string
}

class MainMenu extends React.Component<IMainMenuProps, IMainMenuState> {
  constructor(props: IMainMenuProps) {
    super(props);
    this.state = {
      menuList: [],
      openKeys: [],
      defaultRoute: '/data-manager/file-collection'
    }
  }

  public componentDidMount() {
    let { menuList, openKeys } = this.state;
    if (this.props.role === 1) {
      menuList = [
        {
          path: '/data-manater/data-collection',
          name: '数据采集',
          icon: 'appstore',
          children: [
            {
              path: '/data-manager/file-collection',
              name: '文件采集'
            },
            {
              path: '/data-manager/interface-register',
              name: '接口注册'
            },
            {
              path: '/data-manager/table-sync',
              name: '库表同步'
            }
          ]
        },
        {
          path: '/data-manager/data-manager',
          icon: 'radar-chart',
          name: '数据管理',
          children: [
            {
              path: '/data-manager/data-list',
              name: '数据列表'
            },
            {
              path: '/data-manager/category-manager',
              name: '目录管理'
            }
          ]
        },
        {
          path: '/data-manager/data-government',
          name: '数据治理',
          icon: 'dribbble',
          children: [
            {
              path: '/data-manager/government-list',
              name: '治理列表'
            },
            {
              path: '/data-manager/data-trace',
              name: '数据追溯'
            }
          ]
        }
      ]
    }
    openKeys = menuList.map(item => item.path);
    this.props.onSelectMenuItem(this.props.location.pathname);
    let bOn = false;
    bOn = menuList.some((route: IMenuItem) => {
      if (route.path === this.props.location.pathname) {
        return true;
      } else {
        if (route.children) {
          return route.children.some(child => child.path === this.props.location.pathname);
        } else {
          return false;
        }
      }
    });
    if (!bOn) {
      this.props.history.replace('/login');
    }
    this.setState({
      menuList,
      openKeys,
    });
  }

  public render() {
    const { menuList, openKeys } = this.state;
    const { currentRoute } = this.props;
    return (
      <div className={style.container}>
        <Menu
          selectedKeys={[currentRoute]}
          openKeys={openKeys}
          mode='inline'
          style={{ width: 250 }}
          className='main-menu'
          onOpenChange={this.changeSubMenu}
          onSelect={this.changeMenuItem}
        >
          {
            menuList.map((item: any) => {
              if (item.children && item.children.length) {
                return (
                  <SubMenu key={item.path}
                    title={
                      <span>
                        <Icon type={item.icon} />
                        <span>{item.name}</span>
                      </span>
                    }
                  >
                    {
                      item.children.map((child: any) => {
                        return (
                          <Item key={child.path}>
                            <Link to={child.path}>
                              {child.name}
                            </Link>
                          </Item>
                        )
                      })
                    }
                  </SubMenu>
                )
              } else {
                return (
                  <Item key={item.path}>
                    <Link to={item.path}>
                      {item.name}
                    </Link>
                  </Item>
                )
              }
            })
          }
        </Menu>
      </div>
    );
  }

  public changeSubMenu = (openKeys: string[]) => {
    this.setState({
      openKeys
    });
  }

  public changeMenuItem = ({ item, key }) => {
    this.props.onSelectMenuItem(key);
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainMenu));
