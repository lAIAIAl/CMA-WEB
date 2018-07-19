import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Button, Icon, Form, Divider, DatePicker, Input, InputNumber, Table, Modal, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { getItems } from 'common/basic/reducers/ItemReducer';
import { getAllStaffTrainingData } from './FetchData';
import { modifyOneStaffTrainingService } from "services";

const FormItem = Form.Item;

const StaffTrainingModifyView = Form.create()( class extends React.Component{

  render(){
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const previousData = this.props.defaultVal;
    const width = '100%';
    return(
      <Modal
        visible = { visible }
	title = "修改培训信息"
	okText = "确定"
	onCancel = { onCancel }
	onOk = { onCreate }
      >
        <Form layout="vertical">
	  
	  <FormItem
	    label='培训名称'
	  >
	    {getFieldDecorator('program',{initialValue: previousData.program, rules: [{ required: true, message: '培训名称必填' }],})(<Input style={{ width:width }} />)}
	  </FormItem>

	  <FormItem
	    label='培训日期'
	  >
	    {getFieldDecorator('trainingDate',{rules: [{ required: true, message: '培训日期必填' }],})(<DatePicker style={{ width:width }} />)}
	  </FormItem>

	  <FormItem
	    label='培训地点'
	  >
	    {getFieldDecorator('place',{initialValue: previousData.place, rules: [{ required: true, message: '培训地点必填' }],})(<Input style={{ width:width }} />)}
	  </FormItem>

	  <FormItem
	    label='培训教师'
	  >
	    {getFieldDecorator('presenter',{initialValue: previousData.presenter, rules: [{ required: true, message: '培训教师必填' }],})(<Input style={{ width:width }} />)}
	  </FormItem>

	  <FormItem
	    label='培训内容'
	  >
	    {getFieldDecorator('content',{initialValue: previousData.content, rules: [{ required: true, message: '培训内容必填' }],})(<Input style={{ width:width }} />)}
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
	    {getFieldDecorator('note',{initialValue: previousData.note,})(<Input type="textarea" rows={4} />)}
	  </FormItem>

	</Form>
      </Modal>
    );
  }

});

export default StaffTrainingModifyView;
