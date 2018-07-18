import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Button, Icon, Form, Divider, DatePicker, Input, InputNumber, Table, Modal, message } from 'antd';

const FormItem = Form.Item;

const PeriodCheckModifyView = Form.create()(class extends React.Component{

  render(){
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const previousData = this.props.defaultVal;
    const width = '100%';
    return(
      <Modal
        visible={visible}
	title="修改期间核查计划"
	okText="确定"
	onCancel={ onCancel }
	onOk={ onCreate }
      >
        <Form layout="vertical">
	  <FormItem
	    label='计划编号'
	  >
	    {getFieldDecorator('planId',{initialValue: previousData.planId, rules: [{ required: true, message: '计划编号必填' }],})
	    (<InputNumber style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem
	    label='核查对象'
	  >
	    {getFieldDecorator('object',{initialValue: previousData.object, rules: [{ required: true, message: '核查对象必填' }],})
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem
	    label='核查内容'
	  >
	    {getFieldDecorator('content',{initialValue: previousData.content, rules: [{ required: true, message: '核查内容必填' }],})
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem
	    label='核查日期'
	  >
	    {getFieldDecorator('checkDate',{rules: [{ required: true, message: '核查时间必填' }], })
	    (<DatePicker style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem
	    label='负责人员'
	  >
	    {getFieldDecorator('personInCharge',{initialValue: previousData.personInCharge, rules: [{ required: true, message: '负责人员必填' }],})
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	</Form>
      </Modal>
    );
  }

});

export default PeriodCheckModifyView;
