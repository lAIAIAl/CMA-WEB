import React, { Component, PropTypes } from 'react';
import { Form, Table, Row, Col, Card, Divider, message } from 'antd';

const FormItem = Form.Item;

const TestCapacityItemDetailView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    const tmp = this.props.item;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return(
      <div>
        <Form layout="vertical">
	  <FormItem {...formItemLayout} label="年份:">
	    { tmp.year }
	  </FormItem>
	  <FormItem {...formItemLayout} label="系统编号:">
	    { tmp.id }
	  </FormItem>
	  <FormItem {...formItemLayout} label="产品名称:">
	    { tmp.productionName }
	  </FormItem>
	  <FormItem {...formItemLayout} label="产品能力:">
	    { tmp.ability }
	  </FormItem>
	  <FormItem {...formItemLayout} label="产品依据:">
	    { tmp.referrence }
	  </FormItem>
	</Form>
      </div>
    );
  }

});

export default TestCapacityItemDetailView;
