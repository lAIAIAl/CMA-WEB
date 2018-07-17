import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Button, Select, Icon, Upload, DatePicker, Table, Form, Input, Modal, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';
import {baseAddress} from 'services';
import TrainingRecordInspect from './TrainingRecordInspect'
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

const FormItem=Form.Item;
const { Option, OptGroup } = Select;
//style
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
export const getAllRecord = () =>{
	$.get(baseAddress+"/cma/StaffTraining/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].trainingId;
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'TrainingRecordMain'));
  	});
}

class TrainingRecordMainView extends React.Component {
	constructor(props) {
		super(props);
        this.unsubscribe = getStore().subscribe(this.refreshData);
		this.state = {
			visible: false,
			allRecord: [],
			fileList: [],
			uploading: false,
		}
	}

	handleAddTab = (props) => {
		var title = props.item.record.program+"培训详情";
		this.props.addTab(title,title,TrainingRecordInspect,props);
	}

	showModal = () => {
		this.setState({
			visible: true
		})
	}
	onOk = () => {
		this.setState({
			visible: false
		})
	}

	addOne = () => {
		const {fileList} = this.state;

		var program = this.props.form.getFieldValue('program');
		var trainingDate = this.props.form.getFieldValue('trainingDate').format('YYYY-MM-DD');
		var place = this.props.form.getFieldValue('place');
		var presenter = this.props.form.getFieldValue('presenter');
		var content = this.props.form.getFieldValue('content');
		var note = this.props.form.getFieldValue('note') || '';

		var formda = new FormData();

		formda.append("program", program);
		formda.append("trainingDate", trainingDate);
		formda.append("place", place);
		formda.append("presenter", presenter);
		formda.append("content", content);
		formda.append("note", note);
		fileList.forEach((file) => {
			formda.append("file", file)
		});

		this.setState({
			visible: false,
			uploading: true,
		})

		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/StaffTraining/addOne",
			data: formda,
			processData: false,
    		contentType: false,
			async: false,
			success: () => {
				message.success("新增成功啦");
				this.setState({
					fileList: []
				})
			},
			error: () => {
				message.error("新增失败哦");
			}
		});

		this.setState({
			uploading: false
		})
        this.getAll();
		this.props.form.resetFields();
	}

	deleteOne = (key) => {
		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/StaffTraining/deleteOne",
			data: {
				trainingId: key
			},
			async: false,
			success: () => {
				message.success("删除成功啦");
			},
			error: () => {
				message.error("删除失败哦");
			}
		});
		this.getAll();
	}

	getAll = () => {
		$.get("http://119.23.38.100:8080/cma/StaffTraining/getAll", null,(res) =>{
      		let temp = res.data;
      		for(var i = temp.length-1; i >= 0; i--) {
        		temp[i].key = temp[i].trainingId;
      		}
      		this.setState({
        		allRecord: temp
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
			allRecord: getStore().getState().TrainingRecordMain.items
		});
	}

	render()
	{
		const columns = [{
			title: '培训项目名称',
			dataIndex: 'program',
			key: 'program',
		}, {
			title: '培训日期',
			dataIndex: 'trainingDate',
			key: 'trainingDate',
            defaultSortOrder: 'descend',
            sorter: (a, b) =>  (a.trainingDate.replace("-","")>b.trainingDate.replace("-",""))?1:-1,
		}, {
			title: '培训地点',
			dataIndex: 'place',
			key: 'place',
		}, {
			title: '主讲人',
			dataIndex: 'presenter',
			key: 'presenter',
		}, {
			title: '培训内容',
			dataIndex: 'content',
			key: 'content',
		}, {
			title: '操作',
			colSpan: 2,
			width: '10%',
			key: 'inspect',
			render: (text, record) => {
				var props = {
					item: {
						record,
					}
				}
				return(
					<div>
						<Button type="primary" onClick={() => this.handleAddTab(props)}>查看</Button>
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
							<Button type="danger">删除</Button>
						</Popconfirm>
					</div>
				);
			}
		}]

		const {getFieldDecorator} = this.props.form;

		const addprops = {
      		action: "http://119.23.38.100:8080/cma/StaffTraining/addOne",
      		onRemove: (file) => {
        		this.setState(({ fileList }) => {
          			const index = fileList.indexOf(file);
          			const newFileList = fileList.slice();
          			newFileList.splice(index, 1);
          			return {
           				fileList: newFileList,
          			};
        		});
      		},
      		beforeUpload: (file) => {
        		this.setState(({ fileList }) => ({
          			fileList: [...fileList, file],
        		}));
        		return false;
      		},
      		fileList: this.state.fileList,
    	}

		return (
			<Form>
				<FormItem>
					<Col span={4}>
					<Button
						type="primary"
						icon="sync"
						onClick={this.getAll}
						>
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
						title="新增培训记录"
						visible={this.state.visible}
						onOk={this.addOne}
						onCancel={this.onOk}>

						<Form layout="horizontal">
							<FormItem {...formItemLayout} label="培训项目名称：" hasFeedback>
                        		{getFieldDecorator('program', {
                          			rules: [{required: true, message: 'Please input the program!'}],
                          			initialValue: '',
                        		})(
                        			<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="培训日期：" hasFeedback>
                        		{getFieldDecorator('trainingDate', {
                          			rules: [{required: true, message: 'Please input the trainingDate!'}],
                        		})(
                        			<DatePicker />
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="培训地点：" hasFeedback>
                        		{getFieldDecorator('place', {
                          			rules: [{required: true, message: 'Please input the place!'}],
                          			initialValue: '',
                        		})(
                        			<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="主讲人：" hasFeedback>
                        		{getFieldDecorator('presenter', {
                          			rules: [{required: true, message: 'Please input the presenter!'}],
                          			initialValue: '',
                        		})(
                        			<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="培训内容：" hasFeedback>
                        		{getFieldDecorator('content', {
                          			rules: [],
                          			initialValue: '',
                        		})(
                        			<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      		<FormItem {...formItemLayout} label="备注：" hasFeedback>
                        		{getFieldDecorator('note', {
                          			rules: [],
                          			initialValue: '',
                        		})(
                        			<Input style ={{width: 100,offset:4}}/>
                        		)}
                      		</FormItem>
                      	</Form>

                      	<Form id="upfile">
                      		培训信息文件：
                      			<Upload {...addprops}>
                        			<Button>
                          				<Icon type="upload" /> 添加文件
                        			</Button>
                      			</Upload>
                    	</Form>
					</Modal>
					</Col>
				</FormItem>
				<FormItem>
					<Table columns={columns} dataSource={this.state.allRecord} rowKey="key" />
				</FormItem>
			</Form>
		);
	}
}

const TrainingRecordMain = Form.create()(TrainingRecordMainView);
export default TrainingRecordMain