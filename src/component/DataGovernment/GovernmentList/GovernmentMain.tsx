import * as React from 'react';
import * as style from './main.module.less';
import { Input, Icon, message as Msg, Button } from 'antd';
import request from 'src/utils/Request';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';
//import 'jquery-ui/themes/base/base.css';
$ as any;

export interface IGovernmentMainProps {}
export interface IGovernmentMainState {
  searchValue: string;
  componentList: any[];
  flowList: any[]
}

export default class App extends React.Component<
  IGovernmentMainProps,
  IGovernmentMainState
> {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      componentList: [],
      flowList: []
    };
  }
  public componentDidMount() {
    console.log($);
    this.getTemplateList();
    //this.templateBindDropEvent();
  }
  public render() {
    return (
      <div className={style.governmnetWrap}>
        <div className={style.left}>
          <div>
            <Input.Search
              addonBefore={<Icon type='search' />}
              enterButton='搜索'
              value={this.state.searchValue}
              placeholder='请输入名称进行搜索'
              onChange={this.changeInputValue}
              onSearch={this.searchTemplateList}
            />
          </div>
          <div className={style.templateWrap + ' templateWrap'}>
            <div className={style.title}>工作节点</div>
            {this.state.componentList.map(item => (
              <div
                className={style.item + ' node'}
                data-node={JSON.stringify(item)}
                key={item.id}
              >
                {item.nameChn}
              </div>
            ))}
          </div>
        </div>
        <div className={style.right}>
          <div className={style.title}>
            <span>请拖拽工作节点创建工作流</span>
            <div>
              <Button type='link'>保存</Button>
              <Button type='primary'>取消</Button>
            </div>
          </div>
          <div className={style.flowWrap} id='flowBox'>
            <div className={style.flowItem}>11</div>
          </div>
        </div>
      </div>
    );
  }
  public changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchValue: e.currentTarget.value
    });
  };
  public addNewNode = (data) => {
    const {flowList} = this.state;
    flowList.push(data);
    this.setState({
      flowList
    });
  }
  private searchTemplateList = () => {
    console.log(1);
  };
  private getTemplateList = async () => {
    try {
      let { data, message, status } = await request.get(
        '/processing-core/template/getTemplateList',
        {},
        {
          loading: true,
          loadingTitle: '获取流程组件数据中……'
        }
      );
      if (status === 200) {
        this.setState({
          componentList: data
        }, () => {
          this.templateBindDropEvent();
        });
      } else {
        Msg.warn(message);
      }
    } catch (error) {
      Msg.error(error);
    }
  };
  private templateBindDropEvent = () => {
    const that: this = this;
    $('.templateWrap .node')
      .not('.disabled')
      .draggable({
        addClasses: false,
        scope: 'plant',
        helper: 'clone'
      });
    $('#flowBox').droppable({
      scope: 'plant',
      drop(event, ui: any) {
        // 创建工厂模型到拖拽区
        event.preventDefault();
        let offset: any = ui.offset;
        const $flowBox: any = $('#flowBox').offset();
        //const $context: any = $(ui.helper.context);
        //let oLeft: number = offset.left;
        //let boxLeft: number = $flowBox.left;
        let iLeft: any = offset.left - $flowBox.left;
        let iTop = offset.top - $flowBox.top;
        let data = JSON.parse(ui.helper.attr('data-node'));
        let bOn = that.state.flowList.some(item => item.type === data.type);
        data.style = {
          left: iLeft,
          top: iTop
        };
        if (bOn && (data.type === 0 || data.type === 2)) {
          Msg.warning('输入和输出节点一个流程分别各自只能有一个！');
          return;
        }
        that.addNewNode(data);
      }
    });
  };
}
