import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Button, Card, Icon, Upload, Table, Input, Divider, Select, message } from 'antd';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

import { getAllManualHistory } from './FetchHistory';
import { qualityManualUploadService, qualityManualGetCurrentService, qualityManualGetCurrentFileService, qualityManualGetAllHistoryService, qualityManualGetHistoryFileService, qualityManualModifyService, qualityManualApproveService, qualityManualDeleteService } from 'services';

import QSManualAddView from './QSManualAddView';
import QSManualDetailView from './QSManualDetailView';
import QSManualModifyView from './QSManualModifyView';

const FormItem = Form.Item;
const Option = Select.Option;

class QSManualComponent extends React.Component{

  constructor(props){
    super(props);
    this.unsubscribe = getStore().subscribe(this.refreshData);
    this.columns=[
      {
        title: '文件编号',
	dataIndex: 'fileId',
	key: 'fileId',
	sorter: (a,b) => a.fileId-b.fileId,
      },
      {
        title: '文件名',
	dataIndex: 'fileName',
	key: 'fileName',
      },
      {
        title: '最后修改时间',
	dataIndex: 'modifyTime',
	key: 'modifyTime',
	sorter: (a,b) => a.modifyTime-b.modifyTime,
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
  }

  state = {
    data: [],//存放所有历史数据
    item: null,//存放当前版本数据
    loading: false,
  };

  getAllHistory = () => {
    getAllManualHistory();
  }

  getCurrent = () => {
    const addr = qualityManualGetCurrentService;
    $.ajax({
      type: "get",
      url: qualityManualGetCurrentService,
      async: false,
      success:function(d){
        this.setState({
	  item: d.data
	});
      }.bind(this),
      error:function(){
        console.log('地址',addr);
	message.error('Fail to load current version!');
      }
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    this.getCurrent();
    this.getAllHistory();
  }

  refreshData = () => {
    this.setState({
      data: getStore().getState().QSmanual.items
    });
  }

  downloadFile = (props) => {
    let curId = props.item.id;
    const url = qualityManualGetHistoryFileService + "?id=" + curId;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  showDetail = (props) => {
    this.props.addTab('历史详情','历史详情',QSManualDetailView,props);
  }

  deleteHistory = (props) => {
    let curId = props.item.id;
    $.ajax({
      type: "post",
      url: qualityManualDeleteService,
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
    const url = qualityManualGetCurrentFileService;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  addNewManual = () => {
    let props = {
      item: this.state.item
    };
    this.props.addTab('添加质量手册','添加质量手册',QSManualAddView,props);
  }

  modifyManual = () => {
    let props = {
      item: this.state.item
    };
    this.props.addTab('修改质量手册','修改质量手册',QSManualModifyView,props);
  }

  refreshAM = () => {
    this.getCurrent();
    this.getAllHistory();
  }

  handleApprove = (value) => {
    let curId = this.state.item.id;
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
      url: qualityManualApproveService,
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
    console.log('当前版本数据',this.state.item);
    const { loading } = this.state;
    const columns = this.columns;
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
    let curState = null;
    if(curVersion.state == 0){
      curState = '未批准';
    }
    else if(curVersion.state == 1){
      curState = '不通过';
    }
    else if(curVersion.state == 2){
      curState = '已通过';
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
	    <FormItem {...formItemLayout} label="文件状态">
	      { curState }
	    </FormItem>
	  </Row>
	  <Row key='4'>
	    <FormItem {...formItemLayout} label="更新时间">
	      { curVersion.modifyTime }
	    </FormItem>
	  </Row>
	  <Row key='5'>
	    <FormItem {...formItemLayout} label="操作人员">
	      { curVersion.modifier }
	    </FormItem>
	  </Row>
	  <Row key='6'>
	    <FormItem {...formItemLayout} label="日志说明">
	      { curVersion.modifyContent }
	    </FormItem>
	  </Row>
	  <Row key='7'>
	    <FormItem {...formItemLayout} label="修改状态">
	      <Select defaultValue={ curState } style={{ width: '25%' }} onChange={ this.handleApprove }>
		<Option value="未批准" disabled={ curVersion.state == 0 }>未批准</Option>
		<Option value="不通过" disabled={ curVersion.state !== 0 }>不通过</Option>
		<Option value="已通过" disabled={ curVersion.state !== 0 }>已通过</Option>
	      </Select>
	    </FormItem>
	  </Row>
	  <Row key='8' gutter={16}>
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
	  <div>
	    <Row gutter={16}>
	      <Col className="gutter-row" span={6}>
	        <Button type="primary" onClick={ this.addNewManual }>
		  添加
		</Button>
	      </Col>
	      <Col className="gutter-row" span={6}>
	        <Button type="danger" onClick={ this.modifyManual }>
		  修改
		</Button>
	      </Col>
	      <Col className="gutter-row" span={6}>
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

export default QSManualComponent;
