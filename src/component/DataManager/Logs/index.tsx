import * as React from 'react';
import style from './style.module.less';
import moment from 'moment';
import request from 'src/utils/Request';
import {message as Message} from 'antd';

export interface ILogsProps {
	id: any,
	dataType: any,
	errorClose: () => void
}

export interface ILogsState {
	startTime: string;
	num: string | number;
	status: number | string;
	createTime: string;
	area: any;
}

class Logs extends React.Component<ILogsProps, ILogsState> {
	constructor(props) {
		super(props);
		this.state = {
			startTime: '',
			num: '',
			status: '',
			createTime: '',
			area: ''
		}
		this.getLogData();
	}

	public render() {
		const {startTime, num, status, createTime, area} = this.state;
		return (
			<div className={style.container}>
				<div className={style.item}>
					{moment(startTime).format('YYYY-MM-DD HH:mm:ss')} - 总数量： {num}
				</div>
				{
					status === 0 ?
						<div className={style.item} style={{color: '#27ca8e'}}>
							{moment(createTime).format('YYYY-MM-DD HH:mm:ss')} 入库中 {area}
						</div> : status === 1 ?
						<div className={style.item} style={{color: '#4887ed'}}>
							{moment(createTime).format('YYYY-MM-DD HH:mm:ss')} {area} 成功
						</div> : status === 2 ?
							<div className={style.item} style={{color: '#f56c86'}}>
								{moment(createTime).format('YYYY-MM-DD HH:mm:ss')} {area} 失败
							</div> : ''
				}
			</div>
		)
	}
	private async getLogData() {
		try {
			const {status, message, data} = await request.post('/collection/info/DataFile/selectFileLogByDataId', {
				id: this.props.id,
				dataType: this.props.dataType
			}, {
				loading: true,
				loadingTitle: '获取入库日志数据中……'
			});
			if(status === 200) {
				this.setState({
					createTime: data.createTime,
					startTime: data.startTime,
					num: data.dataNum,
					area: data.insertNum,
					status: data.status
				});
			} else {
				Message.warn(message);
				this.props.errorClose();
			}
		} catch (e) {
			Message.error('服务器错误');
			this.props.errorClose();
		}
	}
}

export default Logs;