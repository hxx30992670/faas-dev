import * as React from 'react';
import style from './main.module.less';
import moment from 'moment';
import { Button, Popover } from 'antd';

export interface IServiceItemProps {
  serviceItem: any,

}
export interface IServiceItemState {
  visible: boolean;
}

export default class ServiceItem extends React.Component<IServiceItemProps, IServiceItemState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  public render() {
    const { serviceItem } = this.props;
    const detaiList = () => {
      const result = serviceItem.serviceItemDetailList.map((item, index) => {
        return (
          <Popover key={index} content={
            <div className={style.tipBox}>
              <p style={{ lineHeight: '36px' }}>
                <span className={style.title}>类型：</span>
                <span>{item.type}</span>
              </p>
              <p style={{ lineHeight: '36px' }}>
                <span className={style.title}>说明：</span>
                <span>{item.name}</span>
              </p>
              <p style={{ lineHeight: '36px' }}>
                <span className={style.title}>长度：</span>
                <span>{item.length ? item.length : '-'}</span>
              </p>
            </div>
          } placement='topRight'>
            <div className={style.tag}>{item.name}</div>
          </Popover>
        )
      });
      return result;
    }
    return (
      <div className={style.listItem}>
        <div className={style.row}>
          <h4 className={style.name}>
            {serviceItem.serviceName}
          </h4>
        </div>
        <div className={style.row}>
          <p className={style.time}>创建时间：{moment(serviceItem.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
          <p className={style.time}>最后更新时间：{moment(serviceItem.updateTime).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
        <div className={style.row}>
          <span>{serviceItem.serviceStatus}</span>
          <span>{serviceItem.serviceTopic}</span>
          <span>服务详情：<Button type='link' size='small' onClick={this.showDetail}>{this.state.visible ? '隐藏' : '查看'}</Button></span>
        </div>
        {
          this.state.visible &&
          <div className={style.detail}>
            {detaiList()}
          </div>
        }
      </div>
    );
  }
  private showDetail = () => {
    this.setState(state => {
      return {
        visible: !state.visible
      }
    })
  }
}
