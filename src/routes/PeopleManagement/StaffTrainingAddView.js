import React, { Component, PropTypes } from 'react';
import { Button, Modal, Form, Input, Row, Col, Tooltip, Checkbox, Icon, Cascader, Select, DatePicker, InputNumber, Card, message } from 'antd';

import { addOneStaffTrainingService } from 'services';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

const FormItem = Form.Item;

const StaffTrainingAddView = Form.create()( class extends React.Component {
  
  render(){
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;

    const width = '100%';

    return(
    <Modal
      visible = { visible }
      title = "培训与考核信息录入"
      okText = "确认"
      onCancel = { onCancel }
      onOk = { onCreate }
    >
      <Form layout="vertical">
 
	    <FormItem
	      label='培训名称'
	    >
	    {getFieldDecorator('program',{
	        rules: [{ required: true, message: '培训名称必填' }],
	    })(
	        <Input style={{ width:width }} />
	    )}
	    </FormItem>
	 
	    <FormItem
	      label='培训日期'
	    >
	    {getFieldDecorator('trainingDate',{
	      rules: [{ required: true, message: '培训日期必填' }],
	    })(
	        <DatePicker style={{ width:width }} />
	    )}
	    </FormItem>
	 
	    <FormItem
	      label='培训地点'
	    >
	    {getFieldDecorator('place',{
	        rules: [{ required: true, message: '培训地点必填' }],
	    })(
	        <Input style={{ width:width }} />
	    )}
	    </FormItem>

	    <FormItem
	      label='培训教师'
	    >
	    {getFieldDecorator('presenter',{
	        rules: [{ required: true, message: '培训教师必填' }],
	    })(
	        <Input style={{ width:width }} />
	    )}
	    </FormItem>

	    <FormItem
	      label='培训内容'
	    >
	    {getFieldDecorator('content',{
	        rules: [{ required: true, message: '培训内容必填' }],
	    })(
	        <Input style={{ width:width }} />
	    )}
	    </FormItem>

	    <FormItem
	    {
	      ...
	      {
	        labelCol: { span: 3 },
		wrapperCol: { span: 19 },
	      }
	    }
	    label='备注'
	    >
	    {getFieldDecorator('note',{
	    })(
	      <Input type="textarea" rows={4} />
	    )}
	    </FormItem>
   
      </Form>
    </Modal>
    );
  }
 }
);

export default StaffTrainingAddView;
