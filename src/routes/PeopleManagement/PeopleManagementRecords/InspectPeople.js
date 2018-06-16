import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Upload, message, Select, DatePicker, InputNumber} from 'antd';

import AddStuffFile from './AddStuffFile';
import InspectStuffFile from './InspectStuffFile';
import StaffAuthInspect from 'routes/Peoplemanagement/Auth/StaffAuthInspect';
import StaffQualificationPersonalView from 'routes/Peoplemanagement/StaffQualification/StaffQualificationPersonalView'
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getStaffManagement, getStaffFile} from './Function';

const FormItem = Form.Item;
const Option = Select.Option;

//传给新页面的数据是StuffFile，保存在fileData

const InspectPeople = Form.create()(
class extends React.Component {
	state = {
		visible: false,
		item: {},
		fileData: null,
		View: null,
	};

  constructor(props){
    super(props);
    this.unsubscribe = getStore().subscribe(this.refreshData);
  }

  refreshData = () => {
      let data = getStore().getState().StaffManagement.items;
      let myitem = null;
      for (var i = data.length - 1; i >= 0; i--) {
          if(data[i].id == this.props.item.id)
              myitem = data[i];
      }

      data = getStore().getState().StaffFile.items;
      let fileview = AddStuffFile;

      for (var i = data.length - 1; i >= 0; i--) {
          if(data[i].id == this.props.item.id)
            fileview = InspectStuffFile;
      }
      this.setState({
          item : myitem,
          View : fileview,
      });

  }

  componentWillUnmount() {
    this.unsubscribe();
  }

	componentWillMount() {
		//TODO:use ajax to get proper info and save to state.item
      getStaffManagement();
      getStaffFile();
      this.refreshData();
  }

	handleCreate = () => {
    	const form = this.formRef.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}
      		//TODO:ajax modify.
      		let temp = values;
      		temp.id=this.state.item.id;
      		temp.graduationDate=temp.graduationDate.format("YYYY-MM-DD");
      		//console.log(temp);
      		this.setState({ item:temp});

    			$.ajax({
    		      	type: "post",
    		      	url: baseAddress+"/cma/StaffManagement/modifyOne",
    		      	data: temp,
                async: false,
    			      success: function(d){
    			      	message.success("修改成功");
    			      }	
    			});
      		form.resetFields();

      		this.setState({ visible: false });
          getStaffManagement();
      		//TODO:use ajax to get proper info and save to state.item
    	});
  	}

  	handleCancel = () => {
    	this.setState({ visible: false });
  	}

  	showModal = () => {
    	this.setState({ visible: true });
  	}

  	saveFormRef = (formRef) => {
    	this.formRef = formRef;
  	}

  	handleFileInfo = () => {
		
  		let props = {
  			item : this.props.item,
  		}
  		this.props.addTab("人员档案", "人员档案", this.state.View, props);
  	}

    handleInspectAuth = () => {

      let props = {
        item : this.props.item,
      }
      this.props.addTab("授权信息", "授权信息", StaffAuthInspect, props);
    }

    handleInspectQual = () => {

      let props = {
        item : this.props.item,
      }
      this.props.addTab("资质信息", "资质信息", StaffQualificationPersonalView, props);
    }

    render() {
    	let people = this.state.item;

      people.gender == 0 ? people.gender = '男':people.gender = '女';

    	const formItemLayout = 
		  {
  			labelCol: { span: 6 },
  			wrapperCol: { span: 18 },
		  };

        return (
        	<div>
            <Card title='人员基本信息'>
            	<Row key='0'>
		        	<Col span={12}>
		        		<FormItem
		        			{...formItemLayout}
		          			label="姓名"
		        		>
		        			{people.name}
		        		</FormItem>
		        	</Col>
		        	<Col span={12}>
				        <FormItem
				        	{...formItemLayout}
				          	label="性别"
				        >
				        	{people.gender}
		        		</FormItem>
		        	</Col>
		        </Row>
		        <Row key='1'>
		        	<Col span={12}>
		        		<FormItem
		        			{...formItemLayout}
		          			label="部门"
		        		>
		        			{people.department}
		        		</FormItem>
		        	</Col>
		        	<Col span={12}>
				        <FormItem
				        	{...formItemLayout}
				          	label="职位"
				        >
				        	{people.position}
		        		</FormItem>
		        	</Col>
		        </Row>
		        <Row key='2'>
		        	<Col span={12}>
		        		<FormItem
		        			{...formItemLayout}
		          			label="职称"
		        		>
		        			{people.title}
		        		</FormItem>
		        	</Col>
		        	<Col span={12}>
				        <FormItem
				        	{...formItemLayout}
				          	label="文化程度"
				        >
				        	{people.degree}
		        		</FormItem>
		        	</Col>
		        </Row>
		        <Row key='3'>
		        	<Col span={12}>
		        		<FormItem
		        			{...formItemLayout}
		          			label="毕业院校"
		        		>
		        			{people.graduationSchool}
		        		</FormItem>
		        	</Col>
		        	<Col span={12}>
				        <FormItem
				        	{...formItemLayout}
				          	label="毕业专业"
				        >
				        	{people.graduationMajor}
		        		</FormItem>
		        	</Col>
		        </Row>            	
		        <Row key='4'>
		        	<Col span={12}>
		        		<FormItem
		        			{...formItemLayout}
		          			label="毕业时间"
		        		>
		        			{people.graduationDate}
		        		</FormItem>
		        	</Col>
		        	<Col span={12}>
				        <FormItem
				        	{...formItemLayout}
				          	label="从事年限"
				        >
				        	{people.workingYears}年
		        		</FormItem>
		        	</Col>
		        </Row>

            </Card>
            <Card title='查看其他信息'>
	            <Row key='5'>
			        <Col span={12}>
			        	<FormItem
			        		{...formItemLayout}
			        	>
			        		<a onClick={this.handleFileInfo}>档案信息</a>
			        	</FormItem>
			        </Col>
			        <Col span={12}>
					    <FormItem
					    {...formItemLayout}
					    >
            				<a>已参加培训</a>
			        	</FormItem>
			        </Col>
			    </Row>            	
			    <Row key='6'>
			       	<Col span={12}>
			        	<FormItem
			        		{...formItemLayout}
			        	>
            				<a onClick={this.handleInspectQual}>岗位资质信息</a>
			        	</FormItem>
			        </Col>
			        <Col span={12}>
					    <FormItem
					        {...formItemLayout}
					    >
            				<a onClick={this.handleInspectAuth}>授权信息</a>
			        	</FormItem>
			        </Col>
			    </Row>
            	
            </Card>
            <Button
            	style={{margin:'20px 0px'}}
	      		size="large"
	      		type="primary" 
	      		onClick={this.showModal} 
	      		>
	      		修改
	      	</Button>
	      	<ModifyPeopleForm
			    wrappedComponentRef={this.saveFormRef}
			    visible={this.state.visible}
			    defaultVal={this.state.item}
			    onCancel={this.handleCancel}
			    onCreate={this.handleCreate}
			/>
	      	
		    </div>
      	);
    }
}
);

