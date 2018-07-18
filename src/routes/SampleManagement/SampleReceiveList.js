import React, { Component }from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox,Radio, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import SampleReceiveInspect from './SampleReceiveInspect';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;
const RadioGroup = Radio.Group;

const dataFormat= 'YYYY-MM-DD';
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class SampleReceiveForm extends React.Component {
    constructor(props){
        super(props);
        this.columns = [
        {
            title:'样品编号',
            dataIndex:'sampleNumber',
            key:'sampleNumber',
        },
        {
            title:'样品名称',
            dataIndex:'sampleName',
            key:'sampleName',
        },
        {
            title:'数量',
            dataIndex:'sampleAmount',
            key:'sampleAmount',
        },
        {
            title:'状态',
            dataIndex:'sampleState',
            key:'sampleState',
        },
        {
            title:'接收日期',
            dataIndex:'receiveDate',
            key:'receiveDate',
            defaultSortOrder: 'descend',
            sorter: (a, b) =>  (a.receiveDate.replace("-","")>b.receiveDate.replace("-",""))?1:-1,
        },
        {
            title:'领取日期',
            dataIndex:'obtainDate',
            key:'obtainDate',
            defaultSortOrder: 'descend',
            sorter: (a, b) =>  (a.obtainDate.replace("-","")>b.obtainDate.replace("-",""))?1:-1,
        },
        {
            title:'操作',
            colSpan: 2,
            dataIndex: 'check',
            width: '7%',
            key: 'check',
            render:(text,record)=>{
                let receiveData:null;
                let dataSource = this.state.receiveData;
                for(var i=this.state.receiveData.length-1;i>=0;i--)
                {
                    if(record.sampleId==this.state.receiveData[i].sampleId)
                        receiveData = this.state.receiveData[i];
                }
                var props ={
                    item: record,
                    receiveData:receiveData,
                    dataSource: dataSource,
                }
                return(
                <div>
                    <Button type="primary" onClick={()=>{this.handleInspect(props)}}>查看</Button>
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
            return (
                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
                    <Button type="danger">删除</Button>
                </Popconfirm>
            );
            },
        }
        ];
        this.state={
            receiveData:[],
            visible:false,
        };
    }
  	getAll = () => {
  		$.get(baseAddress+"/cma/SampleReceive/getAll" , null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--)
  		    {
  			    test[i].key = test[i].sampleId;
  			    if(test[i].sampleState==0)
  			        test[i].sampleState="待处理";
  			    else  if(test[i].sampleState==1)
  			        test[i].sampleState="待测";
  			    else if(test[i].sampleState==2)
  			        test[i].sampleState= "测毕";
  			    else if(test[i].sampleState==3)
  			        test[i].sampleState="已处理";
  		    }
  		    this.setState({
  		        receiveData: test
  		    })
  		});
  	}
    onDelete = (key) => {
  	    $.ajax({
	        type: "post",
	        url: baseAddress+"/cma/SampleReceive/deleteOne",
	        data: {sampleId:key},
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
    handleOk=()=>{
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
    handleInspect = (props) => {
        this.props.addTab("样品接收详情","样品接收详情",SampleReceiveInspect,props);
    }
    handleAdd=()=>{
        const newData = {
            sampleName: this.props.form.getFieldValue('sampleName'),
            sampleNumber: this.props.form.getFieldValue('sampleNumber'),
            sampleAmount: this.props.form.getFieldValue('sampleAmount'),
            requester: this.props.form.getFieldValue('requester'),
            receiver:this.props.form.getFieldValue('receiver'),
            receiveDate:this.props.form.getFieldValue('receiveDate').format('YYYY-MM-DD'),
            obtainer:this.props.form.getFieldValue('obtainer'),
            sampleState:this.props.form.getFieldValue('sampleState'),
            obtainDate:this.props.form.getFieldValue('obtainDate').format('YYYY-MM-DD')
        };
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/SampleReceive/addOne",
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
  	componentWillMount() {
  		this.getAll();
  	}
  	render()
  	{

        const { receiveData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns= this.columns;
        return(
            <Form>
                <FormItem>
                    <Col span={8}>
                        <Button type="primary" onClick={this.getAll}> 刷新页面</Button>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" onClick={this.showModal}>新增记录</Button>
                    </Col>
                        <Modal title="新增样品接收登记表"visible={this.state.visible} onOk={this.handleAdd} onCancel={this.handleCancel}>
                            <Form layout="horizontal">
                                <FormItem {...formItemLayout}label ="样品编号:" hasFeedback>
                                    { getFieldDecorator('sampleNumber', {rules :[{required: true, message: '请输入样品编号！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout}label ="样品名称:" hasFeedback>
                                    { getFieldDecorator('sampleName', {rules :[{required: true, message: '请输入样品名称！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout}label ="样品数量:" hasFeedback>
                                    { getFieldDecorator('sampleAmount', {rules :[{required: true, message: '请输入样品数量！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout}label ="样品状态:" hasFeedback>
                                    { getFieldDecorator('sampleState', {rules :[{required: true, message: '请选择样品状态！'}],
                                    })
                                    (
                                        <RadioGroup name={"样品状态:"} disabled={this.props.disable}>
                                            <Radio value={0}/>待处理
                                            <Radio value={1}/>待测
                                            <Radio value={2}/>测毕
                                            <Radio value={3}/>已处理
                                        </RadioGroup>
                                    )
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout}label ="委托单位:" hasFeedback>
                                    { getFieldDecorator('requester', {rules :[{required: true, message: '请输入委托单位！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout}label ="接收人:" hasFeedback>
                                    { getFieldDecorator('receiver', {rules :[{required: true, message: '请输入接收人！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "接收时间:" hasFeedback>
                                    {getFieldDecorator('receiveDate', {
                                    rules: [{required: true, message: '请选择接收时间!'}],
                                    })(
                                    <DatePicker format="YYYY-MM-DD" />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout}label ="领取人:" hasFeedback>
                                    { getFieldDecorator('obtainer', {rules :[{required: true, message: '请输入领取人！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
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
                </FormItem>
                <FormItem>
                    <Table dataSource={this.state.receiveData} columns={columns} />
                </FormItem>
            </Form>
        );
  	}
}

class SampleReceive extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <SampleReceive  addTab={this.props.addTab}/>
                </FormItem>
            </Form>
        )
    }
}

const SampleReceiveManagement = Form.create()(SampleReceiveForm);

export default SampleReceiveManagement;