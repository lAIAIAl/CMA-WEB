import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, InputNumber, DatePicker,Button, Divider, Card, Modal, message } from 'antd';

import { getAllPeriodCheckData } from './FetchAllData';
import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';
import { periodCheckGetAllService, periodCheckModifyOneService } from "services";
import RecordInspectView from "./RecordInspectView";
const { MonthPicker, RangePicker } = DatePicker;

/* 子组件 */
import PeriodCheckModifyView from "./PeriodCheckModifyView";

const FormItem = Form.Item;

const PeriodCheckInspectView = Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    this.unsubscribe = getStore().subscribe(this.refreshData);
    this.state = {
        visible: false,
        visible2:false,
        item: null, //当前对象
        recordItem:[],
    };
  }



  refreshData = () => {
    let data = getStore().getState().PeriodCheck.items;
    let curItem = null;
    for(var i = data.length-1; i >= 0; i--){
      if(data[i].planId == this.props.item.planId)
        curItem = data[i];
    }
    this.setState({
      item: curItem,
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    getAllPeriodCheckData();
    this.refreshData();
  }
  handleOperation = () => {
      this.setState({visible2:true});


    }

  handleInspect = () => {
      $.get("http://119.23.38.100:8080/cma/IntermediateChecksRecord/getOneByPlanId?planId="+this.props.item.planId,null,(res)=>{
          let props ={
              item:res.data,
          };
          this.props.addTab("期间核查记录","期间核查记录",RecordInspectView,props);
      });

    }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err,values) => {
      if(err){
        return;
      }
      let tmp = values;
      tmp.planId = this.state.item.planId;
      tmp.checkDate = tmp.checkDate.format("YYYY-MM-DD");
      this.setState({
        item: tmp
      });
      $.ajax({
        type: "post",
	url: periodCheckModifyOneService,
	data: {
	  planId: tmp.planId,
	  object: tmp.object,
	  content: tmp.content,
	  checkDate: tmp.checkDate,
	  personInCharge: tmp.personInCharge,
	},
	async: false,
	success: function(d){
	  message.success("修改成功!");
	}
      });
      form.resetFields();
      this.setState({
        visible: false
      });
      getAllPeriodCheckData();
    });
  }

    handleAdd = () =>{
        const newItem ={
            planId: this.state.item.planId,
            object: this.props.form.getFieldValue('object'),
            checkDate: this.props.form.getFieldValue('checkDate').format('YYYY-MM-DD'),
            processRecord: this.props.form.getFieldValue('processRecord'),
            processRecordPerson: this.props.form.getFieldValue('processRecordPerson'),
            processRecordDate: this.props.form.getFieldValue('processRecordDate').format('YYYY-MM-DD'),
            resultRecord: this.props.form.getFieldValue('resultRecord'),
            resultRecordPerson: this.props.form.getFieldValue('resultRecordPerson'),
            resultRecordDate: this.props.form.getFieldValue('resultRecordDate').format('YYYY-MM-DD'),
            note: this.props.form.getFieldValue('note'),
        };
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/IntermediateChecksRecord/addOne",
            data:newItem,
            async:false,
            success:function (d) {
                alert("执行成功");
                $.get("http://119.23.38.100:8080/cma/IntermediateChecksPlan/getOne?planId="+newItem.planId ,null,(res)=>{
                    res.data.state = 1;
                    $.ajax({
                        type:"post",
                        url:"http://119.23.38.100:8080/cma/IntermediateChecksPlan/modifyOne",
                        data:res.data,
                        async:false,
                        success:function(d){
                        }
                    });
                });



            }
        });
        this.setState({visible2:false});
        this.props.form.resetFields();
    }

  saveFormRef = (form) => {
    this.form = form;
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }
    handleCancel2 = (e) => {
        console.log(e);
        this.setState({
            visible2: false,
        });
    }


    render(){
      const { getFieldDecorator } = this.props.form;
    const { visible, item } = this.state;
    const formItems = [];
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    formItems.push(
      <Card key='0' title='期间核查详情' style={{ marginBottom: 20 }}>
        <Row key='0'>
	  <Col span={ 12 }>
	    <FormItem
	      {...formItemLayout}
	      label="核查编号"
	    >
	      { this.state.item.planId }
	    </FormItem>
	  </Col>
	  <Col span={ 12 }>
	    <FormItem
	      {...formItemLayout}
	      label="核查对象"
	    >
	      { this.state.item.object }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='1'>
	  <Col span={ 12 }>
	    <FormItem
	      {...formItemLayout}
	      label="核查内容"
	    >
	      { this.state.item.content }
	    </FormItem>
	  </Col>
	  <Col span={ 12 }>
	    <FormItem
	      {...formItemLayout}
	      label="核查时间"
	    >
	      { this.state.item.checkDate }
	    </FormItem>
	  </Col>
	</Row>
	<Row key='2'>
	  <Col span={ 12 }>
	    <FormItem
	      {...formItemLayout}
	      label="负责人员"
	    >
	      { this.state.item.personInCharge }
	    </FormItem>
	  </Col>
	  <Col span={ 12 }>
	    <FormItem
	      {...formItemLayout}
	      label="核查状态"
	    >
	      { this.state.item.state }
	    </FormItem>
	  </Col>
	</Row>
      </Card>
    );

    return(
      <div>

        <Form>
	  { formItems }
	</Form>

	<Row gutter={ 16 }>
	  <Col className="gutter-row" span={ 6 }>
	    <Button type="primary" onClick={ this.showModal }>
	      修改期间核查计划
	    </Button>
	    <PeriodCheckModifyView
	      ref={ this.saveFormRef }
	      visible={ this.state.visible }
	      defaultVal={ this.state.item }
	      onCancel={ this.handleCancel }
	      onCreate={ this.handleCreate }
	    />
	  </Col>
        <Col className="gutter-row" span={ 6 }>
            <Button
                type="primary"
                disabled={ this.state.item.state == 1 }
                onClick={ this.handleOperation }
            >
                执行
            </Button>
        </Col>
        <Col className="gutter-row" span={ 6 }>
            <Button
                type="primary"
                disabled={ this.state.item.state == 0 }
                onClick={ this.handleInspect }
            >
                查看
            </Button>
        </Col>
	</Row>
          <Modal title="期间核查记录" visible={this.state.visible2} onOk={this.handleAdd}
                 onCancel={this.handleCancel2}>
              <Form layout="horizontal">
                  <FormItem {...formItemLayout} label="核查对象:" hasFeedback>
                      {
                          getFieldDecorator('object', {
                              rules: [{required: true, message: '请输入对象名称！'}],
                          })
                          (<Input style={{width: 100, offset: 4}}/>)
                      }
                  </FormItem>
                  <FormItem {...formItemLayout} label="核查时间:" hasFeedback>
                      {getFieldDecorator('checkDate', {
                          rules: [{required: true, message: '请输入核查时间!'}],
                      })(
                          <DatePicker format="YYYY-MM-DD"/>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="核查过程记录人:" hasFeedback>
                      {
                          getFieldDecorator('processRecordPerson', {
                              rules: [{required: true, message: '请输入记录人名称！'}],
                          })
                          (<Input style={{width: 100, offset: 4}}/>)
                      }
                  </FormItem>
                  <FormItem {...formItemLayout} label="核查过程记录时间:" hasFeedback>
                      {getFieldDecorator('processRecordDate', {
                          rules: [{required: true, message: '请输入核查时间!'}],
                      })(
                          <DatePicker format="YYYY-MM-DD"/>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="核查过程记录:" hasFeedback>
                      {
                          getFieldDecorator('processRecord', {
                              rules: [{required: true, message: '请输入记录！'}],
                          })
                          (<Input style={{width: 200, offset: 4}}/>)
                      }
                  </FormItem>
                  <FormItem {...formItemLayout} label="核查结论记录人:" hasFeedback>
                      {
                          getFieldDecorator('resultRecordPerson', {
                              rules: [{required: true, message: '请输入记录人！'}],
                          })
                          (<Input style={{width: 100, offset: 4}}/>)
                      }
                  </FormItem>
                  <FormItem {...formItemLayout} label="核查结论记录时间:" hasFeedback>
                      {getFieldDecorator('resultRecordDate', {
                          rules: [{required: true, message: '请输入记录时间!'}],
                      })(
                          <DatePicker format="YYYY-MM-DD"/>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="核查结论记录:" hasFeedback>
                      {
                          getFieldDecorator('resultRecord', {
                              rules: [{required: true, message: '请输入记录！'}],
                          })
                          (<Input style={{width: 200, offset: 4}}/>)
                      }
                  </FormItem>
                  <FormItem {...formItemLayout} label="备注:" hasFeedback>
                      {
                          getFieldDecorator('note', {
                              rules: [{required: false, message: '请输入备注！'}],
                          })
                          (<Input style={{width: 200, offset: 4}}/>)
                      }
                  </FormItem>
              </Form>
          </Modal>

      </div>
    );
  }

});

export default PeriodCheckInspectView;
