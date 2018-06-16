import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Divider, Tabs, Button, Icon, Table, Form, Input, InputNumber, Modal, message } from 'antd';

import { getAllByStaffService } from "services";
import InputPersonalIdView from './InputPersonalIdView';

import $ from 'lib/jquery-3.3.1';

const FormItem = Form.Item;

const InspectPersonalTrainsView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    this.columns = [
      {
        title: '培训编号',
	dataIndex: 'trainingId',
	key: 'trainingId',
      },
      {
        title: '培训名称',
	dataIndex: 'program',
	key: 'program',
      },
      {
        title: '培训日期',
	dataIndex: 'trainingDate',
	key: 'trainingDate',
      },
      {
        title: '培训教师',
	dataIndex: 'presenter',
	key: 'presenter',
      },
      {
        title: '培训地点',
	datatIndex: 'place',
	key: 'place',
      }
    ];
  }

  state = {
    visible: false,
    data: [],//用于存储人员的全部培训记录数据
  };

  fetchPersonalData = () => {
    const form = this.form;
    form.validateFields((err,values) => {
      if(err){
        return;
      }
      
      let temp = values;//用户输入的数据
      console.log(parseInt(temp.id));
      let res = null;
      $.ajax({
        type: "get",
	url: getAllByStaffService,
	processData: false,
	data: parseInt(temp.id),
	async: false,
	success: function(d){
	  res = d.data;
	},
	error: function(){
	  message.error("不存在此用户!");
	}
      });

      form.resetFields();

      this.setState({
        data: res,
	visible: false,
      });

    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  render(){
    const { visible } = this.state;
    const columns = this.columns;
    return(
        <div>
          <Card>
	    <Button type="primary" onClick={this.showModal}>查询入口</Button>
	    <InputPersonalIdView
	      ref = { this.saveFormRef }
	      visible = { this.state.visible }
	      onCancel = { this.handleCancel }
	      onCreate = { this.fetchPersonalData }
	    />
	  </Card>
	  <Table
	    columns = { columns }
	    dataSource = { this.state.data }
	  />
	</div>
    );
  }

});

export default InspectPersonalTrainsView;
