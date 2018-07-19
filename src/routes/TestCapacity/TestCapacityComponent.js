import React, { Component, PropTypes } from 'react';
import { Row, Col, Form, Button, Card, Icon, Input, Table, DatePicker, Divider, Modal, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

import { getAllTestCapacities } from './FetchAllCapacities';
import { testCapacityGetAllService, testCapacityAddOneService, testCapacityModifyOneService, testCapacityGetAnnexService, testCapacityGetAllItemService, testCapacityAddOneItemService, testCapacityDeleteOneItemService } from 'services';

import TestCapacityAddView from './TestCapacityAddView';
import TestCapacityModifyView from './TestCapacityModifyView';
import TestCapacityItemComponent from './TestCapacityItemComponent';

const FormItem = Form.Item;

class TestCapacityComponent extends React.Component{

  constructor(props){
    super(props);
    this.unsubscribe = getStore().subscribe(this.refreshData);
    this.columns=[
      {
        title: '年份',
	dataIndex: 'year',
	key: 'year',
	sorter: (a,b) => a.year-b.year,
      },
      {
        title: '文件名',
	dataIndex: 'fileName',
	key: 'fileName',
      },
      {
        title: '操作',
	dataIndex: 'operation',
	key: 'operation',
	render:(text,record)=>{
	  let curYear = null;
	  for(var i=this.state.data.length-1;i>=0;i--){
	    if(this.state.data[i].year == record.year)
	      curYear = this.state.data[i];
	  }
	  var props = {
	    item: curYear, //当前年份的数据:year,fileName
	  };
	  return(
	    <Row gutter={16}>
	      <Col className="gutter-row" span={6}>
	        <a href="javascript:void(0);" onClick={ () => { this.downloadFile(props) } }>下载</a>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <Button type="danger" onClick={ () => { this.modifyCur(props) } }>修改</Button>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <a href="javascript:void(0);" onClick={ () => { this.itemInfo(props) } }>产品信息</a>
	      </Col>
	    </Row>
	  );
	}
      }
    ];
  }

  state={
    data: [], //所有年份的数据
    loading: false,
  };

  getAll = () => {
    getAllTestCapacities();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillMount() {
    this.getAll();
  }

  /* 同步数据 */
  refreshData = () => {
    this.setState({
      data: getStore().getState().TestCapacity.items
    });
  }

  /* 下载当前年份的附件 */
  downloadFile = (props) => {
    let curYear = props.item.year;
    const url = testCapacityGetAnnexService + "?year=" + curYear;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  /* 修改当前年份数据 */
  modifyCur = (props) => {
    this.props.addTab('修改年度信息','修改年度信息',TestCapacityModifyView,props);
  }

  /* 当前年份产品信息 */
  itemInfo = (props) => {
    this.props.addTab('产品信息','产品信息',TestCapacityItemComponent,props);
  }

  /* 新增年度信息 */
  addAnnual = () => {
    this.props.addTab('新增年度信息','新增年度信息',TestCapacityAddView,null);
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
	  onChange = { this.refreshData }
	/>
	<div>
	  <Row gutter={16}>
	    <Col className="gutter-row" span={6}>
	      <Button type="danger" onClick={ this.addAnnual }>
	        新增
	      </Button>
	    </Col>
	  </Row>
	</div>
      </div>
    );
  }

}

export default TestCapacityComponent;
