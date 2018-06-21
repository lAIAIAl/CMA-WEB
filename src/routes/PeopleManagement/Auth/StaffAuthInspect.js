import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import AuthInspectView from './AuthInspectView';
import {getAuthorization} from './StaffAuthorizationView';

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

class SAIForm extends React.Component{
    constructor(props)
    {
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
        },
        /*{
        title: '授权内容',
        dataIndex: 'content',
        key:'content',
        },*/
        {
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
        width: '7%',
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
        width: '7%',
        key:'delete',
        render: (text, record) => {
            return (
                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
                <Button type="danger">Delete</Button>
                </Popconfirm>
            );
        },
        }];
        this.state = {
            visible: false,
            AuthData:[],
            StaffData:[],
            id:this.props.item.id,
        };
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
	    this.search();
	    getAuthorization();
    }
    componentWillMount(){
        this.search();
        this.getAllStaff();
    }
    search=()=>{
        const newData = {
              id: this.state.id,
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
        this.props.form.resetFields();
    }
    handleInspect = (props) => {
         this.props.addTab(props.item.name+"授权详情", props.item.name+"授权详情", AuthInspectView, props);
    }
    handleAdd = () => {
        const newData = {
            id: this.props.item.id,
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
        this.search();
        console.log(this.props.form.getFieldsValue());
        this.props.form.resetFields();
        getAuthorization();
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
    showModal = () => {
        this.setState({
        visible: true,
        });
    }
    handleSubmit = () => {
        this.setState({
        visible: false,
        });
        this.search();
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
        visible: false,
        });
        this.search();
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
        visible: false,
        });
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
    render(){
        const options = this.state.StaffData.map(StaffData => <Option key={StaffData.id}>{StaffData.name}</Option>);
        const{AuthData}=this.state;
        const columns= this.columns;
        const { getFieldDecorator } = this.props.form;
        return(
            <Form>
                <FormItem>
                    <Button type="primary" onClick={this.search}>刷新</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.showModal}>新增授权信息</Button>
                        <Modal title="新增授权信息" visible={this.state.visible} onOk={this.handleAdd} onCancel={this.handleCancel}>
                            <Form layout="horizontal">
                                <FormItem {...formItemLayout}label ="被授权人:" hasFeedback>
                                {this.props.item.name}
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
                </FormItem>
                <FormItem>
                    <Table  dataSource={this.state.AuthData} columns={columns} />
                </FormItem>
            </Form>
        );
    }
}

const SAI = Form.create()(SAIForm);

export default SAI;