import * as React from 'react';
import style from './main.module.less';
import LeftMain from './Left';
import RightMain from './Right';

export interface IServiceManagerProps {
}
export interface IServiceManagerState {
  currentServiceId: any;
  currentTopicId: any;
	pageIndex: number;
	searchValue: any;
}

export default class ServiceManager extends React.Component<IServiceManagerProps, IServiceManagerState> {
  public rightElement: any;
  constructor(props) {
    super(props);
    this.state = {
      currentServiceId: undefined,
      currentTopicId: undefined,
	    pageIndex: 1,
	    searchValue: undefined
    }
    this.rightElement = React.createRef();
  }

  public render() {
    return (
      <div className={style.container}>
        <div className={style.main}>
          <div className={style.left}>
            <LeftMain currentServiceId={this.state.currentServiceId} currentTopicId={this.state.currentTopicId}
              changeKeyValue={this.changeKeyValue}
            />
          </div>
          <div className={style.right}>
            <RightMain
              currentServiceId={this.state.currentServiceId} currentTopicId={this.state.currentTopicId}
              changeKeyValue={this.changeKeyValue}
              ref={this.rightElement}
	            changePageIndex={this.changePageIndex}
	            changeSearchValue={this.changeSearchValue}
	            pageIndex={this.state.pageIndex}
	            searchValue={this.state.searchValue}
            />
          </div>
        </div>
      </div>
    );
  }
  private changeKeyValue = (key: any, value: any) => {
    const { getServiceListData } = this.rightElement.current;
    if (key === 'currentServiceId') {
      this.setState({
        currentServiceId: value,
	      currentTopicId: undefined,
	      pageIndex: 1,
	      searchValue: undefined
      }, () => {
        getServiceListData();
      })
    } else if (key === 'currentTopicId') {
      this.setState({
        currentTopicId: value,
	      currentServiceId: undefined,
	      pageIndex: 1,
	      searchValue: undefined
      }, () => {
        getServiceListData();
      })
    }
  }
  private changePageIndex = (page: number, callBack: () => void) => {
  	this.setState({
		  pageIndex: page
	  }, () => {
  		if(callBack) {
  			callBack();
		  }
	  })
  }
  private changeSearchValue = (val: any) => {
  	this.setState({
		  searchValue: val
	  })
  }
}
