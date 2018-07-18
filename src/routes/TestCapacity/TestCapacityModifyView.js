import React, { Component, PropTypes } from 'react';
import { Button, Divider, Form, Input, Row, Col, Upload, Icon, message } from 'antd';

import { testCapacityModifyOneService } from 'services';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllTestCapacities } from './FetchAllCapacities';

const FormItem = Form.Item;

const TestCapacityModifyView = Form.create()(class extends React.Component{

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
      let addr = testCapacityModifyOneService;
      console.log('modifyOne接口',addr);
      let tmp = values;
      tmp.file = fileList[0];
      tmp.year = this.props.item.year;
      console.log(tmp);
      const formData = new FormData();
      formData.append('year',tmp.year);
      formData.append('fileName',tmp.fileName);
      formData.append('file',fileList[0]);
      console.log(formData);
      $.ajax({
        type: "post",
	url: testCapacityModifyOneService,
	data: formData,
	processData: false,
	contentType: false,
	async: false,
	success:function(d){
	  message.success("修改成功!");
	}
      });
      this.props.form.resetFields();
      getAllTestCapacities();
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const width = '100%';
    const formItemLayout = {
      labelCol:{
        xs: { span: 24 },
	sm: { span: 8 },
      },
      wrapperCol:{
        xs: { span: 24 },
	sm: { span: 16 },
      },
    };
    const defaultVal = this.props.item;
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
      beforeUpload:(file)=>{
        this.setState(({ fileList }) => ({
	  fileList: [file],
	}));
	return false;
      },
      fileList: this.state.fileList,
    };
    return(
      <div>
        <Form layout="vertical" onSubmit={ this.handleSubmit }>
	  <FormItem {...formItemLayout} label="年份">
	    { defaultVal.year }
	  </FormItem>
	  <FormItem {...formItemLayout} label="文件名">
	    {getFieldDecorator('fileName',{initialValue: defaultVal.fileName,})
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="上传文件">
	    {getFieldDecorator('file',)
	    (
	      <Upload {...props}>
	        <Button>
		  <Icon type="upload"/>上传文件
		</Button>
	      </Upload>
	    )}
	  </FormItem>
	  <FormItem>
	    <Button
	      type="primary"
	      htmlType="submit"
	    >
	      提交
	    </Button>
	  </FormItem>
	</Form>
      </div>
    );
  }

});

export default TestCapacityModifyView;
