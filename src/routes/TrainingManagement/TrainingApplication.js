import React, { Component }from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import $ from 'lib/jquery-3.3.1';
import ApplyInspectView from './ApplyInspectView';
import ApplyApproveView from './ApplyApproveView';
import {baseAddress} from 'services';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;

const dateFormat= 'YYYY-MM-DD';
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
export const getApplication = () =>{
	$.get(baseAddress+"/cma/TrainingApplication/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].id;
            switch(data[i].situation){
                case 0:
                    data[i].situation = "未审批";
                break;
                case 1:
                    data[i].situation = "未通过";
                break;
                case 2:
                    data[i].situation = "已通过";
                break;
            }
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'Application'));
  	});
}

class ApplicationForm extends React.Component{
    constructor(props) {
        super(props);
        this.unsubscribe = getStore().subscribe(this.refreshData);
        this.columns=[
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
        },/*
        {
            title:'参加人员',
            dataIndex:'people',
            key:'people',
        },*/
        {
            title:'培训单位',
            dataIndex:'trainingUnit',
            key:'trainingUnit',
        },/*
        {
            title:'预计培训费',
            dataIndex:'expense',
            key:'expense',
        },*/
        {
            title:'申请部门',
            dataIndex:'department',
            key:'department',
            filters: [{
                    text: '档案室',
                    value: '档案室',
                }, {
                    text: '测试部',
                    value: '测试部',
                },{
                    text:'样品室',
                    value:'样品室',
                },{
                    text:'市场部',
                    value:'市场部',
                },{
                    text:'质量部',
                    value:'质量部',
                }
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.department.indexOf(value) === 0,
        },
        {
            title:'申请日期',
            dataIndex:'createDate',
            key:'createDate',
            defaultSortOrder: 'descend',
            sorter: (a, b) =>  (a.createDate.replace("-","")>b.createDate.replace("-",""))?1:-1,
        },
        {
            title:'状态',
            dataIndex:'situation',
            key:'situation',
            filters: [{
                    text: '未审批',
                    value: '未审批',
                }, {
                    text: '未通过',
                    value: '未通过',
                },{
                    text:'已通过',
                    value:'已通过',
                }
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.situation.indexOf(value) === 0,
        },
        {
            title:'操作',
            colSpan:3,
            dataIndex:'check',
            width: '7%',
            key:'check',
            render:(text,record)=>{
                let ApplyData:null;
                let dataSource = this.state.ApplyData;
                for(var i=this.state.ApplyData.length-1;i>=0;i--)
                {
                    if(record.id==this.state.ApplyData[i].id)
                            ApplyData = this.state.ApplyData[i];
                }
                var props ={
                    item: record,
                    ApplyData:ApplyData,
                    dataSource: dataSource,
                }
                return(
                    <div>
                        <Button onClick={()=>{this.handleInspect(props)}}>查看</Button>
                    </div>
                );
            },
        },
        {
            title: '操作',
            colSpan: 0,
            dataIndex: 'delete',
            width:'7%',
            key:'delete',
            render: (text, record) => {
               /* if(record.situation=="已通过")
                    return(
                        <h>无法删除</h>
                    );
                else    return (
                    <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
                        <Button >删除</Button>
                    </Popconfirm>
                );*/
                return(

                    <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
                        <Button disabled={record.situation=="已通过"}>删除</Button>
                    </Popconfirm>
                );
            },
        },
        {
            title: '操作',
            colSpan:0,
            dataIndex: 'approve',
            width:'7%',
            key:'approve',
            render: (text, record) => {
                    let ApplyData:null;
                    let dataSource = this.state.ApplyData;
                    for(var i=this.state.ApplyData.length-1;i>=0;i--)
                    {
                        if(record.id==this.state.ApplyData[i].id)
                            ApplyData = this.state.ApplyData[i];
                    }
                    var props ={
                        item: record,
                        ApplyData:ApplyData,
                        dataSource: dataSource,
                    }
                    return(
                        <Button disabled={record.situation=="已通过"} onClick={()=>{this.handleApprove(props)}}>审批</Button>
                    );
            },
        }
        ];
        this.state={
            ApplyData:[],
            visible:false,
        };
        this.handleAdd=this.handleAdd.bind(this);
    }
	refreshData = () => {
		this.setState({
			ApplyData: getStore().getState().Application.items
		});
	}
  	getAll = () => {
  		$.get(baseAddress+"/cma/TrainingApplication/getAll" , null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--)
  		    {
  			    test[i].key = test[i].id;
  			    if(test[i].situation==0)
  			        test[i].situation="未审批";
  			    else if(test[i].situation==1)
  			        test[i].situation="未通过";
  			    else if(test[i].situation==2)
  			        test[i].situation="已通过";
  		    }
  		    this.setState({ApplyData: test })
  		});
  	}
  	onDelete = (key) => {
       $.ajax({
    	    type: "post",
    	    url: baseAddress+"/cma/TrainingApplication/deleteOne",
    	    data: {id:key},
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
    handleAdd=()=>{
        const newData = {
            name: this.props.form.getFieldValue('name'),
            people: this.props.form.getFieldValue('people'),
            trainingUnit: this.props.form.getFieldValue('trainingUnit'),
            expense: this.props.form.getFieldValue('expense'),
            reason: this.props.form.getFieldValue('reason'),
            department: this.props.form.getFieldValue('department'),
            createDate: this.props.form.getFieldValue('createDate').format('YYYY-MM-DD')
        };
        $.ajax({
            type: "post",
            url: baseAddress+"/cma/TrainingApplication/addOne",
            data: newData,
            async: false,
            success: function (d) { message.success("新增成功"); }
        });
        this.setState({
        visible: false,
        });
        this.getAll();
        console.log(this.props.form.getFieldsValue());
        this.props.form.resetFields();
    }
    handleInspect= (props) => {
        this.props.addTab( props.item.name+"的申请详情", props.item.name+"申请详情", ApplyInspectView, props);
    }
    handleApprove= (props) => {
        this.props.addTab("申请详情", "申请详情", ApplyApproveView, props);
    }
    componentWillMount()
    {
        this.getAll();
    }
	componentWillUnmount() {
        this.unsubscribe();
	}
    render()
    {
        const { ApplyData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns= this.columns;

        return(
            <Form>
                <FormItem >
                    <Button type="primary" onClick={this.getAll}>刷新</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.showModal}>添加申请</Button>
                        <Modal title="新增申请" visible={this.state.visible} onOk={this.handleAdd} onCancel={this.handleCancel}>
                            <Form layout="horizontal">
                                <FormItem {...formItemLayout} label= "项目名称:" hasFeedback>
                                    { getFieldDecorator('name', {rules :[{required: true, message: '请输入申请项目名称！'}], })
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "参加人员:" hasFeedback>
                                    { getFieldDecorator('people', {rules :[{required: true, message: '请输入参加人员！'}], })
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "培训单位:" hasFeedback>
                                    { getFieldDecorator('trainingUnit', {rules :[{required: true, message: '请输入培训单位！'}], })
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "预计培训费:" hasFeedback>
                                    { getFieldDecorator('expense', {rules :[{required: true, message: '请输入预计培训费！'}], })
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "申请理由:" hasFeedback>
                                    { getFieldDecorator('reason', {rules :[{required: true, message: '请输入申请理由！'}], })
                                    (<TextArea autosize={{ minRows: 1, maxRows: 6 }} />) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "申请部门:" hasFeedback>
                                    { getFieldDecorator('department', {rules :[{required: true, message: '请输入申请部门！'}], })
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "申请时间:" hasFeedback>
                                    { getFieldDecorator('createDate', {rules :[{required: true, message: '请输入申请时间！'}], })
                                     (<DatePicker format="YYYY-MM-DD" />) }
                                </FormItem>
                            </Form>
                        </Modal>
                </FormItem>
                <FormItem>
                    <Table dataSource={this.state.ApplyData} columns={columns} />
                </FormItem>
            </Form>
        );
    }
}

class TrainingApplication extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <Application  addTab={this.props.addTab}/>
                </FormItem>
            </Form>
        )
    }
}
const Application = Form.create()(ApplicationForm);
export default TrainingApplication;