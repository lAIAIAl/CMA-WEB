import React, { Component, PropTypes } from 'react';
import { Button, Row, Col, Form, Card, message } from 'antd';

const FormItem = Form.Item;

const PeriodCheckGetOneView = Form.create()(class extends React.Component{

  render(){
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const formItems = [];
    let showData = this.props.obData;
    formItems.push(
        <Card key='0' title='单个期间核查计划' style={{ marginBottom: 20 }}>
	  <Row key='0'>
	    <Col span={12}>
	      <FormItem
	        {...formItemLayout}
		label="核查编号"
	      >
	        { showData.planId }
	      </FormItem>
	    </Col>
	    <Col span={12}>
	      <FormItem
	        {...formItemLayout}
		label="核查对象"
	      >
	        { showData.object }
	      </FormItem>
	    </Col>
	  </Row>
	  <Row key='1'>
	    <Col span={12}>
	      <FormItem
	        {...formItemLayout}
		label="核查内容"
	      >
	        { showData.content }
	      </FormItem>
	    </Col>
	    <Col span={12}>
	      <FormItem
	        {...formItemLayout}
		label="核查时间"
	      >
	        { showData.checkDate }
	      </FormItem>
	    </Col>
	  </Row>
	  <Row key='2'>
	    <Col span={12}>
	      <FormItem
	        {...formItemLayout}
		label="负责人员"
	      >
	        { showData.personInCharge }
	      </FormItem>
	    </Col>
	    <Col span={12}>
	      <FormItem
	        {...formItemLayout}
		label="核查状态"
	      >
	        { showData.state }
	      </FormItem>
	    </Col>
	  </Row>
	</Card>
    );
    return(
      <div>
        <Form>
	  { formItems }
	</Form>
      </div>
    );
  }

});

export default PeriodCheckGetOneView;
