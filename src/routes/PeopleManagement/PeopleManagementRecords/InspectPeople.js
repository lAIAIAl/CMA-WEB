import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Upload, message} from 'antd';

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

const FormItem = Form.Item;



function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const InspectPeople = Form.create()(
class extends React.Component {
	state = {
    	fileList: [],
    	uploading: false,
  	}

	constructor(props){
		super(props);
	}

	handleSubmit = (e)=>{
		e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			//TODO:ajax

      			const { fileList } = this.state;
    			const formData = new FormData();
    			fileList.forEach((file) => {
      				formData.append('files[]', file);
    			});
    			
    			console.log(formData);
    			console.log(formData.get('files[]'));

      			let temp={};
      			temp.staffFile = values;
      			temp.staffFile.fileImage = null;
      			temp.name = this.props.item.name;
      			//TODO:发送图片formdata
      			$.ajax({
		      		type: "post",
		      		dataType: 'json',
		      		url: baseAddress+"/cma/StaffFile/modify",
		      		contentType: 'application/json',
		      		data: JSON.stringify(temp),
			      	complete: function(xhr, ts){
			      		message.info(xhr.responseText);
			      	}
		    	});
		    	

		    	/*$.ajax({
		      		type: "post",
		      		url: baseAddress+"/cma/StaffFile/modify",
		      		//contentType: 'multipart/form-data',
		      		contentType: false,
                	processData: false,
		      		data: formData,
		      		success: function (d) {
		      			message.success("修改图片成功");
		      		}
		    	});*/
        		console.log('Received values of form: ', values);
      		}
    	});
	}

    render() {
    	//console.log(this.props.item);
    	const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
		const formItemLayout = {
		    labelCol: {
		        xs: { span: 24 },
		        sm: { span: 8 },
		    },
		    wrapperCol: {
		        xs: { span: 24 },
		        sm: { span: 16 },
		    },
		};
		const defaultVal = this.props.item;
		//const imageAddr = baseAddress+"/cma/StaffFile/getStaffPicture/"+defaultVal.fileImage;
		const imageAddr = baseAddress+"/cma/StaffFile/getStaffPicture/7.jpg";
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
		        return false;
		    },
		    fileList: this.state.fileList,
		};

        return (
        	<div>
            <Form 
                layout="vertical"
                onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="姓名">
                    {getFieldDecorator('name', {
                    	initialValue: defaultVal.name,
                        rules: [{ required: true, message: '请输入姓名！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="部门">
                    {getFieldDecorator('department', {
                    	initialValue: defaultVal.department,
                        rules: [{ required: true, message: '请输入部门！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="职位">
                    {getFieldDecorator('position', {
                    	initialValue: defaultVal.position,
                        rules: [{ required: true, message: '请输入职位！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="档案编号">
                    {getFieldDecorator('fileId', {
                    	initialValue: defaultVal.fileId,
                        rules: [{ required: true, message: '请输入档案编号！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="档案存放位置">
                    {getFieldDecorator('location', {
                    	initialValue: defaultVal.location,
                        rules: [{ required: true, message: '请输入档案存放位置！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="修改档案扫描件">
                    {getFieldDecorator('fileImage', {
                       
                    })(  
                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 上传档案扫描件
                            </Button>
                        </Upload>
                     )}
                </FormItem>
                <FormItem>
			       	<Button
			           	type="primary"
			           	htmlType="submit"
			           	type="button"
			           	disabled={hasErrors(getFieldsError())}
			       	>修改
			       	</Button>
		        </FormItem>
		    </Form>
		    <a href={imageAddr} >点击下载当前档案扫描件</a>
		    </div>
      	);
    }
}
);

export default InspectPeople;