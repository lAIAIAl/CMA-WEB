import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Select, DatePicker, Button, Icon, Table, Form, Input, Modal, AutoComplete, message, Radio, Checkbox} from 'antd';

import $ from 'lib/jquery-3.3.1';
import EquipmentApplicationRecordInspect from './EquipmentApplicationRecordInspect'
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

const FormItem=Form.Item;
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
//style
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

export const getAllRecord = () =>{
	$.get("http://119.23.38.100:8080/cma/EquipmentApplication/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].id;
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'EquipmentApplicationRecord'));
  	});
}

class EquipmentApplicationRecordView extends React.Component {
	constructor(props) {
		super(props);
		this.unsubscribe = getStore().subscribe(this.refreshData);
		this.state = {
			visible: false,
			allPlan: [],
			allEquip: [],
			selectvalue: 0,
		}
	}

	handleAddTab = (props) => {
		this.props.addTab("设备信息", "设备信息", EquipmentApplicationRecordInspect, props);
	}

	showModal = () => {
		this.setState({
			visible: true,
		})
	}

	handleOk = () => {
		this.setState({
			visible: false,
		})
	}

	handleCancel = () => {
		this.setState({
			visible: false,
		})
	}

	handleSelectChange = () => {

	}

	handleSelect = (checkedValues) =>{
		//console.log('checked',checkedValues);
		var value = 0;
		for(var i = checkedValues.length-1; i >= 0; i--)
			value = checkedValues[i]+value;
		this.setState({
			selectvalue: value,
		})
	}

