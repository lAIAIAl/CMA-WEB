import React from 'react';
import {Form, Button, Row, Col, Card, Table, message, Modal, Input, DatePicker} from 'antd';
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;

import ExternalReviewDetail from './ExternalReviewDetail';

import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import {getExternalReviewList} from './RequestFunction';

const ExternalReviewList = Form.create()(
class extends React.Component{

	state = {
		externalReviewlist : [],
		selectedRowKeys: [],
		visible: false,
	};

	constructor(props){
		super(props);
		this.unsubscribe = getStore().subscribe(this.refreshData);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	componentWillMount() {
		getExternalReviewList();
	}

	refreshData = () => {
		let data = getStore().getState().ExternalReviewList.items;
		this.setState({
			externalReviewlist: data
		})
	}


	handleCreate = () => {
    	const form = this.formRef.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}

      		let temp = values;

      		temp.year = temp.date.format("YYYY");
      		temp.date = temp.date.format("YYYY-MM-DD");

	  		$.ajax({
			    type: "post",
			    url: baseAddress+"/cma/ExternalReviewManagement/addOne",
			    data: temp,
			    async: false,
			    success: function (d) {
			    	message.success("新增成功");
				},
				error: function (d) {
			    	message.error("新增失败");
				}
			});
			
			getExternalReviewList();
  			
      		form.resetFields();

      		this.setState({ 
      			visible: false ,
      		});
      		
    	});
  	}

	handleDelete = () => {

  		const {selectedRowKeys } = this.state;

  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = this.state.externalReviewlist.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			let deleteId = this.state.externalReviewlist[x].year;
  			
  			$.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/ExternalReviewManagement/deleteOne",
		      	data: {year : deleteId},
		      	async:false,
		      	success: function (d) {
		      		
		      	}
		    });
  		}

  		getExternalReviewList();

		this.setState({
			selectedRowKeys: [],
		});

	}

	onSelectChange = (selectedRowKeys) => {
    	this.setState({ selectedRowKeys });
  	}

  	showModal = () => {
    	this.setState({ visible: true });
  	}

  	handleCancel = () => {
    	this.setState({ visible: false });
  	}

  	saveFormRef = (formRef) => {
    	this.formRef = formRef;
  	}

  	handleInspect = (record) => {
  		this.props.addTab(record.year + '年外部评审', record.year + '年外部评审', ExternalReviewDetail, 
  			{year : record.year});
  	}

	render() {

		const {selectedRowKeys} = this.state;

		const rowSelection = {
		    selectedRowKeys,
		    onChange: this.onSelectChange,
		};

		const columns = [
		{
			title : '年份',
			dataIndex : 'year',
			key : 'year',
		},
		{
			title : '日期',
			dataIndex : 'date',
			key : 'date',
		},
		{
			title: '操作',
			dataIndex: 'remark',
			key: 'remark',
			render: (text, record) => {

				return (
				  	<a
				  		onClick={() => {this.handleInspect(record)}}
				  	>
				  		查看详情
				  	</a>
				);
			}
		}
		];

		return (
			<div>
				<Table
					rowSelection={rowSelection} 
					columns = {columns}
					dataSource = {this.state.externalReviewlist}
				>
				</Table>

				<Button
					type='primary'
					style={{margin:'10px 20px 10px 0px'}}
					onClick={this.showModal}
				>新增</Button>

				<Button
					type='danger'
					style={{margin:'10px 20px 10px 0px'}}
					onClick={this.handleDelete}
				>删除</Button>

				<AddForm
			          	wrappedComponentRef={this.saveFormRef}
			          	visible={this.state.visible}
			          	onCancel={this.handleCancel}
			          	onCreate={this.handleCreate}
			    />
			</div>
		);
	}
}
);

const AddForm = Form.create()(
class extends React.Component{
	render(){
		const { visible, onCancel, onCreate, form } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Modal
	            visible={visible}
	            title="新增外部评审"
	            okText="确定"
	            onCancel={onCancel}
	            onOk={onCreate}
	        >
		        <Form layout="vertical">
		            <FormItem label="外部评审日期">
		                {getFieldDecorator('date', {
		                    rules: [{ required: true, message: '请输入日期！' }],
		                })(
		                        <DatePicker />
		                )}
		            </FormItem>
		        </Form>
		    </Modal>
        );
	}
}
)

export default ExternalReviewList;
/*
import React from 'react';
import {Form, Button, Row, Col, Card, Table, message, Modal, Input, DatePicker} from 'antd';
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;

const ExternalReviewList = Form.create()(
class extends React.Component{

	render(){
		return (
			<p>123</p>
		);
	}
}
);

export default ExternalReviewList;*/