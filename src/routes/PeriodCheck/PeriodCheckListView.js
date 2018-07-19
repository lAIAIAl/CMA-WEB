import React, { Component, PropTypes } from 'react';
import { Row, Col, Form, Divider, message } from 'antd';

import PeriodCheckListComponent from "./PeriodCheckListComponent";

const FormItem = Form.Item;

export default class PeriodCheckListView extends React.Component{

  render(){
    return(
      <Form>
        <FormItem>
	  <PeriodCheckListComponent addTab={this.props.addTab}/>
	</FormItem>
      </Form>
    )
  }

};

