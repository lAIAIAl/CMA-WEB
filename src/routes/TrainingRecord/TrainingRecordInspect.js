import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm,Upload, Button, Icon, Table, Form, Input, DatePicker, Modal, Tooltip, AutoComplete, message} from 'antd';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import {getAllRecord} from './TrainingRecordMain';

const FormItem=Form.Item;
const Option=Select.Option;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

class TrainingRecordInspectView extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
      record: this.props.item.record,
      visible:false,
		  fileList: [],
		  uploading: false,
		}
  }

  handleImage = (key) => {
    const url = "http://119.23.38.100:8080/cma/StaffTraining/getFile?trainingId="+key;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  handleModify=()=>{
		const {fileList} = this.state;

    var program = this.props.form.getFieldValue('program');
		var trainingDate = this.props.form.getFieldValue('trainingDate').format('YYYY-MM-DD');
		var place = this.props.form.getFieldValue('place');
		var presenter = this.props.form.getFieldValue('presenter');
		var content = this.props.form.getFieldValue('content');
		var note = this.props.form.getFieldValue('note') || '';

		var formda = new FormData();
    formda.append("trainingId",this.state.record.trainingId);
		formda.append("program", program);
		formda.append("trainingDate", trainingDate);
		formda.append("place", place);
		formda.append("presenter", presenter);
		formda.append("content", content);
		formda.append("note", note);
		fileList.forEach((file) => {
			formda.append("file", file)
		});

		this.setState({
			visible: false,
			uploading: true,
		})

		$.ajax({
			type: "post",
			url: "http://119.23.38.100:8080/cma/StaffTraining/modifyOne",
			data: formda,
			processData: false,
    	contentType: false,
			async: false,
			success: () => {
				message.success("修改成功啦");
				this.setState({
					fileList: []
				})
			},
			error: () => {
				message.error("修改失败哦");
			}
		});

		this.state.record.program=program;
		this.state.record.place=place;
		this.state.record.trainingDate=trainingDate;
		this.state.record.presenter=presenter;
		this.state.record.content=content;
		this.state.record.note=note;

    this.setState({
			uploading: false
		})

		this.props.form.resetFields();

		getAllRecord();
  }

  handleCancel=()=>{
		this.setState({
			visible: false
		})
  }
  showModal=()=>{
		this.setState({
			visible: true
		})
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
		const formItemLayout =
		{
			labelCol: { span:6 },
			wrapperCol: { span:14 },
		};

		const addprops = {
      action: "http://119.23.38.100:8080/cma/StaffTraining/modifyOne",
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
           	fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    }
    
    return (
      <Form>
        <Card key='0' title='培训详情' style={{marginBottom: 20}}>
          <Row key='0'>
            <Col span={12}>
            <FormItem
                 align="left"
              >
              培训项目名称：
              {this.state.record.program}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem
                 align="left"
              >
              培训日期：
              {this.state.record.trainingDate}
            </FormItem>
            </Col>
          </Row>

          <Row key='1'>
            <Col span={12}>
            <FormItem
              align="left"
              >
              培训地点：
              {this.state.record.place}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem
              align="left"
              >
              主讲人：
              {this.state.record.presenter}
            </FormItem>
            </Col>
          </Row>

          <Row key='2'>
            <FormItem
              align="left"
              >
              培训内容：
              {this.state.record.content}
            </FormItem>
          </Row>

          <Row key='3'>
            <FormItem
              align="left"
              >
              备注：
              {this.state.record.note}
            </FormItem>
          </Row>

          <Row key='4'>
            <FormItem
              align="left"
              >
              培训相关文件：
              <a onClick={() => this.handleImage(this.state.record.trainingId)}>查看</a>
            </FormItem>
          </Row>

        </Card>
        <Button className="add" type="primary" onClick={this.showModal}>修改</Button>
            <Modal title="培训信息"  visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
            <Form layout="horizontal">
							<FormItem {...formItemLayout} label="培训项目名称：" hasFeedback>
                {getFieldDecorator('program', {
                  rules: [{required: true, message: 'Please input the program!'}],
                  initialValue: this.state.record.program,
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                    )}
              </FormItem>
              <FormItem {...formItemLayout} label="培训日期：" hasFeedback>
                {getFieldDecorator('trainingDate', {
                  rules: [{required: true, message: 'Please input the trainingDate!'}],
                  })(
                      <DatePicker />
                    )}
              </FormItem>
              <FormItem {...formItemLayout} label="培训地点：" hasFeedback>
                {getFieldDecorator('place', {
                  rules: [{required: true, message: 'Please input the place!'}],
                  initialValue: this.state.record.place,
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                    )}
              </FormItem>
              <FormItem {...formItemLayout} label="主讲人：" hasFeedback>
                {getFieldDecorator('presenter', {
                  rules: [{required: true, message: 'Please input the presenter!'}],
                  initialValue: this.state.record.presenter,
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                    )}
              </FormItem>
              <FormItem {...formItemLayout} label="培训内容：" hasFeedback>
                {getFieldDecorator('content', {
                  rules: [],
                  initialValue:  this.state.record.content,
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                    )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注：" hasFeedback>
                {getFieldDecorator('note', {
                  rules: [],
                  initialValue:  this.state.record.note,
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                    )}
              </FormItem>
            </Form>

						<Form id="upfile">
              培训信息文件：
                <Upload {...addprops}>
                  <Button>
                    <Icon type="upload" /> 添加文件
                  </Button>
                </Upload>
            </Form>

          </Modal>
      </Form>
    );
  }
}
const TrainingRecordInspect = Form.create()(TrainingRecordInspectView);
export default TrainingRecordInspect