export default InspectPeople;

const ModifyPeopleForm = Form.create()(
class extends React.Component {
    render() {
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;
        const defaultVal = this.props.defaultVal;
        return (
          <Modal
            visible={visible}
            title="修改人员管理记录"
            okText="确定"
            onCancel={onCancel}
            onOk={onCreate}
          >
              <Form layout="vertical">
                  <FormItem label="姓名">
                      {getFieldDecorator('name', {
                      	  initialValue: defaultVal.name,
                          rules: [{ required: true, message: '请输入姓名！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="性别">
                      {getFieldDecorator('gender', {
                          rules: [{ required: true, message: '请选择性别！' }],
                      })(
                          <Select style={{ width: 120 }}>
                              <Option value = '0'>男</Option>
                              <Option value = '1'>女</Option>
                          </Select>
                      )}
                  </FormItem>
                  <FormItem label="职位">
                      {getFieldDecorator('position', {
                      	  initialValue: defaultVal.position,
                          rules: [{ required: true, message: '请输入职位！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="职称">
                      {getFieldDecorator('title', {
                          initialValue: defaultVal.title,
                          rules: [{ required: true, message: '请选择职称！' }],
                      })(
                          <Select style={{ width: 120 }}>
                              <Option value = '教授'>教授</Option>
                              <Option value = '副教授'>副教授</Option>
                              <Option value = '助理研究员'>助理研究员</Option>
                              <Option value = '工程师'>工程师</Option>
                              <Option value = '其他'>其他</Option>
                          </Select>
                      )}
                  </FormItem>
                  <FormItem label="文化程度">
                      {getFieldDecorator('degree', {
                      	  initialValue: defaultVal.degree,
                          rules: [{ required: true, message: '请输入文化程度！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="毕业院校">
                      {getFieldDecorator('graduationSchool', {
                      	  initialValue: defaultVal.graduationSchool,
                          rules: [{ required: true, message: '请输入毕业院校！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="毕业专业">
                      {getFieldDecorator('graduationMajor', {
                      	  initialValue: defaultVal.graduationMajor,
                          rules: [{ required: true, message: '请输入毕业专业！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="毕业时间">
                      {getFieldDecorator('graduationDate', {
                          rules: [{ required: true, message: '请输入毕业时间！' }],
                      })(
                          <DatePicker />
                      )}
                  </FormItem>
                  <FormItem label="工作年限">
                      {getFieldDecorator('workingYears', {
                          initialValue: defaultVal.workingYears,
                          rules: [{ required: true, message: '请输入工作年限！' }],
                      })(
                          <InputNumber min={0} max={100}/>
                      )}
                  </FormItem>
                  
              </Form>
          </Modal>
      );
    }
  }
);