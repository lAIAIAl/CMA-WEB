import React, { Component, PropTypes } from 'react';
import { Button, Modal, Form, Input, Row, Col, Divider, message } from 'antd';

const FormItem = Form.Item;

const TestCapacityItemAddView = Form.create()(class extends React.Component{

  render(){
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const width = '100%';
    return(
      <Modal
        visible = {visible}
	title = "新增产品信息"
	okText = "确认"
	onCancel = { onCancel }
	onOk = { onCreate }
      >
        <Form layout="vertical">
	  <FormItem label='产品名称'>
	    {getFieldDecorator('productionName',{ rules: [{ required: true, message: '产品名称必填' }], })
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem
	    {
	      ...
	      {
	        labelCol: { span: 3 },
		wrapperCol: { span: 19 },
	      }
	    }
	    label='能力'
	  >
	    {getFieldDecorator('ability',{ rules: [{ required: true, message: '产品能力必填' }], })
	    (<Input type="textarea" rows={4}/>)}
	  </FormItem>
	  <FormItem
	    {
	      ...
	      {
	        labelCol: { span: 3 },
		wrapperCol: { span: 19 },
	      }
	    }
	    label='依据'
	  >
	    {getFieldDecorator('referrence',{ rules: [{ required: true, message: '产品依据必填' }], })
	    (<Input type="textarea" rows={4}/>)}
	  </FormItem>
	</Form>
      </Modal>
    );
  }

});

export default TestCapacityItemAddView;
