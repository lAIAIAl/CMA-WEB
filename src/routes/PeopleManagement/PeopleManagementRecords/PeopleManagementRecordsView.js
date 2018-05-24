import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Radio, message} from 'antd';
const { Column, ColumnGroup } = Table;

import {baseAddress} from 'services';
import OperationComponent from 'common/basic/components/OperationComponent';
import AddPeopleForm from './AddPeopleForm';
import InspectPeople from './InspectPeople';
import $ from 'lib/jquery-3.3.1';

const FormItem = Form.Item;
//名称，部门，职位，档案编号，档案存放位置，档案扫描件



const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function handleImage(text){
	let x = fileData.find(function(x){
  		return x.name == text;
  	});
	console.log(x);
}


function sendMessage(url, OPTION, sendData, sucessAction, failAction){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open(OPTION, url, true);
	//xmlhttp.dataType = 'jsonp';
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
    		sucessAction(xmlhttp);
    	}
    	if(xmlhttp.status==404){
    		//window.alert("404!");
    		failAction();
    	}
  	};
	xmlhttp.send(sendData);
}

class PeopleManagementRecordsViewF extends React.Component{

	state = {
	    selectedRowKeys: [], // Check here to configure the default column
	    fileData: [],
	    loading: false,
		visible: false,

	};

	constructor(props){
		super(props);

	}

  	handleInspect = (props) => {
        this.props.addTab("人员详情", "人员详情", InspectPeople, props);
    }

	handleCreate = () => {
    	const form = this.formRef.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}
      		//TODO:ajax add.
      		let temp = values;

      		temp.fileImage = null;
      		

  			console.log(JSON.stringify(temp));
/*  			$.post(baseAddress+"/cma/StaffFile/addStaff",
  				JSON.stringify(temp),
  				(res, status) => {
  					message.success("成功");
  				},
  				"json");*/
  			$.ajax({
		      	type: "post",
		      	dataType: 'json',
		      	url: baseAddress+"/cma/StaffFile/addStaff",
		      	contentType: 'application/json',
		      	data: JSON.stringify(temp),
		      	//data: temp,
		      	success: function (d) {
		      		message.success("新增成功");
		      	}
		    });
		    temp.key = -this.state.fileData.length;
  			this.state.fileData.push(temp);

      		form.resetFields();

      		this.setState({ visible: false });
    	});
  	}

    saveFormRef = (formRef) => {
    	this.formRef = formRef;
  	}

  	showModal = () => {
    	this.setState({ visible: true });
  	}

  	handleCancel = () => {
    	this.setState({ visible: false });
  	}

  	componentDidMount() {
    // To disabled submit button at the beginning.
    	this.props.form.validateFields();
  	}
	
  	componentWillMount() {
  		$.get(baseAddress+"/cma/StaffFile/getAll" , null,(res)=>{
  			console.log(res);
  			for (var i = res.length - 1; i >= 0; i--) {
  				res[i].key = res[i].id;
  			}
  			this.setState({
		        fileData: res,
		    });
  		});
  	}
  
  	handleSubmit = (e) => {
    	e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			//TODO:ajax
      			let url = baseAddress+'/cma/StaffFile/querybyname?name=';
      			url += values.peopleName;

		    	sendMessage(url,
		  			"GET",
		  			null,
		  			function(xmlhttp){
		  				//data = xmlhttp.responseText;
		  				console.log("返回结果：" + xmlhttp.responseText);
		  				message.success("获取数据成功");
		  			},
		  			function(){
		  				message.error("无法获取数据");
		  			}
		  		);
        		console.log('Received values of form: ', values);
      		}
    	});
  	}

  	deletePeopleManagementRecords = (e) => {
  		const {selectedRowKeys } = this.state;

  		this.setState({ loading: true });
  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = this.state.fileData.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			let deleteName = this.state.fileData[x].name;

  			$.ajax({
		      	type: "post",
		      	dataType: 'json',
		      	url: baseAddress+"/cma/StaffFile/delete",
		      	contentType: 'application/json',
		      	data: JSON.stringify({name:deleteName}),
		      	success: function (d) {
		      	}
		    });
  			this.state.fileData.splice(x,1);
  		}
  		//TODO:ajax request
  		this.setState({ 
  			loading: false,
  			selectedRowKeys:[] });	
  	}

  	onSelectChange = (selectedRowKeys) => {
    	console.log('selectedRowKeys changed: ', selectedRowKeys);
    	this.setState({ selectedRowKeys });
  	}

  	render() {
	  	const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

	  	const peopleNameError = isFieldTouched('peopleName') && getFieldError('peopleName');

	  	const { loading, selectedRowKeys, visible } = this.state;
		const rowSelection = {
		    selectedRowKeys,
		    onChange: this.onSelectChange,
		};
		const hasSelected = selectedRowKeys.length > 0;
		const columns = [
			{
			  title: '名称',
			  dataIndex: 'name',
			  key: 'name',
			}, 
			{
			  title: '部门',
			  dataIndex: 'department',
			  key: 'department',
			}, 
			{
			  title: '职位',
			  dataIndex: 'position',
			  key: 'position',
			},
			{
			  title: '档案编号',
			  dataIndex: 'fileId',
			  key: 'fileId',
			}, 
			{
			  title: '档案存放位置',
			  dataIndex: 'location',
			  key: 'location',
			},
			{
			  title: '操作',
			  dataIndex: 'detail',
			  key: 'detail',
			  render: (text, record) => {
			  	var props = 
			  	{
			        item: record
			    };
			  	return (
			  		<a 
			  			onClick={()=>{this.handleInspect(props)}}>
			  			查看和修改
			  		</a>
			  	);
			  }
			}
		];
	    return (
	    	<div>
	    		<Card>
	      		<Form layout="inline" onSubmit={this.handleSubmit}>
			        <FormItem
			        	label='按人员姓名查询'
			          	validateStatus={peopleNameError ? 'error' : ''}
			          	help={peopleNameError || ''}
			        >
		          	{getFieldDecorator('peopleName', {
		            	rules: [{ required: true, message: '请输入人员姓名！' }],
		          		})(
		            	<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="人员姓名" />
		          	)}
		        	</FormItem>
	        
		        	<FormItem>
			          	<Button
			            	type="primary"
			            	htmlType="submit"
			            	disabled={hasErrors(getFieldsError())}
			          	>查询
			          	</Button>
		        	</FormItem>
	      		</Form>
	      		</Card>

	      			<Table 
	      				rowSelection={rowSelection} 
	      				columns={columns} 
	      				
	      				dataSource={this.state.fileData}>
  					</Table>
	      		<br/>
	      		<div>
	      		<Button 
	      			type="primary" 
	      			shape='circle' 
	      			onClick={this.showModal} 
	      			icon='plus' 
	      			style={{margin:'0px 20px'}}></Button>
			        <AddPeopleForm
			          	wrappedComponentRef={this.saveFormRef}
			          	visible={this.state.visible}
			          	onCancel={this.handleCancel}
			          	onCreate={this.handleCreate}
			        />
	      		<Button
	      			shape="circle"
	      			icon="minus"
	      			disabled={!hasSelected}
	      			size="large"
	      			type="danger"
	      			onClick={this.deletePeopleManagementRecords}
	      			>
	      		</Button>
	      		</div>
	      	</div>
	    );
  	}
};

const PeopleManagementRecordsView = Form.create()(PeopleManagementRecordsViewF);
export default PeopleManagementRecordsView;
