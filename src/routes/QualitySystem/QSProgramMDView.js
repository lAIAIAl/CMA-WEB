import React, { Component, PropTypes } from 'react';
import { Form, Table, Row, Col, Card, Divider, message } from 'antd';

const FormItem = Form.Item;

const QSProgramMDView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    const tmp = this.props.item;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return(
      <div>
        <Card key='0' title='查看选中的修改版本'>
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
	    <FormItem {...formItemLayout} label="更新时间">
	      { tmp.modifyTime }
	    </FormItem>
	  </Row>
	  <Row key='4'>
	    <FormItem {...formItemLayout} label="操作人员">
	      { tmp.modifier }
	    </FormItem>
	  </Row>
	  <Row key='5'>
	    <FormItem {...formItemLayout} label="修改内容"> 
	      { tmp.modifyContent }
	    </FormItem>
	  </Row>
	</Card>
      </div>
    );
  }

});

export default QSProgramMDView;
