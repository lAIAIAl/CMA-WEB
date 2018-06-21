import React, { Component,PropTypes } from 'react';
import { Form, Input, Tooltip, Icon, Cascader,Select, Table, Row, Col, Checkbox, Button, DatePicker, InputNumber, Card, Divider, message } from 'antd';

import { getAllStaffTrainingsSerice, modifyOneStaffTrainingService, getStaffTrainingPeopleService } from 'services';
import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllStaffTrainingData } from './FetchData';
import StaffTrainingModifyView from './StaffTrainingModifyView';
import StaffDetailView from './StaffDetailView';
import AddTrainingPeopleView from './AddTrainingPeopleView';

const FormItem = Form.Item;

const StaffTrainingInspectView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    this.unsubscribe = getStore().subscribe(this.refreshData);
    this.columns = [
      {
        title: '人员编号',
	dataIndex: 'id',
	key: 'id',
	sorter:(a,b) => a.id-b.id,
      },
      {
        title: '人员姓名',
	dataIndex: 'name',
	key: 'name',
      },
      {
        title: '操作',
	dataIndex: 'operation',
	key: 'operation',
	render: (text,record) => {
	  var props = {
	    item: record,//当前人员对象数据(id+name)
	  };
	  return(
	    <Row gutter={ 16 }>
	      <Col className="gutter-row" span={6}>
	        <a href="javascript:void(0);" onClick={ () => { this.showCurStaff(props) } }>详情</a>
	      </Col>
	    </Row>
	  );
	}
      }
    ];
  }

  state = {
    visible: false,
    item: null,//用于存储当前对象
    parData: [],
    loading: false,
  };

  showCurStaff = (props) => {
    this.props.addTab('人员的培训信息', '人员的培训信息', Form.create()(StaffDetailView), props);
  }

  fetchStaffData = (props) => {
    let curTrain = props.item.trainingId;
    let tmp = null;
    $.ajax({
      type: "get",
      url: getStaffTrainingPeopleService,
      data: {
        trainingId: curTrain
      },
      async: false,
      success:function(d){
        tmp = d.data;
      },
      error:function(){
        message.error('获取失败!');
      }
    });
    this.setState({
      parData: tmp
    });
  }

  addTrainee = (props) => {
    this.props.addTab('添加参与人员', '添加参与人员', Form.create()(AddTrainingPeopleView), props);
  }

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
    this.fetchStaffData(this.props);
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

  render(){
    const { visible, item, loading, parData } = this.state;
    const columns = this.columns;

    var standard = this.state.item;
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

    return(
      <div>

        <Form>
          { formItems }
        </Form>

	<Table
	  columns={columns}
	  dataSource={parData}
	  loading={loading}
	/>

        <div>
          <Row gutter={16}>
	    <Col className="gutter-row" span={6}>
	      <Button
	        type="primary"
		onClick={this.showModal}
	      >
	        修改培训信息
	      </Button>
	      <StaffTrainingModifyView
	        ref = {this.saveFormRef}
		visible = {visible}
		defaultVal = {item}
		onCancel = {this.handleCancel}
		onCreate = {this.handleCreate}
	      />
	    </Col>
	    <Col className="gutter-row" span={6}>
	      <Button
	        type="primary"
		onClick={ () => { this.addTrainee(standard) } }
	      >
	        添加参与人员
	      </Button>
	    </Col>
	  </Row>
        </div>

      </div>
    );
  }

});

export default StaffTrainingInspectView;

