import * as React from 'react';
import style from './main.module.less';
import { Input, Icon, message as Msg, Tree } from 'antd';
import request from 'src/utils/Request';
const { TreeNode } = Tree;

export interface ILeftMainProps {
  currentServiceId: any;
  currentTopicId: any;
  changeKeyValue: (key: any, value: any) => void
}
export interface ILeftMainState {
  searchValue: string;
  treeDataList: any[];
  expanedKeys: any[];
  autoExpanded: boolean;
  categoryKeyList: any[];
}

export default class LeftMain extends React.Component<ILeftMainProps, ILeftMainState> {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      treeDataList: [],
      autoExpanded: true,
      expanedKeys: [],
      categoryKeyList: []
    }
  }

  public componentDidMount() {
    this.getDataList();
  }
  public render() {
    let { searchValue } = this.state;
    const loop = (data: any[]) => {
      const resultData = data.map(item => {
        const index = item.topicName ? item.topicName.indexOf(searchValue) : item.serviceName.indexOf(searchValue);
        const beforeStr = item.topicName ? item.topicName.substr(0, index) : item.serviceName.substr(0, index);
        const afterStr = item.topicName ? item.topicName.substr(index + searchValue.length) : item.serviceName.substr(index + searchValue.length);
        const title =
          index > -1 ?
            (<span onClick={this.selectTreeData.bind(this, item)} >
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>) :
            (
              <span onClick={this.selectTreeData.bind(this, item)} >
                {item.topicName ? item.topicName : item.serviceName}
              </span>
            );

        if (item.serviceList && item.serviceList.length) {
          return (
            <TreeNode key={item.topicId ? item.topicId : item.serviceName} title={title}>
              {loop(item.serviceList)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.topicId ? item.topicId : item.serviceName} title={title} selectable={false} />;
      });
      return resultData;
    }

    return (
      <div>
        <div className={style.searchWrap}>
          <Input
            value={searchValue}
            placeholder={'请输入关键词'}
            prefix={<Icon type='search'
              style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.changeSearchText}
          />
        </div>
        <div className={style.treeWrap}>
          <Tree
            onExpand={this.expanedTree}
            autoExpandParent={this.state.autoExpanded}
            expandedKeys={this.state.expanedKeys}
            style={{ maxHeight: 350, overflowY: 'auto' }}
          >
            {loop(this.state.treeDataList)}
          </Tree>
        </div>
      </div>
    );
  }
  //改变搜索框文字
  private changeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    let expanedKeys = this.state.categoryKeyList.map(item => {
      if (item.topicName) {
        if (value && item.topicName.includes(value)) {
          return this.findPrimary(item.topicId, this.state.treeDataList);
        } else {
          return null
        }
      } else if (item.serviceName) {
        if (value && item.serviceName.includes(value)) {
          return this.findPrimary(item.serviceId, this.state.treeDataList);
        } else {
          return null
        }
      } else {
        return null;
      }

    }).filter((item, index, self) => item && self.indexOf(item) === index)
    this.setState({
      autoExpanded: true,
      expanedKeys,
      searchValue: e.target.value
    })
  }
  //获取树形菜单数据
  private getDataList = async () => {
    try {
      const { status, message, data } = await request.get('/serviceitem/serviceDirectory/getServiceDirectoryTree');
      if (status === 200) {
        const keyList = this.getKeyList([], data)
        this.setState({
          treeDataList: data,
          categoryKeyList: keyList
        })
      } else if (status === 204) {
        this.setState({
          treeDataList: []
        });
      } else {
        Msg.warn(message);
      }
    } catch (error) {

    }
  }
  private expanedTree = (expanedKeys: any) => {
    this.setState({
      expanedKeys,
      autoExpanded: false
    })
  }
  private findPrimary = (key: string, data: any[]): string => {
    let primaryKey: any = '';
    data.forEach((item, index) => {
      if (item.serviceList && item.serviceList.length) {
        let isYes = item.serviceList.some(child => child.serviceId === key);
        if (isYes) {
          primaryKey = item.topicId;
        }
      }
    });
    return primaryKey;
  }
  private getKeyList = (newArray: any[], data: any[]): any[] => {
    data.forEach((item, index) => {
      newArray.push(item);
      if (item.serviceList && item.serviceList.length) {
        item.serviceList.forEach(service => {
          if (!service.topicId) {
            service.topicId = service.serviceId;
          }
          newArray.push(service)
        });
      }
    });
    return newArray;
  }

  private selectTreeData = (node: any) => {
    const { changeKeyValue } = this.props;
    if (node.serviceId) {
      changeKeyValue('currentServiceId', node.serviceId);
    } else {
      changeKeyValue('currentTopicId', node.topicId);
    }
  }
}
