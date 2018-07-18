import React, { Component, PropTypes } from 'react';
import { Button, Divider, Form, Input, Row, Col, Upload, Icon, message } from 'antd';

import { testCapacityAddOneService } from 'services';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllTestCapacities } from './FetchAllCapacities';

const FormItem = Form.Item;

const TestCapacityAddView = Form.create()(class extends React.Component{

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
      let tmp = values;
      let addr = testCapacityAddOneService;
      console.log('addOne接口',testCapacityAddOneService);
      tmp.file = fileList[0];
      console.log(tmp);
      const formData = new FormData();
      formData.append('year',tmp.year);
      formData.append('fileName',tmp.fileName);
      formData.append('file',fileList[0]);
      console.log(formData);

      $.ajax({
        type: "post",
	url: testCapacityAddOneService,
	data: formData,
	processData: false,
	contentType: false,
	async: false,
	success:function(d){
	  message.success("添加成功!");
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
        xs: { span:24 },
	sm: { span:8 },
      },
      wrapperCol:{
        xs: { span:24 },
	sm: { span:16 },
      },
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
      beforeUpload:(file)=>{
        this.setState(({ fileList })=>({
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
	    {getFieldDecorator('year',{ rules: [{ required: true, message: '年份必填' }], })
	    (<Input/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="文件名">
	    {getFieldDecorator('fileName',{ rules: [{ required: true, message: '文件名必填' }], })
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="上传文件">
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

export default TestCapacityAddView;
