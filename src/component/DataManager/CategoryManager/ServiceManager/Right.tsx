import * as React from 'react';
import style from './main.module.less';
import { Input, Icon, List, message as Msg, Pagination } from 'antd';
import request from 'src/utils/Request';
import ServiceItem from './ServiceItem';
import {ChangeEvent} from 'react';

export interface IRightMainProps {
  currentServiceId: any;
  currentTopicId: any;
  changeKeyValue: (key: any, value: any) => void;
  changePageIndex: (page: number,callBack: () => void) => void;
  changeSearchValue: (val: any) => void;
  pageIndex: number;
  searchValue: any;
}
export interface IRightMainState {
  serviceList: any[];
  searchValue: any;
  pageIndex: number;
  pageSize: number;
  total: number;
}

export default class RightMain extends React.Component<IRightMainProps, IRightMainState> {
  constructor(props) {
    super(props);
    this.state = {
      serviceList: [],
      searchValue: undefined,
      pageIndex: 1,
      pageSize: 6,
      total: 0,
    }
  }
  public componentDidMount() {
    this.getServiceListData();
  }

  public render() {
    const renderItem = (item: any) => (
      <List.Item>
        <ServiceItem serviceItem={item} />
      </List.Item>
    )
    return (
      <div>
        <h4 className={style.title}>
          <div className={style.text}>
            服务项
          </div>
        </h4>
        <div className={style.searchWrap}>
          <Input.Search prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />} enterButton='搜索'
            onSearch={this.searchData}
	          value={this.props.searchValue}
	          onChange={this.changeInputValue}
          />
        </div>
        <div className={style.listWrap}>
          <List dataSource={this.state.serviceList} renderItem={renderItem} itemLayout='vertical' />
        </div>
        <div className={style.pageWrap}>
          <Pagination current={this.props.pageIndex}
            total={this.state.total}
            pageSize={this.state.pageSize}
            showTotal={total => (<span>共计：{total}条数据</span>)}
            showQuickJumper={true}
            onChange={this.chanagePage}
	          hideOnSinglePage={true}
          />
        </div>
      </div>
    );
  }
  private getServiceListData = async () => {
    try {
      const params = {
        name: this.props.searchValue,
        pageIndex: this.props.pageIndex,
        pageSize: this.state.pageSize,
        serviceId: this.props.currentServiceId,
        topicId: this.props.currentTopicId
      }
      const { status, data, message, total } = await request.post('/serviceitem/serviceDirectory/getServiceDirectoryDetail', params, {
        loading: true,
        loadingTitle: '获取服务列表中……'
      });
      if (status === 200) {
        this.setState({
          total,
          serviceList: data,
        })
      } else if (status === 204) {
        this.setState({
          total: 0,
          serviceList: [],
        });
      } else {
        Msg.warn(message);
      }
    } catch (error) {
      Msg.error('内部错误');
    }
  }
  private chanagePage = (page: number) => {
    this.props.changePageIndex(page, () => {
    	this.getServiceListData();
    });
  }
  private searchData = () => {
  	console.log(1);
	  this.props.changePageIndex(1, () => {
		  this.getServiceListData();
	  });
  }
  private changeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
  	this.props.changeSearchValue(e.target.value);
  }
}
