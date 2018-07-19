import React, { Component, PropTypes } from 'react';
import { Row, Col, Form, Button, Card, Icon, Input, Table, Divider, Modal, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

import { testCapacityGetAllItemService, testCapacityAddOneItemService, testCapacityDeleteOneItemService } from 'services';

import TestCapacityItemAddView from './TestCapacityItemAddView';
import TestCapacityItemDetailView from './TestCapacityItemDetailView';

const FormItem = Form.Item;

class TestCapacityItemComponent extends React.Component{

  constructor(props){
    super(props);
    this.columns=[
      {
        title: '年份',
	dataIndex: 'year',
	key: 'year',
	sorter: (a,b) => a.year-b.year,
      },
      {
        title: '系统编号',
	dataIndex: 'id',
	key: 'id',
	sorter: (a,b) => a.id-b.id,
      },
      {
        title: '产品名称',
	dataIndex: 'productionName',
	key: 'productionName',
      },
      {
        title: '操作',
	dataIndex: 'operation',
	key: 'operation',
	render:(text,record)=>{
	  let curItem = null;
	  for(var i=this.state.data.length-1;i>=0;i--){
	    if(this.state.data[i].id == record.id)
	      curItem = this.state.data[i];
	  }
	  var props = {
	    item: curItem,//当前产品信息: year,id,productionName,ability,referrence
	  };
	  return(
	    <Row gutter={16}>
	      <Col className="gutter-row" span={6}>
	        <a href="javascript:void(0);" onClick={ () => { this.inspectDetail(props) } }>详情</a>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <Button type="danger" onClick={ () => { this.deleteCur(props) } }>删除</Button>
	      </Col>
	    </Row>
	  );
	}
      }
    ];
  }

  state = {
    data: [],
    loading: false,
    visible: false,
  };

  inspectDetail = (props) => {
    this.props.addTab('产品详情','产品详情',TestCapacityItemDetailView,props);
  }

  deleteCur = (props) => {
    let curId = props.item.id;
    $.ajax({
      type: "post",
      url: testCapacityDeleteOneItemService,
      data: {
        id: curId
      },
      async: false,
      success:function(d){
        message.success('删除成功!');
      }
    });
    this.getAll();
  }

  getAll = () => {
    this.setState({ loading: true });
    let curYear = this.props.item.year;
    console.log('curYear',curYear);
    $.ajax({
      type: "get",
      url: testCapacityGetAllItemService,
      data: {
        year: curYear,
      },
      async: false,
      success:function(d){
        for(var i=d.data.length-1;i>=0;i--){
	  d.data[i].key = d.data[i].id;
	}
        this.setState({
	  data: d.data,
	  loading: false
	});
      }.bind(this)
    });
  }

  componentWillMount(){
    this.getAll();
  }

  /* 新增产品信息 */
  addItemInfo = () => {
    const form = this.form;
    form.validateFields((err,values) => {
      if(err){
        return;
      }
      let tmp = values;
      tmp.year = this.props.item.year;
      $.ajax({
        type: "post",
	url: testCapacityAddOneItemService,
	data: {
	  year: tmp.year,
	  productionName: tmp.productionName,
	  ability: tmp.ability,
	  referrence: tmp.referrence
	},
	async: false,
	success:function(d){
	  message.success('添加成功!');
	}
      });
    });
    form.resetFields();
    this.setState({ visible: false });
    this.getAll();
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
    const { loading } = this.state;
    const columns = this.columns;
    return(
      <div>
        <Table
	  columns = { columns }
	  dataSource = { this.state.data }
	  loading = { this.state.loading }
	  onChange = { this.getAll }
	/>
	<div>
	  <Row gutter={16}>
	    <Col className="gutter-row" span={6}>
	      <Button type="primary" onClick={ this.showModal }>
	        新增
	      </Button>
	      <TestCapacityItemAddView
	        ref = { this.saveFormRef }
		visible = { this.state.visible }
		onCancel = { this.handleCancel }
		onCreate = { this.addItemInfo }
	      />
	    </Col>
	  </Row>
	</div>
      </div>
    );
  }

}

export default TestCapacityItemComponent;
