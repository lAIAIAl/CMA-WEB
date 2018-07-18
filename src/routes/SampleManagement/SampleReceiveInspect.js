import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm,Radio, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import SampleReceiveList from './SampleReceiveList';
import SampleText from './SampleText';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const RadioGroup = Radio.Group;
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

class SRIForm extends React.Component{
    constructor(props)
    {
        super(props);
		this.state = {
		    StaffData:[],
            item:null,
			visible: false,
			sampleData: null,
			dataSource: this.props.dataSource,
		}
        let item:null;
		for(var i = this.props.dataSource.length-1; i >= 0; i--)
		{
			if(this.props.dataSource[i].sampleId == this.props.item.sampleId)
				item = this.props.item;
		}
		this.state.item = item;

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
    	    url: baseAddress+"/cma/SampleReceive/deleteOne",
    	    data: {sampleId:this.props.item.sampleId},
    	    async:false,
    	    success: function (d) {
    	    }
    	});
    	getApplication();
    }
    handleModify=()=>{
        const newData = {
            sampleId: this.props.item.sampleId,
            sampleName: this.props.form.getFieldValue('sampleName'),
            sampleNumber: this.props.form.getFieldValue('sampleNumber'),
            sampleAmount: this.props.form.getFieldValue('sampleAmount'),
            requester: this.props.form.getFieldValue('requester'),
            receiver:this.props.form.getFieldValue('receiver'),
            receiveDate:this.props.form.getFieldValue('receiveDate').format('YYYY-MM-DD'),
            obtainer:this.props.form.getFieldValue('obtainer'),
            obtainDate:this.props.form.getFieldValue('obtainDate').format('YYYY-MM-DD'),
            sampleState:this.props.form.getFieldValue('sampleState')
        };
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/SampleReceive/modifyOne",
		    data: newData,
		    async: false,
		    success: function (d) {
			message.success("修改成功");
	  	    }
	    });
        this.setState({
            visible: false,
        });
        this.state.item.sampleName=newData.sampleName;
        this.state.item.sampleNumber=newData.sampleNumber;
        this.state.item.sampleAmount=newData.sampleAmount;
        this.state.item.sampleState=newData.sampleState;
        this.state.item.requester=newData.requester;
        this.state.item.receiver=newData.receiver;
        this.state.item.receiveDate=newData.receiveDate;
        this.state.item.obtainer=newData.obtainer;
        this.state.item.obtainDate=newData.obtainDate;
        this.props.form.resetFields();
    }
    showMessage=()=>{
        var props={
            sampleId:this.props.item.sampleId,
        }
        this.props.addTab("样品接收单","样品接收单",SampleText,props);
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const width = '100%';
        if(this.state.item.sampleState==0)
            this.state.item.sampleState="待处理";
        else if(this.state.item.sampleState==1)
            this.state.item.sampleState="待测";
        else if(this.state.item.sampleState==2)
            this.state.item.sampleState="测毕";
        else if(this.state.item.sampleState==3)
            this.state.item.sampleState="已处理";
        return(
            <div>
                <Card key='0' title="样品接收登记详情" style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={8}>
                            <FormItem align="left" >
                                样品编号：
                                {this.state.item.sampleNumber}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                样品名称：
                                {this.state.item.sampleName}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                样品数量：
                                {this.state.item.sampleAmount}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='1'>
                        <Col span={12}>
                            <FormItem align="left" >
                                委托公司：
                                {this.state.item.requester}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                样品状态：
                                {this.state.item.sampleState}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='2'>
                        <Col span={12}>
                            <FormItem>
                                接收人：
                                {this.state.item.receiver}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                接收日期：
                                {this.state.item.receiveDate}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='3'>
                        <Col span={12}>
                            <FormItem>
                                领取人：
                                {this.state.item.obtainer}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                领取日期：
                                {this.state.item.obtainDate}
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
                <Col span={8}>
                    <Button type="primary"  onClick={this.showModal}>修改</Button>
                </Col>
                    <Modal title="修改接收记录" visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                        <Form layout="horizontal">
                            <FormItem {...formItemLayout} label= "样品编号:" hasFeedback>
                                { getFieldDecorator('sampleNumber', {rules :[{required: true, message: '请输入样品编号！'}], initialValue: this.state.item.sampleNumber,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "样品名称:" hasFeedback>
                                { getFieldDecorator('sampleName', {rules :[{required: true, message: '请输入样品名称！'}], initialValue: this.state.item.sampleName,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "样品数量:" hasFeedback>
                                { getFieldDecorator('sampleAmount', {rules :[{required: true, message: '请输入申请项目名称！'}], initialValue: this.state.item.sampleAmount,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "委托单位:" hasFeedback>
                                { getFieldDecorator('requester', {rules :[{required: true, message: '请输入委托单位！'}], initialValue: this.state.item.requester,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="样品状态:" hasFeedback>
                                {getFieldDecorator('sampleState', {rules :[{required: true, message: '请选择样品状态！'}],
                                })
                                (
                                    <RadioGroup name={"样品状态:"} disabled={this.props.disable} >
                                        <Radio value={0}/>待处理
                                        <Radio value={1}/>待测
                                        <Radio value={2}/>测毕
                                        <Radio value={3}/>已处理
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "接收人:" hasFeedback>
                                { getFieldDecorator('receiver', {rules :[{required: true, message: '请输入接收人！'}], initialValue: this.state.item.receiver,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "接收时间:" hasFeedback>
                                {getFieldDecorator('receiveDate', {
                                rules: [{required: true, message: '请选择接收时间!'}],
                                })(
                                <DatePicker format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label= "领取人:" hasFeedback>
                                { getFieldDecorator('obtainer', {rules :[{required: true, message: '请输入领取人！'}], initialValue: this.state.item.obtainer,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "领取时间:" hasFeedback>
                                {getFieldDecorator('obtainDate', {
                                rules: [{required: true, message: '请选择领取时间!'}],
                                })(
                                <DatePicker format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                <Col span={8}>
                    <Button type= "primary" onClick={this.showMessage} disabled={true}>查看接收单</Button>
                </Col>
                <Col span={8}>
                    <Button type= "primary" onClick={this.showMessage} disabled={true} >添加接收单</Button>
                </Col>
            </div>
        );
    }
}

const SRI = Form.create()(SRIForm);

export default SRI;