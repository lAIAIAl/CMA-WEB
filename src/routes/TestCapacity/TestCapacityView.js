import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Form } from 'antd';

import TestCapacityComponent from './TestCapacityComponent';

const FormItem = Form.Item;

export default class TestCapacityView extends React.Component{

  render(){
    
    return(
      <Form>
        <FormItem>
	  <TestCapacityComponent addTab={ this.props.addTab } />
	</FormItem>
      </Form>
    )

  }

}
