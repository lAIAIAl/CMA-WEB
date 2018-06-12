import React, { Component }from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import AuthInspectView from  './AuthInspectView';
import StaffAuthInspect from './StaffAuthInspect';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;

const dataFormat= 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class EditableTableForm extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    }, {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },{
      title: '授权内容',
      dataIndex: 'content',
      key:'content',
    },{
      title: '授权人姓名',
      dataIndex: 'authorizerName',
      key:'authorizerName',
    },{
      title: '授权时间',
      dataIndex: 'authorizerDate',
      key:'authorizerDate',
    },{
    title: '操作',
    colSpan: 2,
    dataIndex: 'check',
    width: '5%',
    key: 'check',
    render:(text,record)=>{
        let AuthData:null;
        let dataSource = this.state.AuthData;
        for(var i=this.state.AuthData.length-1;i>=0;i--)
        {
            if(record.authorizationId==this.state.AuthData[i].authorizationId)
                AuthData = this.state.AuthData[i];
        }
        var props ={
            item: record,
            AuthData: AuthData,
            dataSource: dataSource,
        }
        return(
        <div>
             <Button onClick={()=>{this.handleInspect(props)}}>查看</Button>
        </div>
        );
        },
    },{
    title: '操作',
    colSpan: 0,
    dataIndex: 'delete',
    width: '5%',
    key:'delete',
      render: (text, record) => {
        return (
            <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
               <Button>Delete</Button>
            </Popconfirm>
        );
      },/*
    title: '操作',
    colSpan: 0,
    dataIndex: 'INSPECT',
    width: '5%',
    key: 'INSPECT',
    render:(text,record)=>{
        var props ={
            item: record,
        }
        return(
        <div>
             <Button onClick={()=>{this.Inspect(props)}}>查看</Button>
        </div>
        );
        },*/
    }];
    this.state = {
        StaffData:[],
        AuthData:[],
      visible: false,
    };
      this.handleAdd=this.handleAdd.bind(this);
  }


  	getAll = () => {
  		$.get(baseAddress+"/cma/StaffAuthorization/getAll" , null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--)
  		    {
  			    test[i].key = test[i].authorizationId;
  		    }
  		    this.setState({
  		        AuthData: test })
  		});
  	}
    saveFormRef = (formRef) => {
    	this.formRef = formRef;
  	}
  	getAllStaff = () => {
  		$.get(baseAddress+"/cma/StaffManagement/getAll" , null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--)
  		    {
  			    test[i].key = test[i].authorizationId;
  		    }
  		    this.setState({
  		        StaffData: test })
  		});
  	}
    saveFormRef = (formRef) => {
    	this.formRef = formRef;
  	}
 onDelete = (key) => {
  	$.ajax({
	    type: "post",
	    url: baseAddress+"/cma/StaffAuthorization/deleteOne",
	    data: {authorizationId:key},
	    async:false,
	    success: function (d) {
	    }
	});
	 this.getAll();
  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleSubmit = () => {
    this.setState({
      visible: false,
    });
     this.getAll();
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
     this.getAll();
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  search=()=>{
    const newData = {
          id: this.props.form.getFieldValue('id')
          }
  		$.get(baseAddress+"/cma/StaffAuthorization/getAllByStaff?id="+newData.id ,null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--) {
  			    test[i].key = test[i].authorizationId;
  		    }
  		    this.setState({
  		        AuthData: test
  		    })
  		});
    console.log(this.props.form.getFieldsValue());
    this.props.form.resetFields();
  }
  handleModify = () =>{
    const newData = {
        id: this.props.form.getFieldValue('id'),
        authorizerId: this.props.form.getFieldValue('authorizerId'),
        content: this.props.form.getFieldValue('content'),
        authorizerDate: this.props.form.getFieldValue('authorizerDate').format('YYYY-MM-DD'),
        authorizationId:this.authorizationId
    };
		    $.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/StaffAuthorization/modifyOne",
		      	data: newData,
		      	async: false,
		      	success: function (d) {
		      		message.success("修改成功");
		      	}
		    });
    this.setState({
      visible: false,
    });
     this.getAll();
    console.log(this.props.form.getFieldsValue());
    this.props.form.resetFields();
  }
  handleBlur() {
        console.log('blur');
  }

  handleFocus() {
      console.log('focus');
  }
  handleChange(value) {
      console.log(`selected ${value}`);
  }
  handleAdd = () => {
    const newData = {
        id: this.props.form.getFieldValue('id'),
        authorizerId: this.props.form.getFieldValue('authorizerId'),
        content: this.props.form.getFieldValue('content'),
        authorizerDate: this.props.form.getFieldValue('authorizerDate').format('YYYY-MM-DD')
    };
		    $.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/StaffAuthorization/addOne",
		      	data: newData,
		      	async: false,
		      	success: function (d) {
		      		message.success("新增成功");
		      	}
		    });
    this.setState({
      visible: false,
    });
    this.getAll();
    console.log(this.props.form.getFieldsValue());
    this.props.form.resetFields();
  }
  handleInspect = (props) => {
    this.props.addTab("授权详情", "授权详情", AuthInspectView, props);
  }
  Inspect=(props)=>{
    this.props.addTab("记录详情","记录详情",StaffAuthInspect,props);
  }
  	componentWillMount() {
  		this.getAll();
  		this.getAllStaff();
  	}
  render() {
    const options = this.state.StaffData.map(StaffData => <Option key={StaffData.id}>{StaffData.name}</Option>);
    const { AuthData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns= this.columns;
    return (
     <Form>
     <FormItem>
      <div>
        姓名：
                    {getFieldDecorator('id',{ rules: [{required: true, message: '请选择被授权人!'}],
                    })(<Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a person"
                        optionFilterProp="resigner"
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>)}
        <Button type="primary" icon="search" onClick={this.search}>
            Search
        </Button>
      <Button onClick={this.getAll}> 刷新页面</Button>
      <Button onClick={this.getAllStaff}> 刷新下拉框人员</Button>
        <Button className="editable-add-btn" type="primary" onClick={this.showModal}>新增岗位记录</Button>
        <Modal title="新增授权信息" visible={this.state.visible} onOk={this.handleAdd} onCancel={this.handleCancel}>
        <Form layout="horizontal">
            <FormItem {...formItemLayout}label ="被授权人:" hasFeedback>

                    {getFieldDecorator('id',{ rules: [{required: true, message: '请选择被授权人!'}],
                    })(<Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a person"
                        optionFilterProp="resigner"
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>)}

            </FormItem>
            <FormItem {...formItemLayout} label= "授权人:" hasFeedback>
                    {getFieldDecorator('authorizerId',{ rules: [{required: true, message: '请选择授权人!'}],
                    })(<Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a person"
                        optionFilterProp="resigner"
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label= "授权内容:" hasFeedback>
            {
                  getFieldDecorator('content', {rules :[{required: true, message: '请输入授权内容！'}],
                  })
                  (<Input  style = {{width:100,offset:4}}/>)
            }
            </FormItem>
            <FormItem {...formItemLayout} label= "授权时间:" hasFeedback>
                        {getFieldDecorator('authorizerDate', {
                          rules: [{required: true, message: '请输入授权时间!'}],
                        })(
                          <DatePicker format="YYYY-MM-DD" />
                        )}
            </FormItem>
            </Form>
            </Modal>
      </div>
        <Table bordered dataSource={this.state.AuthData} columns={columns} />
      </FormItem>
      </Form>
    );
  }
}

class StaffAuthorizationView extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <EditableTable  addTab={this.props.addTab}/>
                </FormItem>
            </Form>
        )
    }
}

const EditableTable = Form.create()(EditableTableForm);

export default StaffAuthorizationView;