import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Button, Icon, DatePicker, Table, Form, Input, Modal, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';

import AnnualTrainingPlanInspect from './AnnualTrainingPlanInspect'

const FormItem=Form.Item;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};



class AnnualTrainingPlanView extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			allPlan: [],
			visible: false,
			isApproved: false,
			approvevisible: false,
			addVisible: false,
		}
	}

	handleAddTab = (props) =>{
		var title = props.item.record.trainProject+"培训详情";
		this.props.addTab(title,title,AnnualTrainingPlanInspect,props);
	}

	showApprove = () => {
		this.setState({
			approvevisible: true,
		})
	}
	onApproveOk = () => {
		this.setState({
			approvevisible: false,
		})
	}

	showAdd = () => {
		this.setState({
			addVisible: true,
		})
	}
	onAddOk = () => {
		this.setState({
			addVisible: false,
		})
	}

	addOne = () => {
		const time = parseInt(this.props.form.getFieldValue('trainingTime'));
		const newapp = {
			year: this.props.item.year,
			trainProject: this.props.form.getFieldValue('trainProject'),
			people: this.props.form.getFieldValue('people'),
			method: this.props.form.getFieldValue('method'),
			trainingTime: time,//this.props.form.getFieldValue('trainingTime'),
			startTime: this.props.form.getFieldValue('startTime').format('YYYY-MM-DD'),
			endTime: this.props.form.getFieldValue('endTime').format('YYYY-MM-DD'),
			note: this.props.form.getFieldValue('note') || '',
		}
		//console.log(newapp);

		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/AnnualTrainingPlan/addOne",
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
			addVisible: false
		})

		this.props.form.resetFields();
	}

	approveOne = () => {
		const newapp = {
			year: this.props.item.year,
			approver: this.props.form.getFieldValue('approver'),
			approveDate: this.props.form.getFieldValue('approveDate').format('YYYY-MM-DD'),
		}
		//console.log(newapp);
		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/AnnualTrainingPlan/approveAnnualPlan",
			data: newapp,
			async: false,
			success: () => {
				message.success("批准成功啦");
			},
			error: () => {
				message.error("批准失败哦");
			}
		});

		this.setState({
			approvevisible: false,
		})
		this.props.form.resetFields();
	}

	deleteOne = (key) =>{
		//console.log(key);
		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/AnnualTrainingPlan/deleteOne",
			data: {
				planId: key
			},
			async: false,
			success: () => {
				message.success("删除成功啦");
			},
			error: () => {
				message.error("删除失败哦");
			}
		});
	}

	getAll = () => {
		$.get("http://119.23.38.100:8080/cma/AnnualTrainingPlan/getAll?year="+this.props.item.year, null,(res) =>{
      		let temp = res.data;
      		for(var i = temp.length-1; i >= 0; i--) {
        		temp[i].key = temp[i].planId;
      		}
      		this.setState({
        		allPlan: temp
      		})
    	})

    	$.get("http://119.23.38.100:8080/cma/AnnualTrainingPlan/getAnnualPlan?year="+this.props.item.year, null,(res) =>{
      		if(res.data.approver != null)
    		{
    			this.setState({
    				isApproved: true
    			})
    		}
    	})

    	
	}

	componentWillMount() {
		this.getAll();
	}

	render()
	{
		const {getFieldDecorator} = this.props.form;
		const columns = [{
			title: '培训项目',
			dataIndex: 'trainProject',
			key: 'trainProject',
		}, {
			title: '培训对象',
			dataIndex: 'people',
			key: 'people',
		}, {
			title: '培训方式',
			dataIndex: 'method',
			key: 'method',
		}, {
			title: '培训课时',
			dataIndex: 'trainingTime',
			key: 'trainingTime',
		}, {
			title: '培训开始时间',
			dataIndex: 'startTime',
			key: 'startTime',
		}, {
			title: '培训结束时间',
			dataIndex: 'endTime',
			key: 'endTime',
		}, {
			title: '操作',
			colSpan: 2,
			width: '10%',
			key: 'inspect',
			render: (text, record) => {
				var props = {
					item: {
						record,
						isApproved: this.state.isApproved,
					}
				}
				return(
					<div>
						<Button onClick={() => this.handleAddTab(props)}>查看</Button>
					</div>
				);
			}
		}, {
			title: '操作',
			colSpan: 0,
			width: '10%',
			key: 'delete',
			render: (text, record) => {
				return(
					<div>
						<Popconfirm title="Sure to delete?" onConfirm={() => this.deleteOne(record.key)}>
							<Button disabled={this.state.isApproved}>删除</Button>
						</Popconfirm>
					</div>
				);
			}
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
							disabled={this.state.isApproved}
							onClick={this.showAdd}>
							新增
						</Button>
						<Modal
							title="新增年度培训计划"
							visible={this.state.addVisible}
							onOk={this.addOne}
							onCancel={this.onAddOk}>
							<Form>
								<FormItem {...formItemLayout} label="培训项目：" hasFeedback>
                        			{getFieldDecorator('trainProject', {
                          				rules: [{required: true, message: 'Please input the trainProject!'}],
                          				initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        			)}
                      			</FormItem>
                      			<FormItem {...formItemLayout} label="培训对象：" hasFeedback>
                        			{getFieldDecorator('people', {
                          				rules: [{required: true, message: 'Please input the people!'}],
                          				initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        			)}
                      			</FormItem>
                      			<FormItem {...formItemLayout} label="培训方式：" hasFeedback>
                        			{getFieldDecorator('method', {
                          				rules: [{required: true, message: 'Please input the method!'}],
                          				initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        			)}
                      			</FormItem>
                      			<FormItem {...formItemLayout} label="培训课时：" hasFeedback>
                        			{getFieldDecorator('trainingTime', {
                          				rules: [{required: true, message: 'Please input the trainingTime!'}],
                          				initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        			)}
                      			</FormItem>
                      			<FormItem {...formItemLayout} label="培训开始日期：" hasFeedback>
                        			{getFieldDecorator('startTime', {
                          				rules: [{required: true, message: 'Please input the startTime!'}],
                        			})(
                        				<DatePicker />
                        			)}
                      			</FormItem>
                      			<FormItem {...formItemLayout} label="培训结束日期：" hasFeedback>
                        			{getFieldDecorator('endTime', {
                          				rules: [{required: true, message: 'Please input the endTime!'}],
                        			})(
                        				<DatePicker />
                        			)}
                      			</FormItem>
                      			<FormItem {...formItemLayout} label="备注：" hasFeedback>
                        			{getFieldDecorator('note', {
                          				rules: [{required: true, message: 'Please input the note!'}],
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
					<Table columns={columns} dataSource={this.state.allPlan} rowKey="key"/>
				</FormItem>
				<FormItem>
					<Col span={4}>
						<Button
							type="primary"
							disabled={this.state.isApproved}
							onClick={this.showApprove}>
							批准
						</Button>
						<Modal
							title="批准年度培训计划"
							visible={this.state.approvevisible}
							onOk={this.approveOne}
							onCancel={this.onApproveOk}>
							<Form>
								<FormItem {...formItemLayout} label="批准人：" hasFeedback>
                        			{getFieldDecorator('approver', {
                          				rules: [{required: true, message: 'Please input the approver!'}],
                          				initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        			)}
                      			</FormItem>
                      			<FormItem {...formItemLayout} label="批准日期：" hasFeedback>
                        			{getFieldDecorator('approveDate', {
                          				rules: [{required: true, message: 'Please input the approver!'}],
                        			})(
                        				<DatePicker />
                        			)}
                      			</FormItem>
							</Form>
						</Modal>
					</Col>
				</FormItem>
			</Form>
		);
	}
}

const AnnualTrainingPlan = Form.create()(AnnualTrainingPlanView);
export default AnnualTrainingPlan