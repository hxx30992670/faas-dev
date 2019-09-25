import * as React from 'react';
import { createRef } from 'react';
import style from './style.module.less';
import LeftMain from "./left";
import RightMain from "./right";
export interface IDataCategoryProps {

}
export interface IDataCategoryState {

}
class DataCategory extends React.Component<IDataCategoryProps, IDataCategoryState> {
	public left: any;
	constructor(props) {
		super(props);
		this.left = createRef();
	}

	public render() {
		return (
			<div className={style.container}>
				<div className={style.main}>
					<div className={style.left}>
						<LeftMain ref={this.left} />
					</div>
					<div className={style.right}>
						<RightMain leftComponent={this.left} />
					</div>
				</div>
			</div>
		);
	}
}

export default DataCategory;