	addOne = () => {
		const newapp = {
			applicant: this.props.form.getFieldValue('applicant'),
			applicationDate: this.props.form.getFieldValue('applicationDate').format('YYYY-MM-DD'),
			applicationPurpose: this.props.form.getFieldValue('applicationPurpose'),
			equipmentUse: this.state.selectvalue,
			equipmentNumber: this.props.form.getFieldValue('equipmentNumber'),
			softwareInfo: this.props.form.getFieldValue('softwareInfo'),
			auditor: this.props.form.getFieldValue('auditor'),
			auditDate: this.props.form.getFieldValue('auditDate').format('YYYY-MM-DD'),
			auditOpinion: this.props.form.getFieldValue('auditOpinion'),
		}

		console.log(newapp);

		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/EquipmentApplication/addOne",
			data: newapp,
			async: false,
			success: () => {
				message.success("新增成功啦");
			},
			error: () => {
				message.error("新增失败哦");
			}
		});

		this.setState({
			visible: false
		})

		this.getAll();

		this.props.form.resetFields();
	}

	onDelete = (key) => {
		$.ajax({
    		type: "post",
    		url: "http://119.23.38.100:8080/cma/EquipmentApplication/deleteOne",
    		data: {id: key},
    		async: false,
    		success:function(d) {
      			message.success("删除成功");
    		}
   		});

   		this.getAll();
	}

	getAll = () => {
    	$.get("http://119.23.38.100:8080/cma/EquipmentApplication/getAll", null,(res) =>{
      		let temp = res.data;
      		for(var i = temp.length-1; i >= 0; i--) {
        		temp[i].key = temp[i].id;
        		if(temp[i].state == 0)
        			temp[i].state = "停用";
        		else
        			temp[i].state = "准用";
      		}
      		this.setState({
        		allPlan: temp
      		})
    	})
  	}

  	getAllEquip = () => {
    	$.get("http://119.23.38.100:8080/cma/Equipment/getAll", null,(res) =>{
      		let temp = res.data;
      		this.setState({
        		allEquip: temp
     		})
    	})
  	}

  	componentWillMount() {
  		this.getAllEquip();
  		this.getAll();
  	}
  	
  	componentWillUnmount() {
        this.unsubscribe();
	}
	
	refreshData = () => {
		this.setState({
			allRecord: getStore().getState().EquipmentApplicationRecord.items
		});
	}

	render() 
	{
		const { getFieldDecorator } = this.props.form;
		const options = this.state.allEquip.map(d => <Option key={d.equipmentNumber}>{d.equipmentNumber}</Option>);

		const columns = [{
			title: '申请人',
			dataIndex: 'applicant',
			key: 'applicant',
		}, {
			title: '申请日期',
			dataIndex: 'applicationDate',
			key: 'applicationDate',
		}, {
			title: '申请用途',
			dataIndex: 'applicationPurpose',
			key: 'applicationPurpose',
		}, {
			title: '设备编号',
			dataIndex: 'equipmentNumber',
			key: 'equipmentNumber',
		}, {
			title: '审核人',
			dataIndex: 'auditor',
			key: 'auditor',
		}, {
			title: '审核时间',
			dataIndex: 'auditDate',
			key: 'auditDate',
		}, {
			title: '审核意见',
			dataIndex: 'auditOpinion',
			key: 'auditOpinion',
		}, {
			title: '操作',
			dataIndex: 'action',
			colSpan: 2,
			key: 'inspect',
			render: (text, record) => {
				var props = 
				{
					item: record
				}
				return (
					<div>
						<Button type="primary" onClick={() => this.handleAddTab(props)}>查看</Button> 
					</div>
				);
			}
		}, {
			title: '操作',
			dataIndex: 'action',
			colSpan: 0,
			key: 'delete',
			render: (text, record) => {
				return (
					<div>
						<Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              				<Button type="danger">删除</Button>
            			</Popconfirm>
					</div>
				);
		    },
		}]
		return (
			<Form>
				
				<FormItem>
				<Col span={4}>
					<Button
						type="primary"
						icon="sync"
						onClick={this.getAll}>
						刷新
					</Button>
				</Col>
				<Col span={4}>
					<Button
						type="primary"
						onClick={this.showModal}>
						新增
					</Button>
					<Modal
						title="新增仪器设备使用申请信息"
						visible={this.state.visible}
						onOk={this.addOne}
						onCancel={this.handleCancel}
						>
						<Form layout="horizontal">
							<FormItem {...formItemLayout} label = "申请人：" hasFeedback>
								{getFieldDecorator('applicant',{
									rules:[{required: true, message: "请输入申请人!"}],
									initialValue: '',
									})(
										<Input style ={{width: 100,offset:4}}/>
									)}
							</FormItem>
							<FormItem {...formItemLayout} label="申请日期：" hasFeedback>
                        		{getFieldDecorator('applicationDate', {
                          			rules: [{required: true, message: '请选择申请日期!'}],
                        			})(
                        				<DatePicker />
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="申请用途：" hasFeedback>
                        		{getFieldDecorator('applicationPurpose', {
                          			rules: [{required: true, message: '请输入申请用途!'}],
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="设备类型：" hasFeedback>
                        		{getFieldDecorator('equipmentUse', {
                          			rules: [],
                        			})(
                        				<Checkbox.Group onChange={this.handleSelect}>
                        					<Row>
                        						<Checkbox value={1}>1（服务器）</Checkbox>
                        						<Checkbox value={2}>2（测试机）</Checkbox>
                        					</Row>
                        				</Checkbox.Group>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="设备编号：" hasFeedback>
                        		{getFieldDecorator('equipmentNumber', {
                          			rules: [{required: true, message: '请选择设备编号!'}],
                        			})(
                        				<Select
                        					showSearch
                        					style={{ width: 150 }}
                        					placeholder="请选择一个设备"
                        					optionFilterProp="resigner"
                        					onChange={this.handleSelectChange}
                        					filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    					>
                        					{options}
                    					</Select>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="申请软件信息：" hasFeedback>
                        		{getFieldDecorator('softwareInfo', {
                          			rules: [{required: true, message: '请输入申请软件信息!'}],
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="审核人：" hasFeedback>
                        		{getFieldDecorator('auditor', {
                          			rules: [{required: true, message: '请输入审核人!'}],
                          			initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="审核时间：" hasFeedback>
                        		{getFieldDecorator('auditDate', {
                          			rules: [{required: true, message: '请选择审核时间!'}],
                        			})(
                        				<DatePicker />
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="审核意见：" hasFeedback>
                        		{getFieldDecorator('auditOpinion', {
                          			rules: [{required: true, message: '请输入审核意见!'}],
                          			initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
						</Form>
					</Modal>
				</Col>
				</FormItem>
				
				<FormItem>
					<Table columns={columns} dataSource={this.state.allPlan} rowKey="id"/>
				</FormItem>
			</Form>
		);
	}
}

const EquipmentApplicationRecord=Form.create()(EquipmentApplicationRecordView);
export default EquipmentApplicationRecord