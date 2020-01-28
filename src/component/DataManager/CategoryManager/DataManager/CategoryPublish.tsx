import * as React from 'react';
import style from './categoryPublish.module.less';
import { Select, Button, message as MSG } from 'antd';
import request from 'src/utils/Request';

export interface ICategoryPublishProps {
  leftComponent: any
}
export interface ICategoryPublishState {
  categoryList: any[],
  selectCategory: any,
}
export default class CategoryPublish extends React.Component<ICategoryPublishProps, ICategoryPublishState> {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      selectCategory: undefined
    }
    this.getCategoryData();
  }

  public render() {
    return (
      <div className={style.container}>
        <h3 className={style.title}>
          请选择要发布的目录
        </h3>
        <div className={style.selectWrap}>
          <Select value={this.state.selectCategory} className={style.customSelect} placeholder='请选择要发布的目录'
            onChange={this.changeCategory}
          >
            {
              this.state.categoryList.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </div>
        <div className={style.buttonWrap}>
          <Button type='primary' onClick={this.publishCategory}>发布</Button>
        </div>
      </div>
    );
  }
  private changeCategory = (val: any) => {
    this.setState({
      selectCategory: val
    });
  }
  private publishCategory = async () => {
    if (!this.state.selectCategory) {
      MSG.warn('请选择要发布的目录');
      return;
    }
    const params = {
      subId: this.state.selectCategory
    }
    try {
      const { status, message } = await request.post('/collection/info/DirectorySub/releaseSupDirectory', params, {
        loading: true,
        loadingTitle: '发布目录中……'
      });
      if (status === 200) {
        const { current } = this.props.leftComponent;
        MSG.success('发布成功');
        this.getCategoryData();
        current.getCategoryTree();
        current.unPublishedCategory();
        this.setState({
          selectCategory: undefined
        })
      } else {
        MSG.warn(message);
      }
    } catch (e) {
      MSG.error('内部错误');
    }
  }
  private getCategoryData = async () => {
    try {
      const { data, message, status } = await request.post('/collection/info/DirectoryRoot/listRootAndSupDirectoryByStatus', {
        auditResult: -1
      }, {
        loading: true,
        loadingTitle: '获取待发布目录数据中……'
      });

      if (status === 200) {
        this.setState({
          categoryList: data
        });
      } else {
        MSG.warn(message);
      }

    } catch (e) {

    }
  }
}
