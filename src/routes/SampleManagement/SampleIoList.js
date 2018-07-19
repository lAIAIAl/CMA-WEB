import React, { Component }from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox,Radio, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import SampleIoInspect from './SampleIoInspect';

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

export const getSampleIo = () =>{
	$.get(baseAddress+"/cma/SampleIo/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].id;
            switch(data[i].sampleState){
                case 0:
                    data[i].sampleState = "待处理";
                break;
                case 1:
                    data[i].sampleState = "待测";
                break;
                case 2:
                    data[i].sampleState = "测毕";
                break;
                case 3:
                    data[i].sampleState = "已处理";
                break;
            }
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'IoList'));
  	});
}

class SampleIoForm extends React.Component {
    constructor(props){
        super(props);
        this.unsubscribe = getStore().subscribe(this.refreshData);
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
            filters: [{
                    text: '待处理',
                    value: '待处理',
                }, {
                    text: '待测',
                    value: '待测',
                },{
                    text:'测毕',
                    value:'测毕',
                },{
                    text:'已处理',
                    value:'已处理',
                }
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.sampleState.indexOf(value) === 0,
        },
        {
            title:'送样日期',
            dataIndex:'sendDate',
            key:'sendDate',
            defaultSortOrder: 'descend',
            sorter: (a, b) =>  (a.sendDate.replace("-","")>b.sendDate.replace("-",""))?1:-1,
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
                let IoReceiveData:null;
                let dataSource = this.state.IoReceiveData;
                for(var i=this.state.IoReceiveData.length-1;i>=0;i--)
                {
                    if(record.sampleIoId==this.state.IoReceiveData[i].sampleIoId)
                        IoReceiveData = this.state.IoReceiveData[i];
                }
                var props ={
                    item: record,
                    IoReceiveData:IoReceiveData,
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
            IoReceiveData:[],
            allSample:[],
            visible:false,
        };
    }
    getAllSample=()=>{
  		$.get(baseAddress+"/cma/SampleReceive/getAll" , null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--)
  		    {
  			    test[i].key = test[i].sampleIoId;
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
  		        allSample: test
  		    })
  		});
    }
  	getAll = () => {
  		$.get(baseAddress+"/cma/SampleIo/getAll" , null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--)
  		    {
  			    test[i].key = test[i].sampleIoId;
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
  		        IoReceiveData: test
  		    })
  		});
  	}
	refreshData = () => {
		this.setState({
			IoReceiveData: getStore().getState().IoList.items
		});
	}
	componentWillUnmount() {
        this.unsubscribe();
	}
    onDelete = (key) => {
  	    $.ajax({
	        type: "post",
	        url: baseAddress+"/cma/SampleIo/deleteOne",
	        data: {sampleIoId:key},
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
        this.props.addTab("样品室"+props.item.sampleName+"记录详情","样品室"+props.item.sampleName+"记录详情",SampleIoInspect,props);
    }
    handleAdd=()=>{
        const sampleId=this.props.form.getFieldValue('sampleId');
        var i = this.state.allSample.length - 1;
         for (; i >= 0; i--)
            if(this.state.allSample[i].sampleId==sampleId)
                break;
        console.log(i);
        var State;
        if(this.state.allSample[i]=="待处理")
            State=0;
        else if(this.state.allSample[i]=="待测")
            State=1;
        else if(this.state.allSample[i]=="测毕")
            State=2;
        else if(this.state.allSample[i]=="已处理")
            State=3;

        const newData = {
            sampleName: this.state.allSample[i].sampleName,
            sampleNumber: this.state.allSample[i].sampleNumber,
            sampleAmount: this.state.allSample[i].sampleAmount,
            note: this.props.form.getFieldValue('note'),
            receiver:this.props.form.getFieldValue('receiver'),
            sender:this.props.form.getFieldValue('sender'),
            sendDate:this.props.form.getFieldValue('sendDate').format('YYYY-MM-DD'),
            obtainer:this.props.form.getFieldValue('obtainer'),
            obtainDate:this.props.form.getFieldValue('obtainDate').format('YYYY-MM-DD'),
            sampleState:State
        };
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/SampleIo/addOne",
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
  		this.getAllSample();
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
  	render()
  	{
        const options= this.state.allSample.map(allSample => <Option key={allSample.sampleId}>{allSample.sampleName}</Option>);
        console.log(options);
        const { IoReceiveData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns= this.columns;
        console.log(IoReceiveData);
        return(
            <Form>
                <FormItem>
                    <Col span={8}>
                        <Button type="primary" onClick={this.getAll}> 刷新页面</Button>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" onClick={this.showModal}>新增记录</Button>
                    </Col>
                        <Modal title="样品进出登记表"visible={this.state.visible} onOk={this.handleAdd} onCancel={this.handleCancel}>
                            <Form layout="horizontal">
                                <FormItem {...formItemLayout} label= "样品名称:" hasFeedback>
                                    {getFieldDecorator('sampleId',{ rules: [{required: true, message: '请选择样品!'}],
                                    })(<Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Select a sample"
                                    optionFilterProp="resigner"
                                    onChange={this.handleChange}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                    {options}
                                    </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout}label ="接收人:" hasFeedback>
                                    { getFieldDecorator('receiver', {rules :[{required: true, message: '请输入接收人！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout}label ="送样人:" hasFeedback>
                                    { getFieldDecorator('sender', {rules :[{required: true, message: '请输入送样人！'}],
                                    })
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout} label= "送样时间:" hasFeedback>
                                    {getFieldDecorator('sendDate', {
                                    rules: [{required: true, message: '请选择送样时间!'}],
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
                                <FormItem {...formItemLayout}label ="备注:" hasFeedback>
                                    { getFieldDecorator('note')
                                    (<Input  style = {{width:100,offset:4}}/>)
                                    }
                                </FormItem>
                            </Form>
                        </Modal>
                </FormItem>
                <FormItem>
                    <Table dataSource={this.state.IoReceiveData} columns={columns} />
                </FormItem>
            </Form>
        );
  	}
}

class SampleIoManagement extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <SampleIo  addTab={this.props.addTab}/>
                </FormItem>
            </Form>
        )
    }
}

const SampleIo = Form.create()(SampleIoForm);

export default SampleIoManagement;