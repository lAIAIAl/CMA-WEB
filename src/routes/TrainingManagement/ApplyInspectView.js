import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs,Alert, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import TrainingApplication from './TrainingApplication';
import {getApplication} from './TrainingApplication';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;
const { TextArea } = Input;
const dateFormat= 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class ApplyIVForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            item:null,
            visible:false,
            ApplyData:null,
            dataSource:this.props.dataSource,
            vise:0,
        }
        let item:null;
		for(var i = this.props.dataSource.length-1; i >= 0; i--)
		{
			if(this.props.dataSource[i].id == this.props.item.id)
				item = this.props.item;
		}
		this.state.item = item;
    }
    showModal = () => {
    //    if(this.state.item.situation=="已通过")
    //    {
    //        alert("无法修改已通过的申请！");
    //    }
            this.setState({
            visible: true,
            });
    }
    handleSubmit = () => {
        this.setState({
        visible: false,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
        visible: false,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
        visible: false,
        });
    }
    handleDelete=()=>{
       $.ajax({
    	    type: "post",
    	    url: baseAddress+"/cma/TrainingApplication/deleteOne",
    	    data: {id:this.props.item.id},
    	    async:false,
    	    success: function (d) {
    	    }
    	});
    	getApplication();
    }
    handleModify=()=>{
        const newData = {
            id:this.props.item.id,
            name: this.props.form.getFieldValue('name'),
            people: this.props.form.getFieldValue('people'),
            trainingUnit: this.props.form.getFieldValue('trainingUnit'),
            expense: this.props.form.getFieldValue('expense'),
            reason: this.props.form.getFieldValue('reason'),
            department: this.props.form.getFieldValue('department'),
            createDate: this.props.form.getFieldValue('createDate').format('YYYY-MM-DD')
        };
        $.ajax({
            type:"post",
            url:baseAddress+"/cma/TrainingApplication/modifyOne",
            data: newData,
            async: false,
            success: function (d){
                message.success("修改成功");
            }
        });
        this.state.item.name=newData.name;
        this.state.item.people=newData.people;
        this.state.item.trainingUnit=newData.trainingUnit;
        this.state.item.expense=newData.expense;
        this.state.item.reason=newData.reason;
        this.state.item.department=newData.department;
        this.state.item.createDate=newData.createDate;
        this.setState({
            visible:false,
        });
        this.props.form.resetFields();
        getApplication();
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const width = '100%';
        if(this.state.item.situation==0)
            this.state.item.situation="未审查";
        else if(this.state.item.situation==1)
            this.state.item.situation="未通过";
        else if(this.state.item.situation==2)
                this.state.item.situation="已通过";
        console.log(this.state.item.situation);
        return(
            <div>
                <Card key='0' title='培训申请表' style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={8}>
                            <FormItem align="left" >
                                项目名称：
                                {this.state.item.name}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                培训单位：
                                {this.state.item.trainingUnit}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                预计培训费：
                                {this.state.item.expense}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={3} key='1'>
                        <FormItem align="left" >
                            参加人员：
                            {this.state.item.people}
                        </FormItem>
                    </Row>
                    <Row span={5} key='2'>
                        <FormItem align="left">
                            申请理由：
                            {this.state.item.reason}
                        </FormItem>
                    </Row>
                    <Row key='3'>
                        <Col span={12}>
                            <FormItem>
                                申请部门：
                                {this.state.item.department}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                申请日期：
                                {this.state.item.createDate}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='4'>
                        <Col span={12}>
                            <FormItem>
                                审准人：
                                {this.state.item.approver}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                审批日期：
                                {this.state.item.approveDate}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem>
                            审批状态：
                            {this.state.item.situation}
                        </FormItem>
                    </Row>
                </Card>
                <Col span={12}>
                    <Button className="add" type="primary" disabled={this.state.item.situation=="已通过"} onClick={this.showModal}>修改</Button>
                    </Col>
                        <Modal title="修改申请" visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                            <Form layout="horizontal">
                                <FormItem {...formItemLayout} label= "项目名称:" hasFeedback>
                                    { getFieldDecorator('name', {rules :[{required: true, message: '请输入申请项目名称！'}], initialValue: this.state.item.name,})
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "参加人员:" hasFeedback>
                                    { getFieldDecorator('people', {rules :[{required: true, message: '请输入参加人员！'}], initialValue: this.state.item.people,})
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "培训单位:" hasFeedback>
                                    { getFieldDecorator('trainingUnit', {rules :[{required: true, message: '请输入培训单位！'}],initialValue: this.state.item.trainingUnit, })
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "预计培训费:" hasFeedback>
                                    { getFieldDecorator('expense', {rules :[{required: true, message: '请输入预计培训费！'}], initialValue: this.state.item.expense,})
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "申请理由:" hasFeedback>
                                    { getFieldDecorator('reason', {rules :[{required: true, message: '请输入申请理由！'}], initialValue: this.state.item.reason,})
                                    (<TextArea autosize={{ minRows: 1, maxRows: 6 }} />) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "申请部门:" hasFeedback>
                                    { getFieldDecorator('department', {rules :[{required: true, message: '请输入申请部门！'}], initialValue: this.state.item.department,})
                                     (<Input  style = {{width:200,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "申请时间:" hasFeedback>
                                    { getFieldDecorator('createDate', {rules :[{required: true, message: '请输入申请时间！'}],})
                                     (<DatePicker  format={dateFormat} />) }
                                </FormItem>
                            </Form>
                        </Modal>
                    <Col span={12}>
                    <Popconfirm title="确定删除?" onConfirm={this.handleDelete}>
                        <Button type="danger">删除</Button>
                    </Popconfirm>
                </Col>
            </div>
        );
    }
}

const ApplyIV = Form.create()(ApplyIVForm);

export default ApplyIV;