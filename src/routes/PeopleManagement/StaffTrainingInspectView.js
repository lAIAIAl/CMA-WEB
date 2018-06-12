import React, { Component,PropTypes } from 'react';
import { Form, Input, Tooltip, Icon, Cascader,Select, Row, Col, Checkbox, Button, DatePicker, InputNumber, Card } from 'antd';

import { getAllStaffTrainingsSerice } from 'services';
import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllStaffTrainingData } from './FetchData';

const FormItem = Form.Item;

class StaffTrainingInspectView extends React.Component{

  render(){
    let standard = this.props.item;
    const formItems = [];

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    formItems.push(
      <Card key='0' title='培训与考核详情' style={{marginBottom: 20}}>
        <Row key='0'>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训编号"
	    >
	      { standard.trainingId }
	    </FormItem>
	  </Col>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训名称"
	    >
	      { standard.program }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='1'>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训日期"
	    >
	      { standard.trainingDate }
	    </FormItem>
	  </Col>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训地点"
	    >
	      { standard.place }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='2'>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训教师"
	    >
	      { standard.presenter }
	    </FormItem>
	  </Col>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训内容"
	    >
	      { standard.content }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='3'>
	  <FormItem
	    {
	      ...
	      {
	        labelCol: { span:3 },
		wrapperCol: { span: 19 },
	      }
	    }
	    label="备注信息"
	  >
	    { standard.note }
	  </FormItem>
	</Row>
      </Card>
    );

    return(
      <Form>
        { formItems }
      </Form>
    );
  }

}

export default StaffTrainingInspectView
