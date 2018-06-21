import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Radio,Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
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
const RadioGroup = Radio.Group;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class APPVForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            item:null,
            visible:false,
            ApplyData:null,
            dataSource:this.props.dataSource,
            endValue:null,
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
    handleApprove=()=>{
        const newData = {
            id:this.props.item.id,
            approver:this.props.form.getFieldValue('approver'),
            approveDate:this.props.form.getFieldValue('approveDate').format('YYYY-MM-DD'),
            situation:this.props.form.getFieldValue('situation')
        };
        $.ajax({
            type:"post",
            url:baseAddress+"/cma/TrainingApplication/approveOne",
            data: newData,
            async: false,
            success: function (d){
                message.success("修改成功");
            }
        });
        this.state.item.approver=newData.approver;
        this.state.item.approveDate=newData.approveDate;
        this.state.item.situation=newData.situation;
        this.setState({
            visible:false,
        });
        this.props.form.resetFields();
        getApplication();
    }
    render(){
        if(this.state.item.situation==0)
            this.state.item.situation="未审查";
        else if(this.state.item.situation==1)
            this.state.item.situation="未通过";
        else if(this.state.item.situation==2)
            this.state.item.situation="已通过";
        const { getFieldDecorator } = this.props.form;
        const width = '100%';
        const{endValue}=this.state;
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
                <Button className="add" type="primary" onClick={this.showModal}>审批</Button>
                    <Modal title="审批申请" visible={this.state.visible} onOk={this.handleApprove} onCancel={this.handleCancel}>
                        <Form layout="horizontal">
                                <FormItem {...formItemLayout} label= "审批人:" hasFeedback>
                                    { getFieldDecorator('approver', {rules :[{required: true, message: '请输入审批人！'}], })
                                     (<Input  style = {{width:100,offset:4}}/>) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "审批时间:" hasFeedback>
                                    { getFieldDecorator('approveDate', {rules :[{required: true, message: '请输入审批时间！'}], })
                                     (<DatePicker showTime  format="YYYY-MM-DD" />) }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "审批结果:" hasFeedback>
                                    {getFieldDecorator('situation', {rules :[{required: true, message: '请选择审批结果！'}], })
                                    (
                                        <RadioGroup name={"审批结果:"} disabled={this.props.disable}>
                                            <Radio value={1}/>未通过
                                            <Radio value={2}/>通过
                                        </RadioGroup>
                                    )}
                                </FormItem>
                        </Form>
                    </Modal>
            </div>
        );
    }
}

const APPV = Form.create()(APPVForm);

export default APPV;