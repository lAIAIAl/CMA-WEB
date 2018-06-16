import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Button, Icon, Form, Divider, Input, Table, InputNumber, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getStaffTrainingPeopleService } from "services";

const FormItem = Form.Item;

class StaffTrainingInspectParticipatorView extends React.Component{
  
  constructor(props){
    super(props);
  }

  state = {
    parData: [],
  };

  requestParticipators = (props) => {
    let curTrain = props.item.trainingId;
    let res = null;
    $.ajax({
      type: "get",
      url: getStaffTrainingPeopleService,
      data: {trainingId:curTrain},
      async: false,
      success:function(d){
	res = d.data;
      }
    });
    this.setState({
      parData: res,
    });
  }

  componentWillMount() {
    this.requestParticipators(this.props);
  }

  render(){
    const formItems = [];
    const formItemLayout = {
      labelCol: {span:6},
      wrapperCol: {span:14},
    };
    let showData = this.state.parData;
    for(var i = 0; i < showData.length; i++){
      let childData = showData[i];
      formItems.push(
        <Row>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="人员编号"
	    >
	      { childData.id }
	    </FormItem>
	  </Col>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="人员姓名"
	    >
	      { childData.name }
	    </FormItem>
	  </Col>
	</Row>
      );
    }
    return(
      <div>
        <Form>
	  { formItems }
	</Form>
      </div>
    );
  }

}

export default StaffTrainingInspectParticipatorView;

