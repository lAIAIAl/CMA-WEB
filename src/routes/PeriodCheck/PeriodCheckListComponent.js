/* 资源库 */
import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, AutoComplete, message } from 'antd';

/* 前后端交互 */
import $ from 'lib/jquery-3.3.1';
import ItemContainer from 'common/basic/containers/ItemContainer';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllPeriodCheckData } from './FetchAllData';
import { periodCheckGetAllService, periodCheckAddOneService, periodCheckDeleteOneService, periodCheckGetOneService } from "services";

/* 子组件 */
import PeriodCheckInspectView from "./PeriodCheckInspectView";
import PeriodCheckAddView from "./PeriodCheckAddView";
import PeriodCheckGetOneView from "./PeriodCheckGetOneView";

const FormItem = Form.Item;

const PeriodCheckListComponent = Form.create()(class extends React.Component{

  constructor(props){
    super(props);

    this.unsubscribe = getStore().subscribe(this.refreshData);

    this.inspectViewTabName = '期间核查详情';
    this.inspectView = PeriodCheckInspectView;

    this.showGetOneViewTabName = '单个期间核查';
    this.showGetOneView = PeriodCheckGetOneView;

    this.columns = [
      {
        title: '核查编号',
	dataIndex: 'planId',
	key: 'planId',
	sorter: (a,b) => a.planId-b.planId,
      },
      {
        title: '核查对象',
	dataIndex: 'object',
	key: 'object',
      },
      {
        title: '核查日期',
	dataIndex: 'checkDate',
	key: 'checkDate',
      },
      {
        title: '操作',
	dataIndex: 'operation',
	key: 'operation',
	render:(text,record)=>{

	  var props = {
	    item: record,
	  };

	  return(
	    <Row gutter={16}>
	      <Col className="gutter-row" span={6}>
	        <a href="javascript:void(0);" onClick={ () => { this.showCurRowMessage(props) } }>详情</a>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <Button type="danger" onClick={ () => { this.deleteCurRow(props) } }>删除</Button>
	      </Col>
	    </Row>
	  );

	}
      }
    ];
  }

  state = {
    data: [],//存放后端数据
    loading: false,
    visible: false,
  };

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    this.getAll();
  }

  /* 使用redux同步数据 */
  refreshData = () => {
    this.setState({
      data: getStore().getState().PeriodCheck.items
    });
  }

  getAll = () => {
    getAllPeriodCheckData();
  }

  showCurRowMessage = (props) => {
    this.props.addTab(this.inspectViewTabName,this.inspectViewTabName,Form.create()(this.inspectView),props);
  }

  deleteCurRow = (props) => {
    let curId = props.item.planId;
    $.ajax({
      type: "post",
      url: periodCheckDeleteOneService,
      data: {
        planId: curId
      },
      async:false,
      success:function(d){
        message.success('删除成功!');
      }
    });
    getAllPeriodCheckData();
  }

  addNewCheckRecord = () => {
    const form = this.form;
    form.validateFields((err,values) => {
      if(err){
        return;
      }
      let tmp = values;
      tmp.checkDate = tmp.checkDate.format("YYYY-MM-DD");
      $.ajax({
        type: "post",
	url: periodCheckAddOneService,
	data: {
	  object: tmp.object,
	  content: tmp.content,
	  checkDate: tmp.checkDate,
	  personInCharge: tmp.personInCharge,
	},
	async: false,
	success: function(d){
	  console.log("addOne",d.code);
	  message.success("添加成功!");
	},
	error: function(){
	  message.error("添加失败!");
	}
      });
      form.resetFields();
      this.setState({
        visible: false
      });
      getAllPeriodCheckData();
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  showGetOne = (props) => {
    this.props.addTab(this.showGetOneViewTabName,this.showGetOneViewTabName,Form.create()(this.showGetOneView),props);
  }

  handleSearch = (e) => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err,values) => {
      if(err){
        return;
      }
      let tmp = values;
      let url = periodCheckGetOneService + '?planId=' + tmp.planId;
      let obtainData = null;
      $.ajax({
        type: "get",
	url: url,
	data: {
	  planId: tmp.planId,
	},
	async: false,
	success:function(d){
	  obtainData = d.data;
	},
	error:function(){
	  error.message('不存在此期间核查计划!');
	}
      });
      var props = {
        planId: tmp.planId,
	obData: obtainData,
      };
      this.showGetOne(props);
      form.resetFields();
    });
  }

  getFields(){
    const { getFieldDecorator } = this.props.form;
    const children = [];
    children.push(
      <FormItem
        key = '0'
        label='查看单个核查计划'
      >
        {getFieldDecorator('planId',{ rules: [{ required: true, message: '核查计划编号必填' }], })
	(<InputNumber/>)}
      </FormItem>
    );
    return children;
  }

  render(){
    const { loading } = this.state;
    const columns = this.columns;
    return(
      <div>
        <Table
	  columns={columns}
	  dataSource={this.state.data}
	  loading={this.state.loading}
	  onChange={this.refershData}
	/>
	<div>
	  <Row gutter={ 16 }>
	    <Col className="gutter-row" span={6}>
	      <Button type="danger" onClick={ this.showModal }>
	        新增
	      </Button>
	      <PeriodCheckAddView
	        ref={ this.saveFormRef }
		visible={ this.state.visible }
		onCancel={ this.handleCancel }
		onCreate={ this.addNewCheckRecord }
	      />
	    </Col>
	  </Row>
	  <br/>
	  <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
	    <Row>{this.getFields()}</Row>
	    <Row>
	      <Col style={{ textAlign: 'center' }}>
	        <Button type="primary" htmlType="submit">查询</Button>
	      </Col>
	    </Row>
	  </Form>
	</div>
      </div>
    );
  }

});

export default PeriodCheckListComponent;
