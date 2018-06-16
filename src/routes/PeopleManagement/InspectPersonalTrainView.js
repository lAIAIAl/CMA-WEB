import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Divider, Tabs, Button, Icon, Table, Form, Input, InputNumber, Modal, message } from 'antd';

import { getOnePersonalTrainService } from "services";
import InputPersonalTrainView from './InputPersonalTrainView';

import $ from 'lib/jquery-3.3.1';

const FormItem = Form.Item;

const InspectPersonalTrainView = Form.create()(class extends React.Component{

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
        title: '培训结果',
	dataIndex: 'result',
	key: 'result',
      },
      {
        title: '备注信息',
	dataIndex: 'note',
	key: 'note',
      }
    ];
  }

  state = {
    visible: false,
    data: [],
  };

  obtainPersonalData = () => {
    const form = this.form;
    form.validateFields((err,values) => {
      if(err){
        return;
      }

      let temp = values;
      console.log("单人单次培训记录",parseInt(temp.id),parseInt(temp.trainingId));
      let res = null;
      $.ajax({
        type: "get",
	url: getOnePersonalTrainService,
	processData: false,
	data: {
	  id: parseInt(temp.id),
	  trainingId: parseInt(temp.trainingId),
	},
	async: false,
	success: function(d){
	  res = d.data;
	},
	error: function(){
	  message.error("不存在要查找的对象!");
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
	  <Button type="primary" onClick={ this.showModal }>查询入口</Button>
	  <InputPersonalTrainView
	    ref = { this.saveFormRef }
	    visible = { this.state.visible }
	    onCancel = { this.handleCancel }
	    onCreate = { this.obtainPersonalData }
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

export default InspectPersonalTrainView;
