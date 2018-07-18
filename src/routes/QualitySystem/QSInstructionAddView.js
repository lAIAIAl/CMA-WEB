import React, { Component, PropTypes } from 'react';
import { Alert, Button, Card, Divider, Form, Input, Row, Col, Upload, Icon, Select, DatePicker, message } from 'antd';

import { qualityInstructionUploadService } from 'services';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllInstructionHistory } from './FetchHistory';

const FormItem = Form.Item;
const Option = Select.Option;

const QSInstructionAddView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
  }

  state = {
    fileList: [],
    uploading: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(err){
        return;
      }
      const { fileList } = this.state;
      let inhItem = this.props.item;
      console.log('传给新增的参数',inhItem);
      let tmp = values;
      let jdg = null;
      if(tmp.state == '未批准'){
        jdg = 0;
      }
      else if(tmp.state == '不通过'){
        jdg = 1;
      }
      else if(tmp.state == '已通过'){
        jdg = 2;
      }
      let ver = null;
      if(inhItem == null){
        ver = 1;
      }
      else{
        ver = 0;
      }
      tmp.modifyTime = tmp.modifyTime.format("YYYY-MM-DD");
      tmp.file = fileList[0];
      const formData = new FormData();
      formData.append('file',fileList[0]);
      formData.append('fileId',tmp.fileId);
      formData.append('fileName',tmp.fileName);
      formData.append('state',jdg);
      formData.append('current',ver);
      formData.append('modifyTime',tmp.modifyTime);
      formData.append('modifier',tmp.modifier);
      formData.append('modifyContent',tmp.modifyContent);
      $.ajax({
        type: "post",
	url: qualityInstructionUploadService,
	data: formData,
	processData: false,
	contentType: false,
	async: false,
	success:function(d){
	  message.success('添加成功!');
	}
      });
      this.props.form.resetFields();
      getAllInstructionHistory();
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const width = '50%';
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 19 },
    };
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove:(file)=>{
        this.setState(({ fileList }) => {
	  const index = fileList.indexOf(file);
	  const newFileList = fileList.slice();
	  newFileList.splice(index,1);
	  return{
	    fileList: newFileList,
	  };
	});
      },
      beforeUpload:(file) => {
        this.setState(({ fileList }) => ({
	  fileList: [file],
	}));
	return false;
      },
      fileList: this.state.fileList,
    };
    return(
      <div>
       <Alert
         message="友情提醒：利用此页面，您可以补录作业指导书的历史版本，也可以在当前版本为空时添加作业指导书的最新版本，请谨慎操作!"
	 type="warning"
	 closable
       />
       <Card key='0' title='作业指导书--添加'>
        <Form layout="vertical" onSubmit={ this.handleSubmit }>
	  <FormItem {...formItemLayout} label="文件编号:">
	    {getFieldDecorator('fileId',{ rules: [{ required: true, message: '文件编号必填' }], })
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="文件名称:">
	    {getFieldDecorator('fileName',{ rules: [{ required: true, message: '文件名必填' }], })
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="文件状态:">
	    {getFieldDecorator('state',{ rules: [{ required: true, message: '状态必填' }], })
	    (
	      <Select style={{ width:'25%' }}>
	        <Option value="未批准">未批准</Option>
	        <Option value="不通过">不通过</Option>
	        <Option value="已通过">已通过</Option>
	      </Select>
	    )}
	  </FormItem>
	  <FormItem {...formItemLayout} label="更新时间:">
	    {getFieldDecorator('modifyTime',{ rules: [{ required: true, message: '更新时间必填' }], })
	    (<DatePicker style={{ width:'25%' }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="操作人员:">
	    {getFieldDecorator('modifier',{ rules: [{ required: true, message: '操作人员必填' }], })
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="添加内容:">
	    {getFieldDecorator('modifyContent',)
	    (<Input type="textarea" rows={5}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="上传文件:">
	    {getFieldDecorator('file',{ rules: [{ required: true, message: '文件必须上传' }], })
	    (
	      <Upload {...props}>
	        <Button>
		  <Icon type="upload"/>上传文件
		</Button>
	      </Upload>
	    )}
	  </FormItem>
	  <FormItem>
	   <Row gutter={16}>
	    <Col className="gutter-row" span={18}/>
	    <Col className="gutter-row" span={6}>
	    <Button
	      type="primary"
	      htmlType="submit"
	    >
	      提交
	    </Button>
	    </Col>
	   </Row>
	  </FormItem>
	</Form>
       </Card>
      </div>
    );
  }

});

export default QSInstructionAddView;
