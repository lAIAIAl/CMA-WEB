import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Button, Icon, Form, Divider, Input, InputNumber, Select, Tooltip, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getOnePersonalTrainService, addTrainingResultService } from "services";
import { getAllStaffTrainingData } from './FetchData';

const FormItem = Form.Item;

const Option = Select.Option;

const GetStaffTrainView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  state = {
    resultData: null,
    visible: false,
    loading: false,
  };

  fetchStaffTrainResult = (props) => {
    let trainId = props.item.trainingId;
    let staffId = props.id;
    console.log("train",trainId," staff",staffId);
    let res = null;
    $.ajax({
      type: "get",
      url: getOnePersonalTrainService,
      data: {
        id: staffId,
	trainingId: trainId,
      },
      async: false,
      success:function(d){
        res = d.data;
      },
      error:function(){
        message.error('不存在当前用户!');
      }
    });
    this.setState({
      resultData: res
    });
  }

  handleDeleteResult = () => {
      let trainId = this.props.item.trainingId;
      let staffId = this.props.id;
      $.ajax({
         type:"post",
          url:"http://119.23.38.100:8080/cma/StaffTraining/deleteTrainingPeople",
          data:{
             id:staffId,
              trainingId:trainId,
          },
          async:false,
          success:function(d){
             message.success('删除成功!');
          }
      });
      let tmp = this.state.resultData;
      tmp.result = null;
      this.setState({
          resultData:tmp
      });
  }

  handleAddResult = (value) => {
    console.log('add selected:',value);
    let trainId = this.props.item.trainingId;
    let staffId = this.props.id;
    let result = value;
    $.ajax({
      type: "post",
      url: "http://119.23.38.100:8080/cma/StaffTraining/addTrainingResult",
      data:{
        id: staffId,
	trainingId: trainId,
	result: result,
      },
      async: false,
      success:function(d){
        message.success('添加成功!');
      }
    });
    let tmp = this.state.resultData;
    tmp.result = result;
    this.setState({
      resultData: tmp
    });
  }

  handleModifyResult = (value) => {
    console.log('modify selected: ',value);
    let trainId = this.props.item.trainingId;
    let staffId = this.props.id;
    let result = value;
    $.ajax({
      type: "post",
      url: "http://119.23.38.100:8080/cma/StaffTraining/modifyResult",
      data:{
        id: staffId,
	trainingId: trainId,
	result: result,
      },
      async: false,
      success:function(d){
        message.success('修改成功!');
      }
    });
    let tmp = this.state.resultData;
    tmp.result = result;
    this.setState({
      resultData: tmp
    });
  }

  componentWillMount() {
    this.fetchStaffTrainResult(this.props);
  }

  render(){
    let targetData = this.state.resultData;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return(
      <div>
        <Card title='单次培训结果'>
	  <Row key='0'>
	    <Col span={ 12 }>
	      <FormItem
	        {...formItemLayout}
		label="培训编号"
	      >
	        { targetData.trainingId }
	      </FormItem>
	    </Col>
	    <Col span={ 12 }>
	      <FormItem
	        {...formItemLayout}
		label="培训名称"
	      >
	        { targetData.program }
	      </FormItem>
	    </Col>
	  </Row>
	  <Row key='1'>
	    <Col span={ 12 }>
	      <FormItem
	        {...formItemLayout}
		label="培训结果"
	      >
	        { targetData.result }
	      </FormItem>
	    </Col>
	    <Col span={ 12 }>
	      <FormItem
	        {...formItemLayout}
		label="备注信息"
	      >
	        { targetData.note }
	      </FormItem>
	    </Col>
	  </Row>
	</Card>
        <br/>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <Button
                type="primary"
                onClick={this.handleDeleteResult}
              >
                删除培训结果
              </Button>
            </Col>
	    <Col className="gutter-row" span={6}>
	      <Tooltip placement="topLeft" title="添加培训结果">
	      <Select style={{ width:120 }} onChange={this.handleAddResult} disabled={targetData.result !== null}>
	        <Option value="优秀">优秀</Option>
		<Option value="良好">良好</Option>
		<Option value="合格">合格</Option>
		<Option value="不合格">不合格</Option>
	      </Select>
	      </Tooltip>
	    </Col>
	    <Col className="gutter-row" span={6}>
	      <Tooltip placement="topLeft" title="修改培训结果">
	        <Select style={{ width:120 }} onChange={this.handleModifyResult}>
		  <Option value="优秀">优秀</Option>
		  <Option value="良好">良好</Option>
		  <Option value="合格">合格</Option>
		  <Option value="不合格">不合格</Option>
		</Select>
	      </Tooltip>
	    </Col>
          </Row>
      </div>
    );
  }

});

export default GetStaffTrainView;
