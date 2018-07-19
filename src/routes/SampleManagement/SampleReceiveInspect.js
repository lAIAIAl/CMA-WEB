import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm,Radio, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import SampleReceiveList from './SampleReceiveList';
import SampleText from './SampleText';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getSampleReceive} from './SampleReceiveList';

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
			vise:false,
			addVise:false,
			softwareState:"0",
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
    showModal2=()=>{
        this.setState({
        addVise: true,
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
    handleCancel2=()=>{
        this.setState({
        addVise: false,
        });
    }
    setVise=()=>{
        if(this.props.item.isReceipt==true)
            this.setState({vise:true,});
        else if(this.props.item.isReceipt==false)
            this.setState({vise:false,});
    }
  	componentWillMount() {
  		this.setVise();
  	}
  	refreshVise=()=>{
        $.get(baseAddress+"/cma/SampleReceive/getOne?sampleId="+this.props.item.sampleId ,null,(res)=>{
            console.log(res.data);
            this.setState({
                vise:res.data.isReceipt,
            })
        });
        console.log(this.state.vise);
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
    	getSampleReceive();
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
        getSampleReceive();
    }
    addReceipt=()=>{
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
            sender:this.props.form.getFieldValue('sender2'),
            receiver:this.props.form.getFieldValue('receiver2'),
            other:this.props.form.getFieldValue('other'),
            readMe:this.props.form.getFieldValue('ReadMe'),
            application:this.props.form.getFieldValue('Application'),
            materialReceipt:this.props.form.getFieldValue('MaterialReceipt'),
            functions:this.props.form.getFieldValue('Function'),
            confirmations:this.props.form.getFieldValue('Confirmations'),
            introduction:this.props.form.getFieldValue('Introduction'),
            guarantee:this.props.form.getFieldValue('Guarantee'),
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
        this.refreshVise();
    }
    showMessage=()=>{
        var props={
            sampleId:this.props.item.sampleId,
        }
        console.log(props.sampleId);
        this.props.addTab(this.state.item.sampleName+"的样品接收单",this.state.item.sampleName+"的样品接收单",SampleText,props);
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const width = '100%';
        if(this.state.item.sampleState==0||this.state.item.sampleState=="待处理")
            {this.state.softwareState="待处理";this.state.item.sampleState=0}
        else if(this.state.item.sampleState==1||this.state.item.sampleState=="待测")
            {this.state.softwareState="待测";this.state.item.sampleState=1}
        else if(this.state.item.sampleState==2||this.state.item.sampleState=="测毕")
            {this.state.softwareState="测毕";this.state.item.sampleState=2}
        else if(this.state.item.sampleState==3||this.state.item.sampleState=="已处理")
            {this.state.softwareState="已处理";this.state.item.sampleState=3}
        return(
            <div>
                <Button type="primary" onClick={this.refreshVise}>刷新</Button>
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
                                {this.state.softwareState}
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
                                {getFieldDecorator('sampleState', {rules :[{required: true, message: '请选择样品状态！'}],initialValue: this.state.item.sampleState,
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
                    <Button type= "primary" onClick={this.showMessage} disabled={!this.state.vise}>查看接收单</Button>
                </Col>
                <Col span={8}>
                    <Button type= "primary" onClick={this.showModal2} disabled={this.state.vise} >添加接收单</Button>
                </Col>
                    <Modal title="添加接收单" width={780} visible={this.state.addVise} onOk={this.addReceipt} onCancel={this.handleCancel2}>
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
                                { getFieldDecorator('other')
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

const SRI = Form.create()(SRIForm);

export default SRI;