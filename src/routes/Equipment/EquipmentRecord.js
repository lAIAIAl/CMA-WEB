import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Select, DatePicker, Button, Icon, Table, Form, Input, Modal, AutoComplete, message, Radio} from 'antd';

import $ from 'lib/jquery-3.3.1';
import EquipmentRecordInspect from './EquipmentRecordInspect'
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
	$.get("http://119.23.38.100:8080/cma/Equipment/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].id;
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'EquipmentRecord'));
  	});
}

class EquipmentRecordView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			allPlan: [],
			allList: [],
		}
	}

	handleAddTab = (props) => {
		this.props.addTab("设备信息", "设备信息", EquipmentRecordInspect, props);
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

	handleSelectChange = () =>{

	}

	addOne = () => {
		const newapp = {
			name: this.props.form.getFieldValue('name'),
			model: this.props.form.getFieldValue('model'),
			cpu: this.props.form.getFieldValue('cpu'),
			memory: this.props.form.getFieldValue('memory'),
			hardDisk: this.props.form.getFieldValue('hardDisk'),
			equipmentNumber: this.props.form.getFieldValue('equipmentNumber'),
			application: this.props.form.getFieldValue('application'),
			//state: parseInt(this.props.form.getFieldValue('state')),
			//createDate: this.props.form.getFieldValue('createDate').format('YYYY-MM-DD'),
		}

		console.log(newapp);

		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/Equipment/addOne",
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
    		url: "http://119.23.38.100:8080/cma/Equipment/deleteOne",
    		data: {id: key},
    		async: false,
    		success:function(d) {
      			message.success("删除成功");
    		}
   		});

   		this.getAll();
	}

	getAll = () => {
    	$.get("http://119.23.38.100:8080/cma/Equipment/getAll", null,(res) =>{
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

  	componentWillMount() {
  		this.getAll();
  	}
  	componentWillUnmount() {
        this.unsubscribe();
	}
	refreshData = () => {
		this.setState({
			allRecord: getStore().getState().EquipmentRecord.items
		});
	}

	render() 
	{
		const { getFieldDecorator } = this.props.form;

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '型号',
			dataIndex: 'model',
			key: 'model',
		}, {
			title: 'CPU',
			dataIndex: 'cpu',
			key: 'cpu',
		}, {
			title: '内存',
			dataIndex: 'memory',
			key: 'memory',
		}, {
			title: '硬盘',
			dataIndex: 'hardDisk',
			key: 'hardDisk',
		}, {
			title: '机身编号',
			dataIndex: 'equipmentNumber',
			key: 'equipmentNumber',
		}, {
			title: '用途',
			dataIndex: 'application',
			key: 'application',
		}, {
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			render: (text, record) => {
				return (
					<div>{record.state}</div>
				);
			}
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
						title="新增仪器设备信息"
						visible={this.state.visible}
						onOk={this.addOne}
						onCancel={this.handleCancel}
					>
						<Form layout="horizontal">
							<FormItem {...formItemLayout} label = "名称：" hasFeedback>
								{getFieldDecorator('name',{
									rules:[{required: true, message: "请输入设备名称!"}],
									initialValue: '',
									})(
										<Input style ={{width: 100,offset:4}}/>
									)}
							</FormItem>
							<FormItem {...formItemLayout} label="设备型号：" hasFeedback>
                        		{getFieldDecorator('model', {
                          			rules: [{required: true, message: '请输入设备型号!'}],
                          			initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="CPU：" hasFeedback>
                        		{getFieldDecorator('cpu', {
                          			rules: [{required: true, message: '请输入cpu!'}],
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="内存：" hasFeedback>
                        		{getFieldDecorator('memory', {
                          			rules: [{required: true, message: '请输入内存大小!'}],
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="硬盘：" hasFeedback>
                        		{getFieldDecorator('hardDisk', {
                          			rules: [{required: true, message: '请输入硬盘大小!'}],
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="机身编号：" hasFeedback>
                        		{getFieldDecorator('equipmentNumber', {
                          			rules: [{required: true, message: '请输入机身编号!'}],
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="用途：" hasFeedback>
                        		{getFieldDecorator('application', {
                          			rules: [{required: true, message: '请输入设备用途!'}],
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

const EquipmentRecord=Form.create()(EquipmentRecordView);
export default EquipmentRecord