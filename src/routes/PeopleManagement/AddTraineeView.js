import React, { Component, PropTypes } from 'react';
import { Divider, Button, Form, InputNumber, Row, Col, Card, Icon, message } from 'antd';

const FormItem = Form.Item;

import $ from 'lib/jquery-3.3.1';
import { addTraineeService } from "services";

let uuid = 0;//count the number of items

const AddTraineeView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  state = {
    trainingId: 1,
    Ids:[
      {
        "id": 1,
      },
      {
        "id": 2,
      },
    ],
  };

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if(keys.length === 1){
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextkeys = keys.concat(uuid);//拼接数组元素并返回新数组
    uuid++;
    form.setFieldsValue({
      keys: nextkeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(err){
        return;
      }
      let trainId = this.state.trainingId;
      this.setState({
        Ids: values.ids
      });
      let traineeIds = this.state.Ids;
      console.log("删除单人的培训结果",trainId,traineeIds[0]);
      $.ajax({
        type: "post",
	url: addTraineeService,
	data:{
	  trainingId: trainId,
	  data: traineeIds,
	},
	async: false,
	success:function(d){
	  message.success("添加成功!");
	},
	error:function(){
	  message.error("不存在输入的培训或人员!");
	}
      });
      this.props.form.resetFields();
    });
  }

  onChange = (value) => {
    this.setState({
      trainingId: value,
    });
  }

  render(){
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol:{
        xs: { span: 24 },
	sm: { span: 4 },
      },
      wrapperCol:{
        xs: { span: 24 },
	sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol:{
        xs: { span: 24, offset: 0 },
	sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys',{ initialValue:[] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k,index) => {
      return(
        <FormItem
	  {...(index===0?formItemLayout:formItemLayoutWithOutLabel)}
	  label={index===0?'人员编号':''}
	  required={false}
	  key={k}
	>
	  {getFieldDecorator(`ids[${k}]`,{ validateTrigger: ['onChange','onBlur'], rules: [{ required: true, whitespace: true, message: "请输入人员编号", }], })
	  ( <InputNumber style={{ width: '60%', marginRight: 8 }} /> )}
	  {keys.length>1?(
	    <Icon
	      className="dynamic-delete-button"
	      type="minus-circle-o"
	      disabled={ keys.length === 1 }
	      onClick={ () => this.remove(k) }
	    />
	  ):null}
	</FormItem>
      );
    });
    return(
      <div>
        <Form>
	  <FormItem
	    label='培训编号'
	  >
	    {getFieldDecorator('trainingId',{ initialValue: 1, rules: [{ required: true, message: '培训编号必填' }], })
	    (<InputNumber onChange={ this.onChange }/>)}
	  </FormItem>
	</Form>
        <Form onSubmit={ this.handleSubmit }>
	  {formItems}
	  <FormItem {...formItemLayoutWithOutLabel}>
	    <Button type="dashed" onClick={this.add} style={{width:'60%'}}>
	      <Icon type="plus"/>添加
	    </Button>
	  </FormItem>
	  <FormItem {...formItemLayoutWithOutLabel}>
	    <Button type="primary" htmlType="submit">提交</Button>
	  </FormItem>
	</Form>
      </div>
    );
  }

});

export default AddTraineeView;
