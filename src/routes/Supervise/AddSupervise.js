import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, message, Select, DatePicker, InputNumber} from 'antd';

const FormItem = Form.Item;

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getSupervise} from './RequestFunction';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const AddSupervise = Form.create()(
class extends React.Component{

	constructor(props){
		super(props);
	}

	handleSubmit = (e)=>{
		e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			
      			let temp=values;
                
                console.log(temp);
      			$.ajax({
		      		type: "post",
		      		url: baseAddress+"/cma/Supervision/addOne",
		      		data: temp,
                    async: false,
			      	success: function(d){
                        message.success("新增成功");
                    }
		    	 });
                getSupervise();
      		}
    	});
	}

	render(){
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
		return (
        	<div>
            <Form 
                layout="vertical"
                onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="编制人">
                    {getFieldDecorator('author', {
                    	
                        rules: [{ required: true, message: '请输入编制人！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="备注">
                    {getFieldDecorator('remark', {
                    	
                        rules: [{ required: true, message: '请输入备注！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem>
			       	<Button
			           	type="primary"
			           	htmlType="submit"
			           	type="button"
			           	disabled={hasErrors(getFieldsError())}
			       	>新增
			       	</Button>
		        </FormItem>
		    </Form>
		    </div>
      	);
	}
}
);

export default AddSupervise;