import React from 'react';
import {Form, Button, Row, Col, Card, Table, message, Modal, Input} from 'antd';
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;

import SupervisePlans from './SupervisePlans';
import AddSupervise from './AddSupervise';

import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getSupervise} from './RequestFunction';

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

const SuperviseList = Form.create()(
class extends React.Component{

	state = {
		superviselist : [],
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
		getSupervise();
		//this.refreshData();
	}

	refreshData = () => {
		this.setState({
			superviselist: getStore().getState().Supervise.items
		});
	}

	handleInspect = (record) => {
		this.props.addTab("监督计划", "监督计划", SupervisePlans, {item : record});
	}

	addSupervise = () => {
		this.props.addTab("新增监督","新增监督", AddSupervise, null);
	}

	handleCreate = () => {
    	const form = this.formRef.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}
      		//TODO:ajax add.
      		let temp = values;
      		
  			const {selectedRowKeys } = this.state;

  			for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  				let x = this.state.superviselist.findIndex(function(x){
  					return x.key == selectedRowKeys[i];
  				});
  				let approveId = this.state.superviselist[x].id;

  				temp.id = approveId;

  				//console.log(this.state.superviselist[x].situation);
  				if(this.state.superviselist[x].situation == "未批准"){
		  			$.ajax({
				      	type: "post",
				      	url: baseAddress+"/cma/Supervision/approveOne",
				      	data: temp,
				      	async: false,
				      	success: function (d) {

				      	}
				    });
			    	console.log(temp);
				}
  			}

      		form.resetFields();

      		this.setState({ 
      			visible: false ,
      			selectedRowKeys: [],
      		});

      		getSupervise();
      		
    	});
  	}

	handleDelete = () => {

  		const {selectedRowKeys } = this.state;

  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = this.state.superviselist.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			let deleteId = this.state.superviselist[x].id;
  			
  			$.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/Supervision/deleteOne",
		      	data: {id:deleteId},
		      	async:false,
		      	success: function (d) {
		      		
		      	}
		    });
  			console.log(deleteId);
  		}

		this.setState({
			selectedRowKeys: [],
		});

		getSupervise();
	}

	onSelectChange = (selectedRowKeys) => {
    	//console.log('selectedRowKeys changed: ', selectedRowKeys);
    	this.setState({ selectedRowKeys });
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

  	handleExecute = () => {
  		const {selectedRowKeys } = this.state;

  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = this.state.superviselist.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			let execId = this.state.superviselist[x].id;
  			
  			if(this.state.superviselist[x].situation == "已批准"){
  			$.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/Supervision/executeOne",
		      	data: {id:execId},
		      	async:false,
		      	success: function (d) {
		      		
		      	}
		    });
		    	console.log(execId);
			}
  		}

		this.setState({
			selectedRowKeys: [],
		});

		getSupervise();
  	}

	render() {

		const {selectedRowKeys} = this.state;

		const rowSelection = {
		    selectedRowKeys,
		    onChange: this.onSelectChange,
		};

		const columns = [
		{
			title : '编制日期',
			dataIndex : 'createDate',
			key : 'createDate',
		},
		{
			title : '编制人',
			dataIndex : 'author',
			key : 'author',
		},
		{
			title : '批准人',
			dataIndex : 'approver',
			key : 'approver',
		},
		{
			title : '批准日期',
			dataIndex : 'approveDate',
			key : 'approveDate',
		},
		{
			title : '状态',
			dataIndex : 'situation',
			key : 'situation',
		},
		{
			title: '操作',
			dataIndex: 'remark',
			key: 'remark',
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

		//console.log(this.state.superviselist);
		//console.log(columns);

		return (
			<div>
				<Table
					rowSelection={rowSelection} 
					columns = {columns}
					dataSource = {this.state.superviselist}
				>
				</Table>

				<Button
					type='primary'
					style={{margin:'10px 20px 0px 0px'}}
					onClick={this.addSupervise}
				>新增</Button>

				<Button
					type='danger'
					style={{margin:'10px 20px 0px 0px'}}
					onClick={this.handleDelete}
				>删除</Button>

				<Button
					type='primary'
					style={{margin:'10px 20px 0px 0px'}}
					onClick={this.showModal}
				>批准</Button>

				<ApproveForm
			          	wrappedComponentRef={this.saveFormRef}
			          	visible={this.state.visible}
			          	onCancel={this.handleCancel}
			          	onCreate={this.handleCreate}
			    />

				<Button
					type='primary'
					style={{margin:'10px 20px 0px 0px'}}
					onClick={this.handleExecute}
				>执行确认</Button>
			</div>
		);
	}
}
);

const ApproveForm = Form.create()(
class extends React.Component{
	render(){
		const { visible, onCancel, onCreate, form } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Modal
	            visible={visible}
	            title="批准监督"
	            okText="确定"
	            onCancel={onCancel}
	            onOk={onCreate}
	        >
		        <Form layout="vertical">
		            <FormItem label="批准人">
		                {getFieldDecorator('approver', {
		                    rules: [{ required: true, message: '请输入姓名！' }],
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

export default SuperviseList;