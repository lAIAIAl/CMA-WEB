import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Radio, message} from 'antd';
const { Column, ColumnGroup } = Table;

import {baseAddress} from 'services';
import OperationComponent from 'common/basic/components/OperationComponent';
import AddPeopleForm from './AddPeopleForm';
import InspectPeople from './InspectPeople';
import $ from 'lib/jquery-3.3.1';

import ItemContainer from 'common/basic/containers/ItemContainer';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getStaffManagement} from './Function';

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
	    peopleData: [{
	    	"key": "1",
		    "id": "1",
		    "name": "小明",
		    "gender": "0",
		    "department": "市场部",
		    "position": "部员",
		    "title": "教授",
		    "degree": "博士研究生",
		    "graduationSchool": "南京大学",
		    "graduationMajor": "计算机软件",
		    "graduationDate": "2000-12",
		    "workingYears": 6
		  },{
		  	"key": "2",
		    "id": "2",
		    "name": "小红",
		    "gender": "1",
		    "department": "档案部",
		    "position": "主任",
		    "title": "副教授",
		    "degree": "博士研究生",
		    "graduationSchool": "浙江大学",
		    "graduationMajor": "计算机",
		    "graduationDate": "2005-12",
		    "workingYears": 3
		  },],
		fileData: [],
	    loading: false,
		visible: false,
	};

	constructor(props){
		super(props);
		this.unsubscribe = getStore().subscribe(this.refreshData);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	refreshData = () => {
		this.setState({
			peopleData:getStore().getState().StaffManagement.items
		});
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
      		temp.graduationDate=temp.graduationDate.format("YYYY-MM-DD");
      		console.log(temp);
      		//temp.gender == '男'? temp.gender=0:temp.gender=1;
  			
		    $.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/StaffManagement/addOne",
		      	data: temp,
		      	async: false,
		      	success: function (d) {
		      		message.success("新增成功");

		      	}
		    });

		    //$.post(baseAddress+"/cma/StaffManagement/addOne", temp );

      		form.resetFields();

      		this.setState({ visible: false });

      		getStaffManagement();
      		
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
	
  	getAll = () => {
  		
  		getStaffManagement();

  		$.get(baseAddress+"/cma/StaffFile/getAll" , null,(res)=>{
  			this.setState({
  				fileData: res.data
  			})
  		});
  	}

  	componentWillMount() {
  		this.getAll();
  	}
  
  	handleSubmit = (e) => {
    	e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			//TODO:ajax
      			let url = baseAddress+'/cma/StaffFile/querybyname?name=';
      			url += values.peopleName;
        		console.log('Received values of form: ', values);
      		}
    	});
  	}

  	deletePeopleManagementRecords = (e) => {
  		const {selectedRowKeys } = this.state;

  		this.setState({ loading: true });
  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = this.state.peopleData.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			let deleteId = this.state.peopleData[x].id;
  			
  			$.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/StaffManagement/deleteOne",
		      	data: {id:deleteId},
		      	async:false,
		      	success: function (d) {
		      		
		      	}
		    });
  			
  		}
  		this.setState({ 
  			loading: false,
  			selectedRowKeys:[] 
  		});	
  		getStaffManagement();
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
			  title: '操作',
			  dataIndex: 'detail',
			  key: 'detail',
			  render: (text, record) => {

			    let fileData = null;
			    for (var i = this.state.fileData.length - 1; i >= 0; i--) {
			    	if(this.state.fileData[i].id == record.id)
			    		fileData = this.state.fileData[i];
			    }
			    var props = 
			  	{
			        item: record,
			        fileData: fileData,
			    };
			  	return (
			  		<a 
			  			onClick={()=>{this.handleInspect(props)}}>
			  			查看详情
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
	      				
	      				dataSource={this.state.peopleData}>
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
