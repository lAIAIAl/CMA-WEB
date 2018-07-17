import React from 'react';
import {Form, Button, Row, Col, Card, Table, message, Modal, Input, DatePicker, Upload, Icon} from 'antd';
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;


import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import {getExternalReviewDetail} from './RequestFunction';

const ExternalReviewDetail = Form.create()(
class extends React.Component{

	state = {
		filelist: [],
		selectedRowKeys: [],
		visible: false,
		visible2: false,
		file: {},
		modifyingId: -1,
	};

	constructor(props){
		super(props);
		this.unsubscribe = getStore().subscribe(this.refreshData);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	componentWillMount() {
		getExternalReviewDetail(this.props.year);
	}

	handleCreate = () => {
    	const form = this.formRef.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}

      		let temp = values;

      		temp.year = this.props.year;
      		const formData = new FormData();
			formData.append('year', this.props.year);
      		formData.append('file', this.state.file);

      		console.log(formData.get('year'));
      		console.log(formData.get('file'));

	  		$.ajax({
			    type: "post",
			    url: baseAddress+"/cma/ExternalReviewManagement/addOneFile",
			    data: formData,
			    cache: false,
			    processData: false,
                contentType: false,
			    async: false,
			    success: function (d) {
			    	message.success("新增成功");
				},
				error: function (d) {
			    	message.error("新增失败");
				} 
			});

			getExternalReviewDetail(this.props.year);
  			
      		form.resetFields();

      		this.setState({ 
      			visible: false ,
      		});
      		
    	});
  	}

  	handleModify = () => {
  		const form = this.formRef2.props.form;
    	form.validateFields((err, values) => {
      		if (err) {
      		  	return;
      		}

      		let temp = values;

      		temp.year = this.props.year;
      		temp.fileId = this.state.modifyingId;
      		const formData = new FormData();

      		formData.append('fileId', temp.fileId);
      		formData.append('file', this.state.file);

	  		$.ajax({
			    type: "post",
			    url: baseAddress+"/cma/ExternalReviewManagement/modifyOneFile",
			    data: formData,
			    processData: false,
                contentType: false,
			    async: false,
			    success: function (d) {
			    	message.success("修改成功");
				},
				error: function (d) {
			    	message.error("修改失败");
				} 
			});
			
  			
      		form.resetFields();

      		this.setState({ 
      			visible2: false ,
      		});
      		
    	});
  	}

	refreshData = () => {
		let data = getStore().getState().ExternalReviewDetail.items;

		//console.log(data);

		this.setState({
			filelist: data
		})
	}

	handleDelete = () => {

  		const {selectedRowKeys } = this.state;

  		for (let i = selectedRowKeys.length - 1; i >= 0; i--) {
  			let x = this.state.filelist.findIndex(function(x){
  				return x.key == selectedRowKeys[i];
  			});
  			let deleteId = this.state.filelist[x].fileId;
  			
  			$.ajax({
		      	type: "post",
		      	url: baseAddress+"/cma/ExternalReviewManagement/deleteOneFile",
		      	data: {fileId : deleteId},
		      	async:false,
		      	success: function (d) {
		      		
		      	}
		    });
  		}

  		getExternalReviewDetail(this.props.year);

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

  	showModal2 = (record) => {
    	this.setState({ 
    		visible2: true,
    		modifyingId: record.fileId,
    	});
  	}

  	handleCancel2 = () => {
    	this.setState({ visible2: false });
  	}

  	saveFormRef2 = (formRef) => {
    	this.formRef2 = formRef;
  	}

  	setFile = (file) => {
  		this.setState({
  			file: file
  		});
  	}

	render(){
		const {selectedRowKeys} = this.state;

		const rowSelection = {
		    selectedRowKeys,
		    onChange: this.onSelectChange,
		};

		const columns = [
		{
			title : '文档名',
			dataIndex : 'fileName',
			key : 'fileName',
		},
		{
			title: '操作',
			dataIndex: 'remark',
			key: 'remark',
			render: (text, record) => {
				let filesrc = baseAddress + '/cma/ExternalReviewManagement/downloadFile?fileId=' + record.fileId;
				let fileName = record.fileName;
				return (
					<div>
				  	<a
				  		style={{margin:'0px 10px 0px 0px'}}
				  		onClick={() => {this.showModal2(record)}}
				  	>
				  		修改
				  	</a>
				  	<a
				  		href = {filesrc}
				  		download = {fileName}
				  	>
				  		下载
				  	</a>
				  	</div>
				);
			}
		}
		];

		return (
			<div>
				<Table
					rowSelection={rowSelection} 
					columns = {columns}
					dataSource = {this.state.filelist}
				>
				</Table>
				<Button
					type='primary'
					style={{margin:'10px 20px 0px 0px'}}
					onClick={this.showModal}
				>新增</Button>

				<Button
					type='danger'
					style={{margin:'10px 20px 0px 0px'}}
					onClick={this.handleDelete}
				>删除</Button>

				<UploadForm
			          	wrappedComponentRef={this.saveFormRef}
			          	visible={this.state.visible}
			          	onCancel={this.handleCancel}
			          	onCreate={this.handleCreate}
			          	setFile={this.setFile}
			    />
			    <UploadForm
			          	wrappedComponentRef={this.saveFormRef2}
			          	visible={this.state.visible2}
			          	onCancel={this.handleCancel2}
			          	onCreate={this.handleModify}
			          	setFile={this.setFile}
			    />
		    </div>
		);
	}
})
//
const UploadForm = Form.create()(
class extends React.Component{

	state = {
		fileList: []
	}

	render(){

		const props = {
		    action: '//jsonplaceholder.typicode.com/posts/',
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
    		        fileList: [file],
    		    }));
		        this.props.setFile(file);
		        return false;
		    },
		    fileList: this.state.fileList,
		};

		const { visible, onCancel, onCreate, form } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Modal
	            visible={visible}
	            title="上传管理评审文档"
	            okText="确定"
	            onCancel={onCancel}
	            onOk={onCreate}
	        >
		        <Form layout="vertical">
		            <FormItem label="文档">
		                {getFieldDecorator('file', {
		                    rules: [{ required: true, message: '请选择需要上传的文档！' }],
		                })(
			                <Upload {...props}>
	                            <Button>
	                                <Icon type="upload" /> 上传
	                            </Button>
	                        </Upload>
		                )}
		            </FormItem>
		        </Form>
		    </Modal>
        );
	}
}
)


export default ExternalReviewDetail;