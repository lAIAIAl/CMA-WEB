import React from 'react';
import {Form, Button, Row, Col, Card, Table, message, Modal, Input} from 'antd';
import SuperviseRecord from './SuperviseRecord';

const FormItem = Form.Item;

import AddSupervisePlan from './AddSupervisePlan';
import AddSuperviseRecord from './AddSuperviseRecord';

import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getSupervise, getSupervisePlans, getSuperviseRecord} from './RequestFunction';

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

const SupervisePlans = Form.create()(
class extends React.Component{

	state = {
		supervisedetails: {},
		superviseplans: [],
		selectedRowKeys: [],
		visible: false,
	};

	constructor(props){
		super(props);
		
		this.unsubscribe = getStore().subscribe(this.refreshData);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	componentWillMount() {
		getSupervisePlans(this.props.item.id);
		this.state.supervisedetails = this.props.item;
	}

	refreshData = () => {
		let data = getStore().getState().Supervise.items;
		let detail = {};
		for (var i = data.length - 1; i >= 0; i--) {
			if(data[i].id == this.props.item.id)
				detail = data[i];
		}
		this.setState({
			superviseplans: getStore().getState().SupervisePlans.items,
			supervisedetails: detail,
		});
	}

	handleInspect = (record) => {
		//message.info("233");
		//this.props.addTab("监督记录", "监督记录", SuperviseRecord, null);

		//console.log(record.planId);
		getSuperviseRecord(record.planId);
		let data = getStore().getState().SuperviseRecord.items;
		console.log(data);
		if(data == null || data.length == 0)
			this.props.addTab("新增记录", "新增记录", AddSuperviseRecord, {planId:record.planId});
		else{
			this.props.addTab("监督记录", "监督记录", SuperviseRecord, {planId:record.planId});
		}

	}

	handleCreate = () => {
    	const form = this.formRef.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}
      		//TODO:ajax add.
      		let temp = values;
      		
  			temp.id = this.props.item.id;

	  		$.ajax({
			    type: "post",
			    url: baseAddress+"/cma/Supervision/modifyOne",
			    data: temp,
			    async: false,
			    success: function (d) {

			      	}
			});
			console.log(temp);


      		form.resetFields();

      		this.setState({ 
      			visible: false ,
      		});

      		getSupervise();
      		
    	});
  	}

	showModal = () => {
    	this.setState({ visible: true });
  	}

  	handleCancel = () => {
    	this.setState({ visible: false });
  	}

  	saveFormRef = (formRef) => {
    	this.formRef = formRef;
  	}

  	handleAddPlan = () => {
  		console.log(this.props.item);
  		this.props.addTab("新增计划", "新增计划", AddSupervisePlan, {item: this.props.item.id});
  	}

  	onSelectChange = (selectedRowKeys) => {
    	this.setState({ selectedRowKeys });
  	}

  	handleDelete = () => {
  		const {selectedRowKeys } = this.state;

  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = this.state.superviseplans.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			let deleteId = this.state.superviseplans[x].planId;
  			
  			$.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/SupervisionPlan/deleteOne",
		      	data: {planId:deleteId},
		      	async:false,
		      	success: function (d) {
		      		
		      	}
		    });
  			console.log(deleteId);
  		}

		this.setState({
			selectedRowKeys: [],
		});

		getSupervisePlans(this.props.item.id);
  	}

	render(){

		const {selectedRowKeys} = this.state;

		const rowSelection = {
		    selectedRowKeys,
		    onChange: this.onSelectChange,
		};


		const columns = [
		{
			title : '序号',
			dataIndex : 'planId',
			key : 'planId',
		},
		{
			title : '监督对象',
			dataIndex : 'object',
			key : 'object',
		},
		{
			title : '监督时间/频次',
			dataIndex : 'dateFrequency',
			key : 'dateFrequency',
		},
		{
			title: '操作',
			dataIndex: 'detail',
			key: 'detail',
			render: (text, record) => {

				return (
				  	<a
				  		onClick={()=>{this.handleInspect(record)}}>
				  		查看详情
				  	</a>
				);
			}
		}
		];

		const supervisedetails = this.state.supervisedetails;

		const formItemLayout = 
      	{
        	labelCol: { span: 6 },
        	wrapperCol: { span: 18 },
      	};

		return (
			<div>
				<Card
					title='监督计划详情'
				>
				<Row key='0'>
                  	<Col span={12}>
                    	<FormItem
                      	{...formItemLayout}
                        	label="编制人"
                    	>
                      	{supervisedetails.author}
                    	</FormItem>
                  	</Col>
                  	<Col span={12}>
                    	<FormItem
                      	{...formItemLayout}
                        	label="编制日期"
                    	>
                      	{supervisedetails.createDate}
                    	</FormItem>
                  	</Col>
              	</Row>
              	<Row key='1'>
                  	<Col span={12}>
                    	<FormItem
                      	{...formItemLayout}
                        	label="批准人"
                    	>
                      	{supervisedetails.approver}
                    	</FormItem>
                  	</Col>
                  	<Col span={12}>
                    	<FormItem
                      	{...formItemLayout}
                        	label="批准日期"
                    	>
                      	{supervisedetails.approveDate}
                    	</FormItem>
                  	</Col>
              	</Row>
              	<Row key='2'>
              		<Col span={12}>
                    	<FormItem
                      	{...formItemLayout}
                        	label="状态"
                    	>
                      	{supervisedetails.situation}
                    	</FormItem>
                  	</Col>
                  	<Col span={12}>
                    	<FormItem
                      	{...formItemLayout}
                        	label="备注"
                    	>
                      	{supervisedetails.remark}
                    	</FormItem>
                  	</Col>
              	</Row>
              	</Card>

              	<Button
					type='primary'
					style={{margin:'10px 20px 10px 0px'}}
					disabled={this.state.supervisedetails.situation == "已执行"}
					onClick={this.showModal}
				>修改备注</Button>

				<ModifyForm
			          	wrappedComponentRef={this.saveFormRef}
			          	visible={this.state.visible}
			          	onCancel={this.handleCancel}
			          	onCreate={this.handleCreate}
			    />

				<Table
					rowSelection={rowSelection} 
					columns = {columns}
					dataSource = {this.state.superviseplans}
				>
				</Table>

				<Button
					type='primary'
					style={{margin:'10px 20px 10px 0px'}}
					disabled={this.state.supervisedetails.situation == "已执行"}
					onClick={this.handleAddPlan}
				>新增计划</Button>

				<Button
					type='danger'
					style={{margin:'10px 20px 10px 0px'}}
					disabled={this.state.supervisedetails.situation == "已执行"}
					onClick={this.handleDelete}
				>删除计划</Button>
				
			</div>
		);
	}
}
);

const ModifyForm = Form.create()(
class extends React.Component{
	render(){
		const { visible, onCancel, onCreate, form } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Modal
	            visible={visible}
	            title="修改备注"
	            okText="确定"
	            onCancel={onCancel}
	            onOk={onCreate}
	        >
		        <Form layout="vertical">
		            <FormItem label="备注">
		                {getFieldDecorator('remark', {
		                    rules: [{ required: true, message: '请输入备注！' }],
		                })(
		                        <Input />
		                )}
		            </FormItem>
		        </Form>
		    </Modal>
        );
	}
}
)

export default SupervisePlans;