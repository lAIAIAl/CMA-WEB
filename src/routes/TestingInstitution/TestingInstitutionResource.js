import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select,Radio, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

const RadioGroup = Radio.Group;
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
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class TestingInformationResourceForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            visible:false,
            resource:{},
        }
    }
    handleCancel=()=>{
        this.setState({
        visible:false,
        });
        this.props.form.resetFields();
    }
    showModal=()=>{
        this.setState({
            visible:true,
        });
    }
    componentWillMount(){
        this.getResource();
    }
    getResource=()=>{
        $.get(baseAddress+"/cma/TestingInstitutionResource/get" ,null,(res)=>{
            this.setState({
                resource:res.data,
            });
        })
    }
    handleModify=()=>{
        const newData={
            totalNumber:this.props.form.getFieldValue('totalNumber'),
            seniorProfessionalTitle:this.props.form.getFieldValue('seniorProfessionalTitle'),
            intermediateProfessionalTitle:this.props.form.getFieldValue('intermediateProfessionalTitle'),
            primaryProfessionalTitle:this.props.form.getFieldValue('primaryProfessionalTitle'),
            fixedAssets:this.props.form.getFieldValue('fixedAssets'),
            equipmentNumber:this.props.form.getFieldValue('equipmentNumber'),
            floorSpace:this.props.form.getFieldValue('floorSpace'),
            stableArea:this.props.form.getFieldValue('stableArea'),
            outdoorsArea:this.props.form.getFieldValue('outdoorsArea'),
            nameAndAddress:this.props.form.getFieldValue('nameAndAddress'),
            newPlace:this.props.form.getFieldValue('newPlace'),
        }
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/TestingInstitutionResource/modify",
		    data: newData,
		    async: false,
		    success: function (d) {
			message.success("修改成功");
	  	    }
	    });
        this.props.form.resetFields();
        this.getResource();
        this.setState({
            visible:false,
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Card key='0' title="检测机构资源" style={{marginBottom: 20}}>
                    <Row key='0'>
                        <FormItem align="left" >
                            检验检测机构总人数：
                            {this.state.resource.totalNumber}
                        </FormItem>
                    </Row>
                    <Row key='1'>
                        <Col span={8}>
                            <FormItem align="left" >
                                高级专业技术职称人数：
                                {this.state.resource.seniorProfessionalTitle}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                中级专业技术职称人数：
                                {this.state.resource.intermediateProfessionalTitle}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                初级专业技术职称人数：
                                {this.state.resource.primaryProfessionalTitle}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='2'>
                        <FormItem align="left" >
                            固定资产原值：
                            {this.state.resource.fixedAssets}
                        </FormItem>
                    </Row>
                    <Row key='3'>
                        <FormItem align="left" >
                            仪器设备台数：
                            {this.state.resource.equipmentNumber}
                        </FormItem>
                    </Row>
                    <Row key='4'>
                        <Col span={8}>
                            <FormItem align="left" >
                                场地面积：
                                {this.state.resource.floorSpace}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                稳恒面积：
                                {this.state.resource.stableArea}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                户外面积：
                                {this.state.resource.outdoorsArea}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='5'>
                        <FormItem align="left" >
                            场所名称和地址：
                            {this.state.resource.nameAndAddress}
                        </FormItem>
                    </Row>
                    <Row key='6'>
                        <FormItem align="left" >
                            新申请的地点：
                            {this.state.resource.newPlace}
                        </FormItem>
                    </Row>
                </Card>
                <Button type="primary" onClick={this.showModal} > 修改 </Button>
                    <Modal title="修改资源信息" visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                        <Form>
                            <FormItem {...formItemLayout} label= "总人数:" hasFeedback>
                                { getFieldDecorator('totalNumber', {rules :[{required: true, message: '请输入总人数！'}],initialValue:this.state.resource.totalNumber,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "高级专业技术职称人数:" hasFeedback>
                                { getFieldDecorator('seniorProfessionalTitle', {rules :[{required: true, message: '请输入高级专业技术职称人数！'}],initialValue:this.state.resource.seniorProfessionalTitle,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "中级专业技术职称人数:" hasFeedback>
                                { getFieldDecorator('intermediateProfessionalTitle', {rules :[{required: true, message: '请输入中级专业技术职称人数！'}],initialValue:this.state.resource.intermediateProfessionalTitle,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "初级专业技术职称人数:" hasFeedback>
                                { getFieldDecorator('primaryProfessionalTitle', {rules :[{required: true, message: '请输入初级专业技术职称人数！'}],initialValue:this.state.resource.primaryProfessionalTitle,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "固定资产原值:" hasFeedback>
                                { getFieldDecorator('fixedAssets', {rules :[{required: true, message: '请输入固定资产原值！'}],initialValue:this.state.resource.fixedAssets,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "仪器设备台数:" hasFeedback>
                                { getFieldDecorator('equipmentNumber', {rules :[{required: true, message: '请输入仪器设备台数！'}],initialValue:this.state.resource.equipmentNumber,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "场地面积:" hasFeedback>
                                { getFieldDecorator('floorSpace', {rules :[{required: true, message: '请输入场地面积！'}],initialValue:this.state.resource.floorSpace,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "稳恒面积:" hasFeedback>
                                { getFieldDecorator('stableArea', {rules :[{required: true, message: '请输入稳恒面积！'}],initialValue:this.state.resource.stableArea,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "户外面积:" hasFeedback>
                                { getFieldDecorator('outdoorsArea', {rules :[{required: true, message: '请输入户外面积！'}],initialValue:this.state.resource.outdoorsArea,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "场所名称和地址:" hasFeedback>
                                { getFieldDecorator('nameAndAddress', {rules :[{required: true, message: '请输入场所名称和地址！'}],initialValue:this.state.resource.nameAndAddress,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "新申请的地点:" hasFeedback>
                                { getFieldDecorator('newPlace', {rules :[{required: true, message: '请输入新申请的地点！'}],initialValue:this.state.resource.newPlace,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                        </Form>
                    </Modal>
            </div>
        );
    }
}

const TestingInformationResource =Form.create()(TestingInformationResourceForm );

export default TestingInformationResource;