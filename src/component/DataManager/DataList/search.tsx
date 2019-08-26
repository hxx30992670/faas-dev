import * as React from 'react';
import { ISearch } from 'src/views/DataManager/DataManager/DataList/index';
import { Input, Select, DatePicker, Icon, Button, message as Message, Modal } from 'antd';
import style from './style.module.less';
import { IStoreType } from 'src/types';
import { connect } from 'react-redux';
import request from 'src/utils/Request';
import moment from 'moment';

export interface ISearchProps {
  searchValue: ISearch;
  changeSelect: any[];
  total: number;
  getDataList: () => void;
  changeSearchValue: (key: string, value: any) => void;
  resetSearch: () => void;
}
export interface ISearchState {
  dataName: any,
  dateRang: any[]
}

const mapStateToProps = (state: IStoreType) => ({
  changeSelect: state.selectList
})

class Search extends React.Component<ISearchProps, ISearchState> {
  constructor(props) {
    super(props);
    this.state = {
      dataName: '',
      dateRang: []
    }
  }

  public render() {
    //const { searchValue } = this.props;
    return (
      <div className={style.container}>
        <div className={style.left}>
          <div className={style.select}>
            <Select placeholder='请选择数据类型' style={{ width: '100%' }} value={this.props.searchValue.dataType} onChange={this.changeDataType}
              allowClear={true}
            >
              <Select.Option value="1">文件</Select.Option>
              <Select.Option value="2">接口</Select.Option>
              <Select.Option value="3">库表</Select.Option>
            </Select>
          </div>
          <div className={style.input}>
            <Input.Search addonBefore={<Icon type='search' />} enterButton='搜索'
              value={this.state.dataName}
              placeholder='请输入名称进行搜索'
              onChange={this.changeDataName}
              onSearch={this.props.getDataList}
            />
          </div>
          <div className={style.datePicker}>
            <DatePicker.RangePicker placeholder={['开始时间', '结束时间']}
              onChange={this.changeRangDate}
              allowClear={true}
              value={this.state.dateRang}
            />
          </div>
          <div className={style.searchResult}>
            {
              this.props.total ? <span>找到记录{this.props.total}条</span> : ''
            }
          </div>
        </div>
        <div>
          <Button type="danger" style={{ marginRight: 10 }} title='删除' onClick={this.deleteDataList}>
            <Icon type='delete' />
          </Button>
          <Button type="default" title='刷新' onClick={this.resetSearch}>
            <Icon type='undo' />
          </Button>
        </div>
      </div>
    );
  }
  private deleteDataList = async () => {
    if (this.props.changeSelect.length) {
      try {
        const result = await Modal.confirm({
          title: '删除',
          content: `确定删除选中的${this.props.changeSelect.length}项吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            return new Promise(async (resolve, reject) => {
              const ids = this.props.changeSelect.map(item => item.id);
              const params = {
                idList: ids
              }
              const { status, message } = await request.post('/collection/info/Data/delete', params, {
                loading: true,
                loadingTitle: '删除中……'
              });
              if (status === 200) {
                await this.props.getDataList();
                Message.success('删除成功');
                resolve();
              } else {
                Message.warning(message);
                reject(message);
              }
            });
          }
        });
        console.log(result);
      } catch (e) {

      }
    } else {
      Message.warning('请选择要删除的数据');
    }
  }

  private changeDataType = (value: string) => {
    console.log(value);
    this.props.changeSearchValue('dataType', value);
  }
  private changeDataName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({
      dataName: value
    }, () => {
      this.props.changeSearchValue('dataName', value);
    })
  }
  private changeRangDate = (val) => {
    this.setState({
      dateRang: val
    }, () => {
      const dateRang = val.map(item => {
        return moment(item).format("YYYY-MM-DD");
      });
      this.props.changeSearchValue('dateRang', dateRang);
    })
  }
  private resetSearch = () => {
    this.setState({
      dateRang: [],
      dataName: ''
    }, () => {
      this.props.resetSearch();
    })
  }
}

export default connect(mapStateToProps, null)(Search);
