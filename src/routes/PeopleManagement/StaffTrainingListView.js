import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message } from 'antd';

import StaffTrainingListComponent from "./StaffTrainingListComponent";

const FormItem = Form.Item;

export default class StaffTrainingListView extends React.Component{
  
  render(){
    return(
      <Form>
        <FormItem>
	  <StaffTrainingListComponent addTab={this.props.addTab} />
	</FormItem>
      </Form>
    )
  }

}

