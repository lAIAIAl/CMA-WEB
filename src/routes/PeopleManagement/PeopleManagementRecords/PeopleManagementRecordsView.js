import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar} from 'antd';
const { Column, ColumnGroup } = Table;

import ListView from 'common/basic/components/ListView';

const FormItem = Form.Item;
//名称，部门，职位，档案编号，档案存放位置，档案扫描件
const columns = [
{
  title: '名称',
  dataIndex: 'name',
}, 
{
  title: '部门',
  dataIndex: 'dep',
}, 
{
  title: '职位',
  dataIndex: 'job',
},
{
  title: '档案编号',
  dataIndex: 'fileNo',
}, 
{
  title: '档案存放位置',
  dataIndex: 'filePlace',
}
];

let data = [
{
  key: '10',
  name: 'lxd',
  dep: '档案部',
  job: '哈哈哈',
  fileNo: '12',
  filePlace: '档案室',
  fileImage: '暂无'
}, 
{

  key: '24',
  name: 'wlz',
  dep: '档案部',  
  job: '哈哈哈',
  fileNo: '123',
  filePlace: '档案室',
  fileImage: 'kong'
},
{

  key: '3',
  name: 'cc',
  dep: '市场部',  
  job: '哈哈哈',
  fileNo: '1234',
  filePlace: '档案室',
  fileImage: 'kong'
},
{

  key: '4',
  name: 'zt',
  dep: 'shichang部',  
  job: '哈哈哈',
  fileNo: '12345',
  filePlace: '档案室',
  fileImage: 'kong'
}
];

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
	let x = data.find(function(x){
  		return x.name == text;
  	});
	console.log(x);
}


function sendMessage(url, OPTION, data, action){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open(OPTION, url, true);
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
    		action();
    	}
    	if(xmlhttp.status==404){
    		window.alert("404!");
    		//action();
    	}
  	};
	xmlhttp.send(JSON.stringify(data));
}

class PeopleManagementRecordsViewF extends React.Component{


  
	state = {
	    selectedRowKeys: [], // Check here to configure the default column
	    loading: false,
		visible: false
	};


  	componentDidMount() {
    // To disabled submit button at the beginning.
    	this.props.form.validateFields();
  	}

  	showModal = () => {
    	this.setState({
      	visible: true,
    	});
  	}
  
  	handleSubmit = (e) => {
    	e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		if (!err) {
        		console.log('Received values of form: ', values);
      		}
    	});
  	}

  	deletePeopleManagementRecords = (e) => {
  		const {selectedRowKeys } = this.state;

  		this.setState({ loading: true });
  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = data.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			//console.log(x);
  			if(x>-1)data.splice(x,1);

  		}
  		//TODO:ajax request
  		this.setState({ loading: false });	
  	}

  	onSelectChange = (selectedRowKeys) => {
    	console.log('selectedRowKeys changed: ', selectedRowKeys);
    	this.setState({ selectedRowKeys });
  	}

  	handleCancel = () => {
    	this.setState({
      	visible: false,
    	});
  	}

  	handleOk = () => {
    	this.setState({
      		ModalText: 'The modal will be closed after two seconds',
      		confirmLoading: true,
    	});
    	setTimeout(() => {
      		this.setState({
        	visible: false,
        	confirmLoading: false,
      		});
    	}, 2000);
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

	      		<Card>
	      			<Table 
	      				rowSelection={rowSelection} 
	      				columns={columns} 
	      				expandedRowRender={record => 
	      					<p>
	      						<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
	      					</p>}
	      				dataSource={data}>
  					</Table>
	      		</Card>
	      		<br/>
	      		<div>
	      		<Button
	      			style={{margin: '0px 20px' }}
	      			shape="circle"
	      			icon="plus"
	      			size="large"
	      			type="primary"
	      			onClick={this.showModal}
	      			>
	      		</Button>
	      		<Modal
		          	visible={visible}
		          	title="新增人员管理档案记录"
		          	onOk={this.handleOk}
          			
          			onCancel={this.handleCancel}
		          	footer={[
		            	<Button key="back" type="danger" onClick={this.handleCancel}>返回</Button>,
		            	<Button key="submit" type="primary" loading={loading} >
		              	提交
		            	</Button>,
		          	]}
		        	>
		          	<p>Some contents...</p>
		          	<p>Some contents...</p>
		          	<p>Some contents...</p>
		          	<p>Some contents...</p>
		          	<p>Some contents...</p>
		        </Modal>
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

/*export default class PeopleManagementRecordsView extends React.Component{
	constructor(props){
		super(props);

	}
	render (){
		const PMRV = Form.create()(PeopleManagementRecordsViewF);
		return(
			<div>
				<PMRV />

			</div>
		);
	}
}*/