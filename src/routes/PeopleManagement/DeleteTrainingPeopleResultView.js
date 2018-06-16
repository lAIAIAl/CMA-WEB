import React, { Component, PropTypes } from 'react';
import { Row, Col, Form, Button, Card, Icon, Table, Input, InputNumber, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { deleteTrainingPeopleResultService } from "services";

const FormItem = Form.Item;

const DeleteTrainingPeopleResultView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err,values) => {
      if(err){
        return;
      }

      let temp = values;
      console.log("删除单人的培训结果",temp.id,temp.trainingId);

      $.ajax({
        type: "post",
	url: deleteTrainingPeopleResultService,
	processData: false,
	data: {
	  id: parseInt(temp.id),
	  trainingId: parseInt(temp.trainingId),
	},
	async: false,
	success:function(d){
	  message.success("删除成功!");
	},
	error:function(){
	  message.error("删除失败!");
	}
      });
    });

    this.props.form.resetFields();
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return(
      <Form onSubmit={ this.handleSubmit }>

      <FormItem
        {...formItemLayout}
	label="人员编号"
      >
        {getFieldDecorator('id',{ rules: [{ required: true, message: '人员编号必填' }], })(<InputNumber/>)}
      </FormItem>

      <FormItem
        {...formItemLayout}
	label="培训编号"
      >
        {getFieldDecorator('trainingId',{ rules: [{ required: true, message: '培训编号必填' }], })(<InputNumber/>)}
      </FormItem>

      <FormItem
        wrapperCol={{ span: 12, offset: 6 }}
      >
        <Button type="primary" htmlType="submit">确认</Button>
      </FormItem>

      </Form>
    );
  }
 
});

export default DeleteTrainingPeopleResultView;
