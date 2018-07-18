import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Form } from 'antd';

import QSProgramComponent from './QSProgramComponent';

const FormItem = Form.Item;

export default class QSProgramView extends React.Component{

  render(){
    return(
      <Form>
        <FormItem>
	  <QSProgramComponent addTab={ this.props.addTab }/>
	</FormItem>
      </Form>
    )
  }

}
