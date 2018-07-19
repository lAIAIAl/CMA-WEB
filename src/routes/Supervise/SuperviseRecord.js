import React from 'react';
import {Form, Button, Row, Col, Card, Table, message} from 'antd';

const FormItem = Form.Item;

import $ from 'lib/jquery-3.3.1';
import {baseAddress} from 'services';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getSupervise, getSupervisePlans, getSuperviseRecord} from './RequestFunction';
import ModifySuperviseRecord from './ModifySuperviseRecord';

const SuperviseRecord = Form.create()(
class extends React.Component{

	state = {
		superviseRecord:{    	
			"recordId": 5,
	    	"planId": 1,
	    	"department": "市场部",
	    	"supervisor" : "张三",
	    	"superviseDate" : "2018-03-03",
	    	"supervisedPerson" : "王五",
	    	"record" : "记录",
	    	"conclusion" : "好",
	    	"operator" : "李四",
	    	"recordDate" : "2018-05-11",
		}

	}

	constructor(props){
		super(props);
		this.unsubscribe = getStore().subscribe(this.refreshData);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	componentWillMount() {
		getSuperviseRecord(this.props.planId);
	}

	refreshData = () => {
		let data = getStore().getState().SuperviseRecord.items;
		if(data.length > 0){
			this.setState({
				superviseRecord: getStore().getState().SuperviseRecord.items[0]
			});
		}
		else{
			this.setState({
				superviseRecord: {}
			});
		}
	}

	handleModify = () => {
		this.props.addTab("修改监督记录", "修改监督记录", ModifySuperviseRecord, 
			{
				recordId : this.state.superviseRecord.recordId,
				data : this.state.superviseRecord
			}
		);
	}

	handleDelete = () => {
		$.ajax({
			type: "post",
			url: baseAddress+"/cma/SupervisionRecord/deleteOne",
			data: {recordId : this.state.superviseRecord.recordId},
			async: false,
			success: function (d) {

			}
		});
		console.log(this.state.superviseRecord.recordId);
		getSuperviseRecord(this.props.planId);
	}

	render(){
		const superviseRecord = this.state.superviseRecord;

		const formItemLayout = 
      	{
        	labelCol: { span: 6 },
        	wrapperCol: { span: 18 },
      	};

		return (
			<div>
				<Card
					title="监督记录内容"
				>
					<Row key='0'>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="部门"
	                    	>
	                      	{superviseRecord.department}
	                    	</FormItem>
	                  	</Col>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="监督员"
	                    	>
	                      	{superviseRecord.supervisor}
	                    	</FormItem>
	                  	</Col>
              		</Row>
              		<Row key='1'>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="监督日期"
	                    	>
	                      	{superviseRecord.superviseDate}
	                    	</FormItem>
	                  	</Col>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="被监督人姓名"
	                    	>
	                      	{superviseRecord.supervisedPerson}
	                    	</FormItem>
	                  	</Col>
              		</Row>
              		<Row key='2'>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="监督内容记录"
	                    	>
	                      	{superviseRecord.record}
	                    	</FormItem>
	                  	</Col>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="结论"
	                    	>
	                      	{superviseRecord.conclusion}
	                    	</FormItem>
	                  	</Col>
              		</Row>
              		<Row key='3'>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="操作员"
	                    	>
	                      	{superviseRecord.operator}
	                    	</FormItem>
	                  	</Col>
	                  	<Col span={12}>
	                    	<FormItem
	                      	{...formItemLayout}
	                        	label="记录时间"
	                    	>
	                      	{superviseRecord.recordDate}
	                    	</FormItem>
	                  	</Col>
              		</Row>
				</Card>
				<Button 
                	style={{margin:'5px 10px'}}
                	type="primary" 
                	onClick={this.handleModify}>
                	修改
            	</Button>
            	<Button 
                	type="danger"
                	onClick={this.handleDelete}>
                	删除
            	</Button>
				
			</div>
		);
	}

}
)

export default SuperviseRecord;