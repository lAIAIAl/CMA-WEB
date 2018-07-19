import React, { Component, PropTypes } from 'react';
import { Button, Row, Col, Form, Input, InputNumber, Modal, DatePicker, Card, message } from 'antd';

const FormItem = Form.Item;

const PeriodCheckAddView = Form.create()(class extends React.Component{

  render(){
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const width = '100%';
    return(
      <Modal
        visible = { visible }
	title = "添加期间核查"
	okText = "确认"
	onCancel = { onCancel }
	onOk = { onCreate }
      >
        <Form layout="vertical">
	<FormItem
	  label='核查对象'
	>
	  {getFieldDecorator('object',{ rules: [{ required: true, message: '核查对象必填' }], })
	  (<Input style={{ width:width }}/>)}
	</FormItem>
	<FormItem
	  label='核查内容'
	>
	  {getFieldDecorator('content',{ rules: [{ required: true, message: '核查内容必填' }], })
	  (<Input style={{ width:width }}/>)}
	</FormItem>
	<FormItem
	  label='核查时间'
	>
	  {getFieldDecorator('checkDate',{ rules: [{ required: true, message: '核查时间必填' }], })
	  (<DatePicker style={{ width:width }}/>)}
	</FormItem>
	<FormItem
	  label='负责人员'
	>
	  {getFieldDecorator('personInCharge',{ rules: [{ required: true, message: '负责人员必填' }], })
	  (<Input style={{ width:width }}/>)}
	</FormItem>
	</Form>
      </Modal>
    );
  }

});

export default PeriodCheckAddView;
