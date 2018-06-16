import React, { Component, PropTypes } from 'react';
import { Button, Form, Input, Modal, Row, Col, InputNumber, Card, message } from 'antd';

const FormItem = Form.Item;

const InputPersonalIdView = Form.create()(class extends React.Component{

  render(){
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;

    return(
      <Modal
        visible = { visible }
	title = "查询信息录入"
	okText = "确认"
	onCancel = { onCancel }
	onOk = { onCreate }
      >
        <Form layout="vertical">
	  <FormItem
	    label='人员编号'
	  >
	    {getFieldDecorator('id',{initialValue: 1, rules: [{ required: true, message: '人员编号必填' }],})
	    (<InputNumber/>)}
	  </FormItem>
	</Form>
      </Modal>
    );
  }

});

export default InputPersonalIdView;
