import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, DatePicker, Modal, Tooltip, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';

const FormItem=Form.Item;
const Option=Select.Option;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

class AnnualTrainingPlanInspectView extends React.Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
      record: this.props.item.record,
      isApproved: this.props.item.isApproved,
      visible: false,
      notevisible: false,
		}
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }
  onOk = () => {
    this.setState({
      visible: false
    })
  }

  showNote = () => {
    this.setState({
      notevisible: true
    })
  }
  onNoteOk = () => {
    this.setState({
      notevisible: false
    })
  }

  modifyOne = () =>{
    const time = parseInt(this.props.form.getFieldValue('trainingTime'));
    var starttime = null;
    if(this.props.form.getFieldValue('startTime') != null)
      starttime = this.props.form.getFieldValue('startTime').format('YYYY-MM-DD');
    var endtime = null;
    if(this.props.form.getFieldValue('endTime') != null)
      starttime = this.props.form.getFieldValue('endTime').format('YYYY-MM-DD');

    const newapp = {
      planId: this.state.record.planId,
      trainProject: this.props.form.getFieldValue('trainProject'),
      people: this.props.form.getFieldValue('people'),
      method: this.props.form.getFieldValue('method'),
      trainingTime: time,//this.props.form.getFieldValue('trainingTime'),
      startTime: starttime,
      endTime: endtime,
      note: this.props.form.getFieldValue('note') || '',
    }
    //console.log(newapp);

    $.ajax({
      type: "post",
      url: "http://119.23.38.100:8080/cma/AnnualTrainingPlan/modifyOne",
      data: newapp,
      async: false,
      success: () => {
        message.success("修改成功啦");
      },
      error: () => {
        message.error("修改失败哦");
      }
    });

    this.setState({
      visible: false
    })
    console.log(newapp);

    this.refresh();
    this.props.form.resetFields();
  }

  refresh = () => {
    $.get("http://119.23.38.100:8080/cma/AnnualTrainingPlan/getOne?planId="+this.state.record.planId, null,(res) =>{
      this.setState({
        record: res.data
      })
      console.log(this.state.record);
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form>
        <FormItem>
          <Button
            type="primary"
            icon="sync"
            onClick={this.refresh}>
            刷新
          </Button>
        </FormItem>
        
        <Card key='0' title='培训详情' style={{marginBottom: 20}}>
          <Row key='0'>
            <Col span={12}>
              <FormItem
                align="left"
                >
                  培训项目：
                  {this.state.record.trainProject}
              </FormItem>
            </Col>
          </Row>
          <Row key='1'>
            <Col span={12}>
              <FormItem
                align="left"
                >
                  培训对象：
                  {this.state.record.people}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                align="left"
                >
                  培训方式：
                  {this.state.record.method}
              </FormItem>
            </Col>
          </Row>
          <Row key='2'>
            <Col span={12}>
              <FormItem
                align="left"
                >
                  培训课时：
                  {this.state.record.trainingTime}
              </FormItem>
            </Col>
          </Row>
          <Row key='3'>
            <Col span={12}>
              <FormItem
                align="left"
                >
                  培训开始时间：
                  {this.state.record.startTime}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                align="left"
                >
                  培训结束时间：
                  {this.state.record.endTime}
              </FormItem>
            </Col>
          </Row>
          <Row key='4'>
            <Col span={12}>
              <FormItem
                align="left"
                >
                  备注：
                  <a onClick={this.showNote}>查看</a>
                  <Modal
                    title="备注"
                    visible={this.state.notevisible}
                    onOk={this.onNoteOk}
                    onCancel={this.onNoteOk}>
                    {this.state.record.note}
                  </Modal>
              </FormItem>
            </Col>
          </Row>
        </Card>

        <FormItem>
          <Button
            type="primary"
            disabled={this.state.isApproved}
            onClick={this.showModal}
            >
            编辑
          </Button>
          <Modal
            title="修改培训"
            visible={this.state.visible}
            onOk={this.modifyOne}
            onCancel={this.onOk}>

            <Form layout="horizontal">
              <FormItem {...formItemLayout } label="培训项目：" hasFeedback>
                {getFieldDecorator('trainProject', {
                    rules: [],
                    initialValue: this.state.record.trainProject,
                  })(
                    <Input style ={{width: 100,offset:4}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout } label="培训对象：" hasFeedback>
                {getFieldDecorator('people', {
                    rules: [],
                    initialValue: this.state.record.people,
                  })(
                    <Input style ={{width: 100,offset:4}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout } label="培训方式：" hasFeedback>
                {getFieldDecorator('method', {
                    rules: [],
                    initialValue: this.state.record.method,
                  })(
                    <Input style ={{width: 100,offset:4}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout } label="培训课时：" hasFeedback>
                {getFieldDecorator('trainingTime', {
                    rules: [],
                    initialValue: this.state.record.trainingTime,
                  })(
                    <Input style ={{width: 100,offset:4}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout } label="培训开始时间：" hasFeedback>
                {getFieldDecorator('startTime', {
                    rules: [],
                  })(
                    <DatePicker />
                )}
              </FormItem>
              <FormItem {...formItemLayout } label="培训结束时间：" hasFeedback>
                {getFieldDecorator('endTime', {
                    rules: [],
                  })(
                    <DatePicker />
                )}
              </FormItem>
              <FormItem {...formItemLayout } label="备注：" hasFeedback>
                {getFieldDecorator('note', {
                    rules: [],
                    initialValue: this.state.record.note,
                  })(
                    <Input style ={{width: 100,offset:4}}/>
                )}
              </FormItem>
            </Form>

          </Modal>
        </FormItem>
      </Form>
    );
  }
}
const AnnualTrainingPlanInspect = Form.create()(AnnualTrainingPlanInspectView);
export default AnnualTrainingPlanInspect