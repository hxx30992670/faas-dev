import * as React from 'react';
import { ISearch } from 'src/views/DataManager/DataManager/DataList/index';
import { Input, Select, DatePicker, Icon, Button } from 'antd';
import style from './style.module.less';

export interface ISearchProps {
  searchValue: ISearch;
}
export interface ISearchState {

}

export default class App extends React.Component<ISearchProps, ISearchState> {
  constructor(props) {
    super(props);
  }

  public render() {
    //const { searchValue } = this.props;
    return (
      <div className={style.container}>
        <div className={style.left}>
          <div className={style.select}>
            <Select placeholder='请选择数据类型' style={{ width: '100%' }}>
              <Select.Option value="1">文件</Select.Option>
              <Select.Option value="2">接口</Select.Option>
              <Select.Option value="3">库表</Select.Option>
            </Select>
          </div>
          <div className={style.input}>
            <Input.Search addonBefore={<Icon type='search' />} enterButton='搜索' />
          </div>
          <div className={style.datePicker}>
            <DatePicker.RangePicker placeholder={['开始时间', '结束时间']} />
          </div>
          <div className={style.searchResult}>
            找到相关搜索结果179条
          </div>
        </div>
        <div>
          <Button type="danger" style={{ marginRight: 10 }} title='删除'>
            <Icon type='delete' />
          </Button>
          <Button type="default" title='刷新'>
            <Icon type='undo' />
          </Button>
        </div>
      </div>
    );
  }
}
