import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm,Radio, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import SampleIoList from './SampleIoList';
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

class SIIForm extends React.Component{
    constructor(props)
    {
        super(props);
		this.state = {
		    StaffData:[],
		item:null,
		/*{
		    sampleNumber:3,
		    sampleName:"www",
		    sampleAmount:4,
		    situation:"未处理",
		    sendDate:"2018-01-02",
		    obtainDate:"2018-01-04",
		    sender:"cysb",
		    receiver:"wjc",
		    obtainer:"cy",
		    note:"no趴笨",
		},*/
			visible: false,
			sampleData: null,
			dataSource: this.props.dataSource,
			vise:true,
            addVise:false,
		}
        let item:null;
		for(var i = this.props.dataSource.length-1; i >= 0; i--)
		{
			if(this.props.dataSource[i].sampleIoId == this.props.item.sampleIoId)
				item = this.props.item;
		}
		console.log(this.props.item.sampleIoId);
		this.state.item = item;

    }
    showModal = () => {
            this.setState({
            visible: true,
            });
    }
    show2Modal=()=>{
            this.setState(
            {
                addVise:true,
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
        this.props.form.resetFields();
    }
    handle2Cancel=(e)=>{
        console.log(e);
        this.setState({
        addVise: false,
        });
        this.props.form.resetFields();
    }
    handleDelete=()=>{
       $.ajax({
    	    type: "post",
    	    url: baseAddress+"/cma/SampleIo/deleteOne",
    	    data: {sampleIoId:this.props.item.sampleIoId},
    	    async:false,
    	    success: function (d) {
    	    }
    	});
    	getApplication();
    }
    handleAddText=()=>{
        const newData={
            sampleId: this.props.item.sampleId,
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
            others:this.props.form.getFieldValue('others'),
            ReadMe:this.props.form.getFieldValue('ReadMe'),
            Application:this.props.form.getFieldValue('Application'),
            MaterialReceipt:this.props.form.getFieldValue('MaterialReceipt'),
            Function:this.props.form.getFieldValue('Function'),
            Confirmations:this.props.form.getFieldValue('Confirmations'),
            Introduction:this.props.form.getFieldValue('Introduction'),
            Guarantee:this.props.form.getFieldValue('Guarantee'),
            softwareSample:this.props.form.getFieldValue('softwareSample'),
        };
        console.log(newData);
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/SampleReceipt/addOne",
		    data: newData,
		    async: false,
		    success: function (d) {
			message.success("新增成功");
	  	    }
	    });
        this.setState({
            addVise: false,
        });
        this.props.form.resetFields();
    }
    handleModify=()=>{
        const newData = {
            sampleIoId: this.props.item.sampleIoId,
            sampleName: this.props.form.getFieldValue('sampleName'),
            sampleNumber: this.props.form.getFieldValue('sampleNumber'),
            sampleAmount: this.props.form.getFieldValue('sampleAmount'),
            receiver:this.props.form.getFieldValue('receiver'),
            sender:this.props.form.getFieldValue('sender'),
            sendDate:this.props.form.getFieldValue('sendDate').format('YYYY-MM-DD'),
            obtainer:this.props.form.getFieldValue('obtainer'),
            obtainDate:this.props.form.getFieldValue('obtainDate').format('YYYY-MM-DD'),
            sampleState:this.props.form.getFieldValue('sampleState'),
            note:this.props.form.getFieldValue('note')
        };
        console.log(newData);
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/SampleIo/modifyOne",
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
        this.state.item.note=newData.note;
        this.state.item.receiver=newData.receiver;
        this.state.item.sendDate=newData.sendDate;
        this.state.item.sender=newData.sender;
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
                                接收人：
                                {this.state.item.receiver}
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
                                送样人：
                                {this.state.item.sender}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                送样日期：
                                {this.state.item.sendDate}
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
                    <Row key ='4'>
                        <FormItem>
                            备注:{this.state.item.note}
                        </FormItem>
                    </Row>
                </Card>
                <Col span={8}>
                    <Button type="primary"  onClick={this.showModal}>修改</Button>
                </Col>
                    <Modal title="修改接收记录" visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                        <Form layout="horizontal">
                            <FormItem {...formItemLayout} label= "样品编号:"  hasFeedback>
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
                            <FormItem {...formItemLayout} label= "接收人:" hasFeedback>
                                { getFieldDecorator('receiver', {rules :[{required: true, message: '请输入接收人！'}], initialValue: this.state.item.receiver,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="样品状态:" hasFeedback>
                                {getFieldDecorator('sampleState', {rules :[{required: true, message: '请选择样品状态！'}],
                                })
                                (
                                    <RadioGroup name={"样品状态:"} disabled={this.props.disable}    >
                                        <Radio value={0}/>待处理
                                        <Radio value={1}/>待测
                                        <Radio value={2}/>测毕
                                        <Radio value={3}/>已处理
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "送样人:" hasFeedback>
                                { getFieldDecorator('sender', {rules :[{required: true, message: '请输入送样人！'}], initialValue: this.state.item.receiver,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "送样时间:" hasFeedback>
                                {getFieldDecorator('sendDate', {
                                rules: [{required: true, message: '请选择送样时间!'}],
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
                            <FormItem {...formItemLayout} label= "备注:" hasFeedback>
                                { getFieldDecorator('note',{initialValue:this.state.item.note})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                        </Form>
                    </Modal>
                <Col span={8}>
                    <Button type= "primary" onClick={this.showMessage} disabled={!this.state.item.isReceipt}>查看接收单</Button>
                </Col>
                <Col span={8}>
                    <Button type= "primary" onClick={this.show2Modal} disabled={!this.state.item.isReceipt}>填写接收单</Button>
                </Col>
                    <Modal title="添加接收单" width={780} visible={this.state.addVise} onOk={this.handleAddText} onCancel={this.handle2Cancel}>
                        <Form layout="horizontal">
                            <FormItem {...formItemLayout}  label= "申报单位:" hasFeedback>
                                { getFieldDecorator('applicationUnit', {rules :[{required: true, message: '请输入申报单位！'}]})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}  label= "版本号:" hasFeedback>
                                { getFieldDecorator('version', {rules :[{required: true, message: '请输入版本号！'}]})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "合同登记编号:" hasFeedback>
                                { getFieldDecorator('contractId', {rules :[{required: true, message: '请输入合同登记编号！'}]})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "软件产品名:" hasFeedback>
                                { getFieldDecorator('sampleName2', {rules :[{required: true, message: '请输入软件产品名！'}]})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="检测类型:" hasFeedback>
                                {getFieldDecorator('testType', {rules :[{required: true, message: '请选择检测类型！'}],
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
                                {getFieldDecorator('ReadMe', {rules :[{required: true, message: '请选择用户手册类型！'}],
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
                                {getFieldDecorator('Application', {rules :[{required: true, message: '请选择申请表类型！'}],
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
                                {getFieldDecorator('MaterialReceipt', {rules :[{required: true, message: '请选择交接单类型！'}],
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
                                {getFieldDecorator('Function', {rules :[{required: true, message: '请选择功能列表类型！'}],
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
                                {getFieldDecorator('Confirmations', {rules :[{required: true, message: '请选择确认单类型！'}],
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
                                {getFieldDecorator('Introduction', {rules :[{required: true, message: '请选择产品简介类型！'}],
                                })
                                (
                                    <RadioGroup name={"《受测软件简介》:"} disabled={this.props.disable} >
                                        <Radio value={0}/>没有该材料
                                        <Radio value={1}/>电子文档
                                        <Radio value={2}/>书面文档
                                        <Radio value={3}/>书面+电子
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="《自主产权保证书》:" hasFeedback>
                                {getFieldDecorator('Guarantee', {rules :[{required: true, message: '请选择保证书类型！'}],
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
                                {getFieldDecorator('softwareSample', {rules :[{required: true, message: '请选择软件样品！'}],
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
                                { getFieldDecorator('others')
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "电子媒介:" hasFeedback>
                                { getFieldDecorator('electronicMedia', {rules :[{required: true, message: '请输入电子媒介！'}]})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout}label ="软件类型:" hasFeedback>
                                {getFieldDecorator('softwareType', {rules :[{required: true, message: '请选择软件类型！'}],
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
                                { getFieldDecorator('receiveUnit', {rules :[{required: true, message: '请输入接收单位！'}], })
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
                                { getFieldDecorator('sender2', {rules :[{required: true, message: '请输入报送人！'}],})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "受理人:" hasFeedback>
                                { getFieldDecorator('receiver2', {rules :[{required: true, message: '请输入受理人！'}], })
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                        </Form>
                    </Modal>
            </div>
        );
    }
}

const SII = Form.create()(SIIForm);

export default SII;