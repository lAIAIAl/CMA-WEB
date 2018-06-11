import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, message, Select, DatePicker, InputNumber} from 'antd';

const FormItem = Form.Item;

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';
import {getSuperviseRecord} from './RequestFunction';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const AddSuperviseRecord = Form.create()(
class extends React.Component{

	constructor(props){
		super(props);
	}

	handleSubmit = (e)=>{
		e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			
      			let temp=values;
                temp.planId = this.props.planId;
                temp.superviseDate=temp.superviseDate.format("YYYY-MM-DD");
                temp.recordDate=temp.recordDate.format("YYYY-MM-DD");

                console.log(temp);
      			$.ajax({
		      		type: "post",
		      		url: baseAddress+"/cma/SupervisionRecord/addOne",
		      		data: temp,
                    async: false,
			      	success: function(d){
                        message.success("新增成功");
                    }
		    	 });
                getSuperviseRecord(this.props.planId);
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
                <FormItem {...formItemLayout} label="部门">
                    {getFieldDecorator('department', {
                    	
                        rules: [{ required: true, message: '请输入部门！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="监督员">
                    {getFieldDecorator('supervisor', {
                    	
                        rules: [{ required: true, message: '请输入监督员！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="监督时间">
                    {getFieldDecorator('superviseDate', {
                        
                        rules: [{ required: true, message: '请输入监督时间！' }],
                    })(
                        <DatePicker />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="被监督人">
                    {getFieldDecorator('supervisedPerson', {
                        
                        rules: [{ required: true, message: '请输入被监督人！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="监督内容记录">
                    {getFieldDecorator('record', {
                        
                        rules: [{ required: true, message: '请输入监督内容记录！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="结论">
                    {getFieldDecorator('conclusion', {
                        
                        rules: [{ required: true, message: '请输入结论！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="操作人">
                    {getFieldDecorator('operator', {
                        
                        rules: [{ required: true, message: '请输入操作人！' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="记录时间">
                    {getFieldDecorator('recordDate', {
                        
                        rules: [{ required: true, message: '请输入记录时间！' }],
                    })(
                        <DatePicker />
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

export default AddSuperviseRecord;