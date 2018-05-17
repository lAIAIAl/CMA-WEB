import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Radio} from 'antd';
const { Column, ColumnGroup } = Table;

import OperationComponent from 'common/basic/components/OperationComponent';
import AddPeopleForm from './AddPeopleForm'

const FormItem = Form.Item;
//名称，部门，职位，档案编号，档案存放位置，档案扫描件
const columns = [
{
  title: '名称',
  dataIndex: 'name',
}, 
{
  title: '部门',
  dataIndex: 'department',
}, 
{
  title: '职位',
  dataIndex: 'position',
},
{
  title: '档案编号',
  dataIndex: 'id',
}, 
{
  title: '档案存放位置',
  dataIndex: 'location',
}
];

let data = [
{
	key: '1231',
	name: 'lxd',	    //名称
	department: '档案部',	//部门
    position: '主任',    //职位
    id: '78098109',          //档案编号
    location: '档案室',    //档案位置
    fileImage: '/src/dsafa'   //档案扫描件（图片在服务器的位置）
},
{
	key: '1-1',
	name: 'wlz',	    //名称
	department: '档案部',	//部门
    position: '主任',    //职位
    id: '1756709',          //档案编号
    location: '档案室',    //档案位置
    fileImage: '/src/dsafa'   //档案扫描件（图片在服务器的位置）
},
{
	key: '113-no',
	name: 'cc',	    //名称
	department: '档案部',	//部门
    position: '主任',    //职位
    id: '10298',          //档案编号
    location: '档案室',    //档案位置
    fileImage: '/src/dsafa'   //档案扫描件（图片在服务器的位置）
},
{
	key: '12OIP3522',
	name: 'zt',	    //名称
	department: '档案部',	//部门
    position: '主任',    //职位
    id: '10209',          //档案编号
    location: '档案室',    //档案位置
    fileImage: '/src/dsafa'   //档案扫描件（图片在服务器的位置）
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
		visible: false,
	};

	handleCreate = () => {
    	const form = this.formRef.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}
      		//TODO:ajax add
      		console.log('Received values of form: ', values);
      		let temp = values;
      		temp.key = data.length;
      		data.push(temp);
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

  
  	handleSubmit = (e) => {
    	e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			//TODO:ajax
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

  			if(x>-1)data.splice(x,1);

  		}
  		//TODO:ajax request
  		this.setState({ loading: false });	
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