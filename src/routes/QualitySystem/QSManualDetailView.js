import React, { Component, PropTypes } from 'react';
import { Form, Table, Row, Col, Card, Divider, message } from 'antd';

const FormItem = Form.Item;

const QSManualDetailView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    const tmp = this.props.item;
    let state = null;
    if(tmp.state == 0){
      state = '未批准';
    }
    else if(tmp.state == 1){
      state = '不通过';
    }
    else if(tmp.state == 2){
      state = '已通过';
    }
    let ver = null;
    if(tmp.current == 0){
      ver = '历史版本';
    }
    else if(tmp.current == 1){
      ver = '最新版本';
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return(
      <div>
        <Card key='0' title='查看选中的历史记录'>
	 <Row key='0'>
	  <FormItem {...formItemLayout} label="系统编号">
	    { tmp.id }
	  </FormItem>
	 </Row>
	 <Row key='1'>
	  <FormItem {...formItemLayout} label="文件编号">
	    { tmp.fileId }
	  </FormItem>
	 </Row>
	 <Row key='2'>
	  <FormItem {...formItemLayout} label="文件名称">
	    { tmp.fileName }
	  </FormItem>
	 </Row>
	 <Row key='3'>
	  <FormItem {...formItemLayout} label="文件状态">
	    { state }
	  </FormItem>
	 </Row>
	 <Row key='4'>
	  <FormItem {...formItemLayout} label="版本信息">
	    { ver }
	  </FormItem>
	 </Row>
	 <Row key='5'>
	  <FormItem {...formItemLayout} label="更新时间">
	    { tmp.modifyTime }
	  </FormItem>
	 </Row>
	 <Row key='6'>
	  <FormItem {...formItemLayout} label="操作人员">
	    { tmp.modifier }
	  </FormItem>
	 </Row>
	 <Row key='7'>
	  <FormItem {...formItemLayout} label="日志说明">
	    { tmp.modifyContent }
	  </FormItem>
	 </Row>
        </Card>
      </div>
    );
  }

});

export default QSManualDetailView;
