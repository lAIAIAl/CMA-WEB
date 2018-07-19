import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Form } from 'antd';

import QSManualComponent from './QSManualComponent';

const FormItem = Form.Item;

export default class QSManualView extends React.Component{

  render(){
    return(
      <Form>
        <FormItem>
	  <QSManualComponent addTab={ this.props.addTab }/>
	</FormItem>
      </Form>
    )
  }

}
