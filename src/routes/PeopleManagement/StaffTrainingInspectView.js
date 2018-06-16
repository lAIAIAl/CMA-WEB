import React, { Component,PropTypes } from 'react';
import { Form, Input, Tooltip, Icon, Cascader,Select, Row, Col, Checkbox, Button, DatePicker, InputNumber, Card, Divider, message } from 'antd';

import { getAllStaffTrainingsSerice, modifyOneStaffTrainingService } from 'services';
import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllStaffTrainingData } from './FetchData';
import StaffTrainingInspectParticipatorView from './StaffTrainingInspectParticipatorView';
import StaffTrainingModifyView from './StaffTrainingModifyView';
import AddTraineeView from './AddTraineeView';

const FormItem = Form.Item;

const StaffTrainingInspectView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    this.unsubscribe = getStore().subscribe(this.refreshData);
    this.inspectTabName = '查看参与人员';
    this.inspectParticipatorView = StaffTrainingInspectParticipatorView;
    this.addTraineeTabName = '添加参与人员';
    this.addTraineeView = AddTraineeView;
  }

  state = {
    visible: false,
    item: null,//用于存储当前对象
  };

  refreshData = () => {
    let data = getStore().getState().StaffTraining.items;
    let curItem = null;
    for(var i = data.length-1;i>=0;i--){
      if(data[i].trainingId == this.props.item.trainingId)
        curItem = data[i];
    }
    this.setState({
      item: curItem,
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    getAllStaffTrainingData();
    this.refreshData();
  }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err,values) => {
      if(err){
        return;
      }

      let tmpData = values;//用户修改后的数据
      tmpData.trainingId = this.state.item.trainingId;//隐式禁止用户修改编号，防止同号冲突引起的bug
      tmpData.trainingDate = tmpData.trainingDate.format("YYYY-MM-DD");
      this.setState({ item: tmpData });

      $.ajax({
        type: "post",
	url: modifyOneStaffTrainingService,
	data: {
	  trainingId: tmpData.trainingId,
	  program: tmpData.program,
	  trainingDate: tmpData.trainingDate,
	  place: tmpData.place,
	  presenter: tmpData.presenter,
	  content: tmpData.content,
	  note: tmpData.note,
	},
	async: false,
	success: function(d){
	  message.success("修改成功!");
	}
      });

      form.resetFields();

      this.setState({ visible: false});//撤除对话框

      getAllStaffTrainingData();

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

  inspectParticipator = (props) => {
    this.props.addTab(this.inspectTabName,this.inspectTabName,Form.create()(this.inspectParticipatorView),props);
  }

  addTrainee = () => {
    this.props.addTab(this.addTraineeTabName,this.addTraineeTabName,Form.create()(this.addTraineeView),null);
  }

  render(){
    const { visible, item } = this.state;
    let standard = this.state.item;
    const formItems = [];

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    formItems.push(
      <Card key='0' title='培训与考核详情' style={{marginBottom: 20}}>
        <Row key='0'>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训编号"
	    >
	      { standard.trainingId }
	    </FormItem>
	  </Col>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训名称"
	    >
	      { standard.program }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='1'>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训日期"
	    >
	      { standard.trainingDate }
	    </FormItem>
	  </Col>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训地点"
	    >
	      { standard.place }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='2'>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训教师"
	    >
	      { standard.presenter }
	    </FormItem>
	  </Col>
	  <Col span={12}>
	    <FormItem
	      {...formItemLayout}
	      label="培训内容"
	    >
	      { standard.content }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='3'>
	  <FormItem
	    {
	      ...
	      {
	        labelCol: { span:3 },
		wrapperCol: { span: 19 },
	      }
	    }
	    label="备注信息"
	  >
	    { standard.note }
	  </FormItem>
	</Row>
      </Card>
    );

    var props = this.props;

    return(
      <div>

        <Form>
          { formItems }
        </Form>

        <div>
          <Row gutter={16}>
	    <Col className="gutter-row" span={6}>
	      <Button
	        type="primary"
		onClick={ () => {this.inspectParticipator(props)} }
	      >
	        查看参与人员
	      </Button>
	    </Col>
	    <Col className="gutter-row" span={6}>
	      <Button
	        type="primary"
		onClick={ this.addTrainee }
	      >
	        添加参与人员
	      </Button>
	    </Col>
	    <Col className="gutter-row" span={6}>
	      <Button
	        type="primary"
		onClick={this.showModal}
	      >
	        修改培训信息
	      </Button>
	      <StaffTrainingModifyView
	        ref = {this.saveFormRef}
		visible = {this.state.visible}
		defaultVal = {this.state.item}
		onCancel = {this.handleCancel}
		onCreate = {this.handleCreate}
	      />
	    </Col>
	  </Row>
        </div>

      </div>
    );
  }

});

export default StaffTrainingInspectView;

