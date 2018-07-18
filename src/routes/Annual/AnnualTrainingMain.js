import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Select, DatePicker, Button, Icon, Table, Form, Input, Modal, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';
import AnnualTrainingPlan from './AnnualTrainingPlan'


const FormItem=Form.Item;
const { Option, OptGroup } = Select;
//style
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class AnnualTrainingView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			allPlan: [],
		}
	}

	handleAddTab = (props) => {
		var title = props.item.year+'年度计划';
		this.props.addTab(title, title, AnnualTrainingPlan, props);
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
			year: this.props.form.getFieldValue('year'),
			author: this.props.form.getFieldValue('author'),
			createDate: this.props.form.getFieldValue('createDate').format('YYYY-MM-DD'),
		}
		//console.log(newapp);

		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/AnnualTrainingPlan/addAnnualPlan",
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

	getAll = () => {
    	$.get("http://119.23.38.100:8080/cma/AnnualTrainingPlan/getAllAnnualPlan", null,(res) =>{
      		let temp = res.data;
      		for(var i = temp.length-1; i >= 0; i--) {
        		temp[i].key = temp[i].year;
      		}
      		this.setState({
        		allPlan: temp
      		})
    	})
  	}

  	componentWillMount() {
  		this.getAll();
  	}

	render() 
	{
		const { getFieldDecorator } = this.props.form;
		var year = [];
		for(var i = 2020; i >= 2006; i--)
			year.push({key: i,value: i});
		const options = year.map(d => <Option key={d.key}>{d.value}</Option>);

		const columns = [{
			title: '年份',
			dataIndex: 'year',
			key: 'year',
		}, {
			title: '编制人',
			dataIndex: 'author',
			key: 'author',
		}, {
			title: '编制日期',
			dataIndex: 'createDate',
			key: 'createDate',
		},{
			title: '批准人',
			dataIndex: 'approver',
			key: 'approver',
		}, {
			title: '批准日期',
			dataIndex: 'approveDate',
			key: 'approveDate',
		},{
			title: '操作',
			dataIndex: 'action',
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
						title="新增年度培训计划"
						visible={this.state.visible}
						onOk={this.addOne}
						onCancel={this.handleCancel}
					>
						<Form layout="horizontal">
							<FormItem {...formItemLayout} label = "年份：">
								{getFieldDecorator('year',{
									rules:[{required: true, message: "Please choose the year!"}],
									})(<Select
                        				showSearch
                        				style={{ width: 100 }}
                        				placeholder="请选择年份"
                        				optionFilterProp="year"
                        				onChange={this.handleSelectChange}
                        				filterOption={(input, option) => option.props.year.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    					>
                    					{options}
                   						</Select>
									)}
							</FormItem>
							<FormItem {...formItemLayout} label="编写人：" hasFeedback>
                        		{getFieldDecorator('author', {
                          			rules: [{required: true, message: 'Please input the author!'}],
                          			initialValue: '',
                        			})(
                        				<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="编写日期：" hasFeedback>
                        		{getFieldDecorator('createDate', {
                          			rules: [{required: true, message: 'Please input the createDate!'}],
                        			})(
                        				<DatePicker />
                        		)}
                      		</FormItem>
						</Form>
					</Modal>
				</Col>
				</FormItem>
				
				<FormItem>
					<Table columns={columns} dataSource={this.state.allPlan} rowKey="year"/>
				</FormItem>
			</Form>
		);
	}
}

const AnnualTrainingMain=Form.create()(AnnualTrainingView);
export default AnnualTrainingMain