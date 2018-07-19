import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select,Radio, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import SampleReceiveList from './SampleReceiveList';
import SampleReceiveInspect from './SampleReceiveInspect';


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
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class SampleReceiptForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            sampleId:this.props.sampleId,
            visible:false,
            sampleId: this.props.sampleId,
            sampleReceiptText:{},

            t_testType:null,
            t_softwareType:null,
            t_readMe:null,
            t_application:null,
            t_materialReceipt:null,
            t_functions:null,
            t_confirmations:null,
            t_introduction:null,
            t_guarantee:null,
            t_softwareSample:null,
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        });
    }
    showModal=()=>{
        this.setState({
            visible:true,
        });
    }
    handleModify=()=>{
        const newData={
            sampleId: this.props.sampleId,
            applicationUnit:this.props.form.getFieldValue('applicationUnit'),
            version:this.props.form.getFieldValue('version'),
            contractId:this.props.form.getFieldValue('contractId'),
            testType:this.props.form.getFieldValue('testType'),
            electronicMedia:this.props.form.getFieldValue('electronicMedia'),
            softwareType:this.props.form.getFieldValue('softwareType'),
            receiveUnit:this.props.form.getFieldValue('receiveUnit'),
            receiveDate:this.props.form.getFieldValue('receiveDate').format('YYYY-MM-DD'),
            sender:this.props.form.getFieldValue('sender'),
            receiver:this.props.form.getFieldValue('receiver'),
            other:this.props.form.getFieldValue('other'),
            readMe:this.props.form.getFieldValue('readMe'),
            application:this.props.form.getFieldValue('application'),
            materialReceipt:this.props.form.getFieldValue('materialReceipt'),
            functions:this.props.form.getFieldValue('functions'),
            confirmations:this.props.form.getFieldValue('confirmations'),
            introduction:this.props.form.getFieldValue('introduction'),
            guarantee:this.props.form.getFieldValue('guarantee'),
            softwareSample:this.props.form.getFieldValue('softwareSample'),
        };
        console.log(newData);
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/SampleReceipt/modifyOne",
		    data: newData,
		    async: false,
		    success: function (d) {
			message.success("修改成功");
	  	    }
	    });
        this.getReceipt();
        this.setState({
            visible:false,
        });
        this.props.form.resetFields();
    }
    handleDelete=()=>{
  	    $.ajax({
	        type: "post",
	        url: baseAddress+"/cma/SampleReceipt/deleteOne",
	        data: {sampleId:this.props.sampleId},
	        async:false,
	        success: function (d) {
	        message.success("删除成功");
	        }
	    });
    }
    getReceipt=()=>{
        $.get(baseAddress+"/cma/SampleReceipt/getOne?sampleId="+this.props.sampleId ,null,(res)=>{
   		    let NiMa=res.data;
   		    console.log(NiMa);
            this.setState({
                sampleReceiptText:NiMa,
            });
        });
    }
    componentWillMount(){
        this.getReceipt();
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const width = '100%';
        if(this.state.sampleReceiptText.readMe==0)
            this.state.t_readMe="没有该材料";
        else if(this.state.sampleReceiptText.readMe==1)
            this.state.t_readMe="电子文档";
        else if(this.state.sampleReceiptText.readMe==2)
            this.state.t_readMe="书面文档";
        else if(this.state.sampleReceiptText.readMe==3)
            this.state.t_readMe="书面+电子";

        if(this.state.sampleReceiptText.application==0)
            this.state.t_application="没有该材料";
        else if(this.state.sampleReceiptText.application==1)
            this.state.t_application="电子文档";
        else if(this.state.sampleReceiptText.application==2)
            this.state.t_application="书面文档";
        else if(this.state.sampleReceiptText.application==3)
            this.state.t_application="书面+电子";

        if(this.state.sampleReceiptText.materialReceipt==0)
            this.state.t_materialReceipt="没有该材料";
        else if(this.state.sampleReceiptText.materialReceipt==1)
            this.state.t_materialReceipt="电子文档";
        else if(this.state.sampleReceiptText.materialReceipt==2)
            this.state.t_materialReceipt="书面文档";
        else if(this.state.sampleReceiptText.materialReceipt==3)
            this.state.t_materialReceipt="书面+电子";

        if(this.state.sampleReceiptText.functions==0)
            this.state.t_functions="没有该材料";
        else if(this.state.sampleReceiptText.functions==1)
            this.state.t_functions="电子文档";
        else if(this.state.sampleReceiptText.functions==2)
            this.state.t_functions="书面文档";
        else if(this.state.sampleReceiptText.functions==3)
            this.state.t_functions="书面+电子";

        if(this.state.sampleReceiptText.confirmations==0)
            this.state.t_confirmations="没有该材料";
        else if(this.state.sampleReceiptText.confirmations==1)
            this.state.t_confirmations="电子文档";
        else if(this.state.sampleReceiptText.confirmations==2)
            this.state.t_confirmations="书面文档";
        else if(this.state.sampleReceiptText.confirmations==3)
            this.state.t_confirmations="书面+电子";

        if(this.state.sampleReceiptText.introduction==0)
            this.state.t_introduction="没有该材料";
        else if(this.state.sampleReceiptText.introduction==1)
            this.state.t_introduction="电子文档";
        else if(this.state.sampleReceiptText.introduction==2)
            this.state.t_introduction="书面文档";
        else if(this.state.sampleReceiptText.introduction==3)
            this.state.t_introduction="书面+电子";

        if(this.state.sampleReceiptText.guarantee==0)
            this.state.t_guarantee="没有该材料";
        else if(this.state.sampleReceiptText.guarantee==1)
            this.state.t_guarantee="电子文档";
        else if(this.state.sampleReceiptText.guarantee==2)
            this.state.t_guarantee="书面文档";
        else if(this.state.sampleReceiptText.guarantee==3)
            this.state.t_guarantee="书面+电子";

        if(this.state.sampleReceiptText.softwareSample==0)
            this.state.t_softwareSample="没有该材料";
        else if(this.state.sampleReceiptText.softwareSample==1)
            this.state.t_softwareSample="电子文档";

        if(this.state.sampleReceiptText.testType==0)
            this.state.t_testType="登记检测";
        else if(this.state.sampleReceiptText.testType==1)
            this.state.t_testType="确认检测";
        else if(this.state.sampleReceiptText.testType==2)
            this.state.t_testType="验收检测";

        if(this.state.sampleReceiptText.softwareType==0)
            this.state.t_softwareType="系统软件";
        else if(this.state.sampleReceiptText.softwareType==1)
            this.state.t_softwareType="支持软件";
        else if(this.state.sampleReceiptText.softwareType==2)
            this.state.t_softwareType="应用软件";
        else if(this.state.sampleReceiptText.softwareType==3)
            this.state.t_softwareType="其它软件";
        return(
            <div>
                <Card key='0' title="样品接收单" style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={8}>
                            <FormItem align="left" >
                                软件名称：
                                {this.state.sampleReceiptText.sampleName}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                申报单位：
                                {this.state.sampleReceiptText.applicationUnit}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                产品版本号：
                                {this.state.sampleReceiptText.version}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='1'>
                        <Col span={8}>
                            <FormItem align="left" >
                                合同登记编号：
                                {this.state.sampleReceiptText.contractId}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                测试类型：
                                {this.state.t_testType}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                电子媒介：
                                {this.state.sampleReceiptText.electronicMedia}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='2'>
                        <Col span={8}>
                            <FormItem align="left" >
                                《用户手册》：
                                {this.state.t_readMe}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《软件登记检测申请表》：
                                {this.state.t_application}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《材料交接单》：
                                {this.state.t_materialReceipt}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='3'>
                        <Col span={8}>
                            <FormItem align="left" >
                                《软件产品功能列表》：
                                {this.state.t_functions}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《软件名称版本号确认单》：
                                {this.state.t_confirmations}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《受测软件产品简介》：
                                {this.state.t_introduction}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='4'>
                        <Col span={12}>
                            <FormItem align="left" >
                                《自主产权保证书》：
                                {this.state.t_guarantee}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                软件样品一套：
                                {this.state.t_softwareSample}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='5'>
                        <Col>
                            <FormItem align="left" >
                                其他材料：
                                {this.state.sampleReceiptText.other}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='6'>
                        <Col span={12}>
                            <FormItem align="left" >
                                软件类型：
                                {this.state.t_softwareType}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                接收单位：
                                {this.state.sampleReceiptText.receiveUnit}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='7'>
                        <Col>
                            <FormItem align="left" >
                                接收日期：
                                {this.state.sampleReceiptText.receiveDate}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='8'>
                        <Col span={12}>
                            <FormItem align="left" >
                                送样人：
                                {this.state.sampleReceiptText.sender}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                受理人：
                                {this.state.sampleReceiptText.receiver}
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
                <Col span={12}>
                    <Button type="primary"  onClick={this.showModal}>修改</Button>
                </Col>
                    <Modal title="修改接收单" width={780} visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                        <Form layout="horizontal">
                            <FormItem {...formItemLayout}  label= "申报单位:" hasFeedback>
                                { getFieldDecorator('applicationUnit', {rules :[{required: true, message: '请输入申报单位！'}],initialValue:this.state.sampleReceiptText.applicationUnit,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}  label= "版本号:" hasFeedback>
                                { getFieldDecorator('version', {rules :[{required: true, message: '请输入版本号！'}],initialValue:this.state.sampleReceiptText.version,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "合同登记编号:" hasFeedback>
                                { getFieldDecorator('contractId', {rules :[{required: true, message: '请输入合同登记编号！'}],initialValue:this.state.sampleReceiptText.contractId,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="检测类型:" hasFeedback>
                                {getFieldDecorator('testType', {rules :[{required: true, message: '请选择检测类型！'}],initialValue:this.state.sampleReceiptText.testType,
                                })
                                (
                                    <RadioGroup name={"检测类型:"} disabled={this.props.disable} >
                                        <Radio value={0}/>登记检查
                                        <Radio value={1}/>确认检测
                                        <Radio value={2}/>验收检测
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《用户手册》:" hasFeedback>
                                {getFieldDecorator('readMe', {rules :[{required: true, message: '请选择用户手册类型！'}],initialValue:this.state.sampleReceiptText.readMe,
                                })
                                (
                                    <RadioGroup name={"《用户手册》:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《登记检测申请表》:" hasFeedback>
                                {getFieldDecorator('application', {rules :[{required: true, message: '请选择申请表类型！'}],initialValue:this.state.sampleReceiptText.application,
                                })
                                (
                                    <RadioGroup name={"《登记检测申请表》:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《材料交接单》:" hasFeedback>
                                {getFieldDecorator('materialReceipt', {rules :[{required: true, message: '请选择交接单类型！'}],initialValue:this.state.sampleReceiptText.materialReceipt,
                                })
                                (
                                    <RadioGroup name={"《材料交接单》:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《软件功能列表》:" hasFeedback>
                                {getFieldDecorator('functions', {rules :[{required: true, message: '请选择功能列表类型！'}],initialValue:this.state.sampleReceiptText.functions,
                                })
                                (
                                    <RadioGroup name={"《软件功能列表》:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《名称版本确认单》:" hasFeedback>
                                {getFieldDecorator('confirmations', {rules :[{required: true, message: '请选择确认单类型！'}],initialValue:this.state.sampleReceiptText.confirmations,
                                })
                                (
                                    <RadioGroup name={"《名称版本确认单》:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《受测软件简介》:" hasFeedback>
                                {getFieldDecorator('introduction', {rules :[{required: true, message: '请选择产品简介类型！'}],initialValue:this.state.sampleReceiptText.introduction,
                                })
                                (
                                    <RadioGroup name={"《受测软件简介》:"} disabled={this.props.disable}>
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《自主产权保证书》:" hasFeedback>
                                {getFieldDecorator('guarantee', {rules :[{required: true, message: '请选择保证书类型！'}],initialValue:this.state.sampleReceiptText.guarantee,
                                })
                                (
                                    <RadioGroup name={"《自主产权保证书》:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="软件样品:" hasFeedback>
                                {getFieldDecorator('softwareSample', {rules :[{required: true, message: '请选择软件样品！'}],initialValue:this.state.sampleReceiptText.softwareSample,
                                })
                                (
                                    <RadioGroup name={"软件样品:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "其他材料:" hasFeedback>
                                { getFieldDecorator('other',{initialValue:this.state.sampleReceiptText.other,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "电子媒介:" hasFeedback>
                                { getFieldDecorator('electronicMedia', {rules :[{required: true, message: '请输入电子媒介！'}],initialValue:this.state.sampleReceiptText.electronicMedia,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="软件类型:" hasFeedback>
                                {getFieldDecorator('softwareType', {rules :[{required: true, message: '请选择软件类型！'}],initialValue:this.state.sampleReceiptText.softwareType,
                                })
                                (
                                    <RadioGroup name={"软件类型:"} disabled={this.props.disable} >
                                        <Radio value={0}/>系统软件
                                        <Radio value={1}/>支持软件
                                        <Radio value={2}/>应用软件
                                        <Radio value={3}/>其它软件
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "接收单位:" hasFeedback>
                                { getFieldDecorator('receiveUnit', {rules :[{required: true, message: '请输入接收单位！'}],initialValue:this.state.sampleReceiptText.receiveUnit, })
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "接收日期:" hasFeedback>
                                {getFieldDecorator('receiveDate', {
                                rules: [{required: true, message: '请选择接收日期!'}],
                                })(
                                <DatePicker format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label= "报送人:" hasFeedback>
                                { getFieldDecorator('sender', {rules :[{required: true, message: '请输入报送人！'}],initialValue:this.state.sampleReceiptText.sender,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "受理人:" hasFeedback>
                                { getFieldDecorator('receiver', {rules :[{required: true, message: '请输入受理人！'}],initialValue:this.state.sampleReceiptText.receiver })
                                 (<Input  style = {{width:200,offset:4}}/>) }
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
const SampleReceipt = Form.create()(SampleReceiptForm);

export default SampleReceipt;