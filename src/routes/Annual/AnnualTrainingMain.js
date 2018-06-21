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
			allList: [{
				year: 2017,
				author: "天天",
			}, {
				year: 2018,
				author: "cccy",
			}],
			allPlan: [],
		}
	}

	handleAddTab = (props) => {
		this.props.addTab(props.item.year+"年度计划", props.item.year+"年度计划", AnnualTrainingPlan, props);
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
		},
		{
			title: '批准人',
			dataIndex: 'approver',
			key: 'approver',
		}, {
			title: '批准日期',
			dataIndex: 'approveDate',
			key: 'approveDate',
		},
		{
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
						<Button onClick={() => this.handleAddTab(props)}>查看</Button>
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
                        				placeholder="Select the year"
                        				optionFilterProp="year"
                        				onChange={this.handleSelectChange}
                        				filterOption={(input, option) => option.props.year.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    					>
                    					<OptGroup >
                        					<Option key="2019">2019</Option>
                        					<Option key="2018">2018</Option>
                        					<Option key="2017">2017</Option>
                        					<Option key="2016">2016</Option>
                        					<Option key="2015">2015</Option>
                        					<Option key="2014">2014</Option>
                        					<Option key="2013">2013</Option>
                        					<Option key="2012">2012</Option>
                        					<Option key="2011">2011</Option>
                        					<Option key="2010">2010</Option>
                        					<Option key="2009">2009</Option>
                        					<Option key="2008">2008</Option>
                        					<Option key="2007">2007</Option>
                        					<Option key="2006">2006</Option>
                        					<Option key="2005">2005</Option>
                        				</OptGroup>
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