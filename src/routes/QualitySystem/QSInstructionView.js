import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Form } from 'antd';

import QSInstructionComponent from './QSInstructionComponent';

const FormItem = Form.Item;

export default class QSInstructionView extends React.Component{

  render(){
    return(
      <Form>
        <FormItem>
	  <QSInstructionComponent addTab={ this.props.addTab } />
	</FormItem>
      </Form>
    )
  }

}
