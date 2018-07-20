import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Button, Card, Icon, Upload, Table, Input, Divider, Select, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

import { getAllProgramHistory } from './FetchHistory';
import { qualityProgramUploadService, qualityProgramGetCurrentService, qualityProgramGetCurrentFileService, qualityProgramGetAllHistoryService, qualityProgramGetHistoryFileService, qualityProgramModifyService, qualityProgramApproveService, qualityProgramDeleteService } from 'services';

import QSProgramAddView from './QSProgramAddView';
import QSProgramDetailView from './QSProgramDetailView';
import QSProgramModifyView from './QSProgramModifyView';
import QSProgramMDView from './QSProgramMDView';

const FormItem = Form.Item;
const Option = Select.Option;

class QSProgramComponent extends React.Component{
	
  constructor(props){
    super(props);
    this.unsubscribe = getStore().subscribe(this.refreshData);
    this.columns=[
      {
        title: '文件编号',
	dataIndex: 'fileId',
	key: 'fileId',
	sorter: (a,b) => a.fileId>b.fileId,
      },
      {
        title: '文件名称',
	dataIndex: 'fileName',
	key: 'fileName',
      },
      {
        title: '更新时间',
	dataIndex: 'modifyTime',
	key: 'modifyTime',
	sorter: (a,b) => a.modifyTime>b.modifyTime,
      },
      {
        title: '操作',
	dataIndex: 'operation',
	key: 'operation',
	render:(text,record)=>{
	  let cur = null;
	  for(var i=this.state.data.length-1;i>=0;i--){
	    if(this.state.data[i].id == record.id)
	      cur = this.state.data[i];
	  }
	  var props = {
	    item: cur,//当前的历史版本数据:id,fileId,fileName,state,current,modifyTime,modifier,modifyContent
	  };
	  return(
	    <Row gutter={16}>
	      <Col className="gutter-row" span={6}>
	        <a href="javascript:void(0);" onClick={ () => { this.downloadFile(props) } }>下载</a>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <a href="javascript:void(0);" onClick={ () => { this.showDetail(props) } }>详情</a>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <Button type="danger" onClick={ () => { this.deleteHistory(props) } }>删除</Button>
	      </Col>
	    </Row>
	  );
	}
      }
    ];
    this.rows=[
      {
        title: '文件编号',
	dataIndex: 'fileId',
	key: 'fileId',
	sorter: (a,b) => a.fileId>b.fileId,
      },
      {
        title: '文件名称',
	dataIndex: 'fileName',
	key: 'fileName',
      },
      {
        title: '操作人员',
	dataIndex: 'modifier',
	key: 'modifier',
      },
      {
        title: '操作',
	dataIndex: 'operation',
	key: 'operation',
	width: '40%',
	render:(text,record)=>{
	  let curUn = null;
	  for(var j=this.state.unData.length-1;j>=0;j--){
	    if(this.state.unData[j].id == record.id)
	      curUn = this.state.unData[j];
	  }
	  var unProps = {
	    item: curUn,//当前的未批准数据: id,fileId,fileName,state,current,modifyTime,modifier,modifyContent
	  };
	  return(
	    <Row gutter={16}>
	      <Col className="gutter-row" span={4}>
	        <a href="javascript:void(0);" onClick={ () => { this.inspectUnapprove(unProps) } }>详情</a>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <Select style={{ width:'100%' }} onChange={ (value) => {this.handleApprove(value,unProps)} }>
		  <Option value="未批准" disabled={ curUn.state !== 0 }>未批准</Option>
		  <Option value="不通过" disabled={ curUn.state == 2 }>不通过</Option>
		  <Option value="已通过" disabled={ curUn.state == 1 }>已通过</Option>
		</Select>
	      </Col>
	    </Row>
	  );
	}
      }
    ];
  }

  state = {
    data: [],//存放所有历史数据
    item: null,//存放当前版本数据
    loading: false,
    unData: [],//存放所有未批准数据
    unLoading: false,
  };

  getAllHistory = () => {
    getAllProgramHistory();
  }

  getCurrent = () => {
    const addr = qualityProgramGetCurrentService;
    $.ajax({
      type: "get",
      url: qualityProgramGetCurrentService,
      async: false,
      success:function(d){
        this.setState({
	  item: d.data
	});
      }.bind(this)
    });
  }

