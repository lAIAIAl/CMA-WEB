import React, { Component, PropTypes } from 'react';
import { Form, Card, Icon, Row, Col, Input, InputNumber, Select, Button,message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { addTraineeService } from "services";

import { getAllStaffTrainingData } from './FetchData';

const Option = Select.Option;
const FormItem = Form.Item;

const AddTrainingPeopleView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  state = {
    loading: false,
    data: [],//所有人员数据
  };

  fetchStaffInfo = () => {
    this.setState({ loading: true });
    $.get("http://119.23.38.100:8080/cma/StaffManagement/getAll", null, (res)=>{
      this.setState({
        data: res.data,
	loading: false
      });
    });
  }

  componentWillMount() {
    this.fetchStaffInfo();
  }

  addTrainees = (props) => {
    let curTrain = props.trainingId;
    let id = this.props.form.getFieldValue('id');
    
    var datas=[];
    var oneData = {};
    oneData["id"] = parseInt(id);
    datas.push(oneData);
    var jsonString = JSON.stringify(datas);
    var epc=eval("("+jsonString+")");
    var finalData = {
      trainingId: curTrain,
      data: epc
    };
    fetch("http://119.23.38.100:8080/cma/StaffTraining/addTrainingPeople",{
      method: 'POST',
      body: JSON.stringify(finalData),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .catch(error => message.error('添加失败!'))
    .then(response => message.success('添加成功!'));
    this.fetchStaffInfo();
    getAllStaffTrainingData();
    this.props.form.resetFields();
  }

  render(){
    const options = this.state.data.map(data => <Option key={data.id}>{data.name}</Option>);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 30 },
	sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 30 },
	sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
	  span: 30,
	  offset: 20,
	},
	sm: {
	  span: 20,
	  offset: 10,
	},
      },
    };
    return(
      <div>
        <FormItem
	  {...formItemLayout}
	  label="参与人员"
	>
	  {getFieldDecorator('id',{ rules: [{ required: true, message: '人员必填' }], })
	  (<Select
	     showSearch
	     style={{ width: 200 }}
	     placeholder="人员"
	   >
	     { options }
	   </Select>
	  )}
	</FormItem>
	<FormItem {...tailFormItemLayout}>
	  <Button type="primary" onClick={ () => this.addTrainees(this.props) }>
	    确认
	  </Button>
	</FormItem>
      </div>
    );
  }

});

export default AddTrainingPeopleView;
