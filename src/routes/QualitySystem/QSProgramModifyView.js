import React, { Component, PropTypes } from 'react';
import { Alert, Button, Divider, Form, Input, Row, Col, Upload, Icon, DatePicker, Card, message } from 'antd';

import { qualityProgramModifyService } from 'services';

import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { getAllProgramHistory } from './FetchHistory';

const FormItem = Form.Item;

const QSProgramModifyView = Form.create()(class extends React.Component{

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
      let curId = this.props.item.id;
      let tmp = values;
      tmp.id = curId;
      console.log('用户修改后的数据',tmp);
      const tmpUrl = qualityProgramModifyService;
      console.log('请求的地址',tmpUrl);
      tmp.modifyTime = tmp.modifyTime.format("YYYY-MM-DD");
      tmp.file = fileList[0];
      const formData = new FormData();
      formData.append('id',tmp.id);
      formData.append('file',fileList[0]);
      formData.append('fileId',tmp.fileId);
      formData.append('fileName',tmp.fileName);
      formData.append('modifyTime',tmp.modifyTime);
      formData.append('modifier',tmp.modifier);
      formData.append('modifyContent',tmp.modifyContent);
      $.ajax({
        type: "post",
	url: qualityProgramModifyService,
	data: formData,
	processData: false,
	contentType: false,
	async: false,
	success:function(d){
	  message.success('修改成功!');
	}
      });
      getAllProgramHistory();
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const width = '50%';
    const formItemLayout = {
      labelCol:{ span: 3 },
      wrapperCol: { span: 19 },
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
       <Alert
         message="友情提醒：利用此页面，您可以修改程序文件当前版本的内容，请谨慎操作!"
	 type="warning"
	 closable
       />
       <Card key='0' title='程序文件--修改'>
        <Form layout="vertical" onSubmit={ this.handleSubmit }>
	  <FormItem {...formItemLayout} label="系统编号:">
	    { defaultVal.id }
	  </FormItem>
	  <FormItem {...formItemLayout} label="文件编号:">
	    {getFieldDecorator('fileId',{ initialValue: defaultVal.fileId, rules: [{ required: true, message: '文件编号必填' }], })
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="文件名称:">
	    {getFieldDecorator('fileName',{ initialValue: defaultVal.fileName, rules: [{ required: true, message: '文件名称必填' }],})
	    (<Input style={{ width:width }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="更新时间:">
	    {getFieldDecorator('modifyTime',{ rules: [{ required: true, message: '更新时间必填' }], })
	    (<DatePicker style={{ width:'25%' }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="操作人员:">
	    {getFieldDecorator('modifier',{ initialValue: defaultVal.modifier, rules: [{ required: true, message: '修改人员必填' }],})
	    (<Input style={{ width:'25%' }}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="日志说明:">
	    {getFieldDecorator('modifyContent',{ initialValue: defaultVal.modifyContent, rules: [{ required: true, message: '日志说明必填' }], })
	    (<Input type="textarea" rows={5}/>)}
	  </FormItem>
	  <FormItem {...formItemLayout} label="文件上传:">
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

export default QSProgramModifyView;