  getAllApprove = () => {
    $.ajax({
      type: "get",
      url: "http://119.23.38.100:8080/cma/ProgramFile/getApprove",
      async: false,
      success:function(d){
        for(let i = d.data.length-1; i >= 0; i--){
	  d.data[i].key = d.data[i].id;
	}
        this.setState({
	  unData: d.data
	});
      }.bind(this)
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    this.getCurrent();
    this.getAllHistory();
    this.getAllApprove();
  }

  refreshData = () => {
    this.setState({
      data: getStore().getState().QSprogram.items
    });
  }

  downloadFile = (props) => {
    let curId = props.item.id;
    const url = qualityProgramGetHistoryFileService + "?id=" + curId;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  showDetail = (props) => {
    this.props.addTab('历史详情','历史详情',QSProgramDetailView,props);
  }

  inspectUnapprove = (unProps) => {
    this.props.addTab('修改详情','修改详情',QSProgramMDView,unProps);
  }

  deleteHistory = (props) => {
    let curId = props.item.id;
    $.ajax({
      type: "post",
      url: qualityProgramDeleteService,
      data: {
        id: curId,
      },
      async: false,
      success:function(d){
        message.success('删除成功!');
      }
    });
    this.getAllHistory();
  }

  downloadCurrent = () => {
    const url = qualityProgramGetCurrentFileService;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  addNewManual = () => {
    let props = {
      item: this.state.item
    };
    this.props.addTab('添加程序文件','添加程序文件',QSProgramAddView,props);
  }

  modifyManual = () => {
    let props = {
      item: this.state.item
    };
    this.props.addTab('修改程序文件','修改程序文件',QSProgramModifyView,props);
  }

  refreshAM = () => {
    this.getCurrent();
    this.getAllHistory();
    this.getAllApprove();
  }

  handleApprove = (value,unProps) => {
    console.log('value',value);
    console.log('props',unProps);
    let curId = unProps.item.id;
    let result = value;
    let state = null;
    if(result == '未批准'){
      state = 0;
    }
    else if(result == '不通过'){
      state = 1;
    }
    else if(result == '已通过'){
      state = 2;
    }
    $.ajax({
      type: "post",
      url: qualityProgramApproveService,
      data: {
        id: curId,
	state: state,
      },
      async: false,
      success:function(d){
        message.success("修改成功!");
      }
    });
    let tmp = this.state.item;
    tmp.state = state;
    this.setState({
      item: tmp
    });
  }

  render(){
    const { loading, unLoading } = this.state;
    const columns = this.columns;
    const rows = this.rows;
    const width = '100%';
    let curVersion = {
      id: '0',
      fileId: '0',
      fileName: '未填',
      state: '0',
      modifyTime: '2018-07-01',
      modifier: '未填',
      modifyContent: '内容为空',
    };
    if(this.state.item !== null){
      curVersion = this.state.item;
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return(
      <div>
        <Card key='0' title='当前版本'>
	  <Row key='0'>
	    <FormItem {...formItemLayout} label="系统编号">
	      { curVersion.id }
	    </FormItem>
	  </Row>
	  <Row key='1'>
	    <FormItem {...formItemLayout} label="文件编号">
	      { curVersion.fileId }
	    </FormItem>
	  </Row>
	  <Row key='2'>
	    <FormItem {...formItemLayout} label="文件名称">
	      { curVersion.fileName }
	    </FormItem>
	  </Row>
	  <Row key='3'>
	    <FormItem {...formItemLayout} label="更新时间">
	      { curVersion.modifyTime }
	    </FormItem>
	  </Row>
	  <Row key='4'>
	    <FormItem {...formItemLayout} label="操作人员">
	      { curVersion.modifier }
	    </FormItem>
	  </Row>
	  <Row key='5'>
	    <FormItem {...formItemLayout} label="日志说明">
	      { curVersion.modifyContent }
	    </FormItem>
	  </Row>
	  <Row key='6' gutter={16}>
	    <Col className="gutter-row" span={18}/>
	    <Col className="gutter-row" span={6}>
	      <a href="javascript:void(0);" onClick={ this.downloadCurrent }>下载</a>
	    </Col>
	  </Row>
	</Card>
        <div>
	 <Card key='1' title="历史版本">
	  <Table
	    columns = { columns }
	    dataSource = { this.state.data }
	    loading = { this.state.loading }
	    onChange = { this.refreshData }
	  />
	 </Card>
	 <Card key='2' title="修改版本">
	   <Table
	     columns = { rows }
	     dataSource = { this.state.unData }
	     loading = { this.state.unLoading }
	     onChange = { this.getAllApprove }
	   />
	 </Card>
	  <div>
	    <Row gutter={16}>
	      <Col className="gutter-row" span={4}>
	        <Button type="primary" onClick={ this.addNewManual }>
		  添加
		</Button>
	      </Col>
	      <Col className="gutter-row" span={4}>
	        <Button type="danger" onClick={ this.modifyManual }>
		  修改
		</Button>
	      </Col>
	      <Col className="gutter-row" span={4}>
	        <Button type="dashed" onClick={ this.refreshAM }>
		  刷新
		</Button>
	      </Col>
	    </Row>
	  </div>
	</div>
      </div>
    );
  }

}

export default QSProgramComponent;
