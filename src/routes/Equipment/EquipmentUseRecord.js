import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Select, DatePicker, TimePicker, Button, Icon, Table, Form, Input, Modal, AutoComplete, message, Radio} from 'antd';

import $ from 'lib/jquery-3.3.1';
import EquipmentUseRecordInspect from './EquipmentUseRecordInspect'
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

const FormItem=Form.Item;
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
//style
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

export const getAllRecord = () =>{
  $.get("http://119.23.38.100:8080/cma/EquipmentUse/getAll" , null,(res)=>{
      let data = res.data;
      for (var i = data.length - 1; i >= 0; i--) {
        data[i].key = data[i].id;
      }
      let store = getStore();
    store.dispatch(setItems(data, 'EquipmentUseRecord'));
    });
}

class EquipmentUseRecordView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      allPlan: [],
      allEquip: [],
    }
  }

  handleAddTab = (props) => {
    this.props.addTab("设备使用信息", "设备使用信息", EquipmentUseRecordInspect, props);
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleSelectChange = () =>{
    console.log("selected");
  }

  handleSearch = () => {
    const eid = this.props.form.getFieldValue('sid');
    $.get("http://119.23.38.100:8080/cma/EquipmentUse/getAllByEquipmentId?equipmentId="+eid, null,(res) =>{
      let temp = res.data;
      for(var j = this.state.allEquip.length-1; j >= 0; j--)
        if(this.state.allEquip[j].id == eid) {
          for(var i = temp.length-1; i >= 0; i--)
            temp[i].name = this.state.allEquip[j].name;
          break;
        }
      this.setState({
        allPlan: temp
      })
    })
  }

  addOne = () => {
    const newapp = {
      equipmentId: this.props.form.getFieldValue('equipmentId'),
      useDate: this.props.form.getFieldValue('useDate').format('YYYY-MM-DD'),
      openDate: this.props.form.getFieldValue('openDate').format('HH:mm:ss'),
      closeDate: this.props.form.getFieldValue('closeDate').format('HH:mm:ss'),
      sampleNumber: this.props.form.getFieldValue('sampleNumber'),
      testProject: this.props.form.getFieldValue('testProject'),
      beforeUse: this.props.form.getFieldValue('beforeUse'),
      afterUse: this.props.form.getFieldValue('afterUse'),
      user: this.props.form.getFieldValue('user'),
      remark: this.props.form.getFieldValue('remark'),
    }

    console.log(newapp);

    $.ajax({
      type: "post",
      url: "http://119.23.38.100:8080/cma/EquipmentUse/addOne",
      data: newapp,
      async: false,
      success: function(data) {
        //console.log(data.code);
        if(data.code == 200)
          message.success("新增成功啦");
        else
          message.error("设备已停用，无法添加使用记录");
      },
      error: () => {
        message.error("新增失败哦");
      }
    });

    this.setState({
      visible: false
    })

    this.getAll();

    this.props.form.resetFields();
  }

  onDelete = (key) => {
    $.ajax({
        type: "post",
        url: "http://119.23.38.100:8080/cma/EquipmentUse/deleteOne",
        data: {id: key},
        async: false,
        success:function(d) {
            message.success("删除成功");
        }
      });

      this.getAll();
  }

  getAll = () => {
    
    $.get("http://119.23.38.100:8080/cma/EquipmentUse/getAll", null,(res) => {
      let temp = res.data;
      for(var i = temp.length-1; i >= 0; i--) {
        temp[i].key = temp[i].id;
        for(var j = this.state.allEquip.length-1; j >= 0; j--) {
          if(this.state.allEquip[j].id == temp[i].equipmentId)
            temp[i].name = this.state.allEquip[j].name;
        }
      }
      this.setState({
        allPlan: temp
      })
    })
  }

  getAllEquip = () => {
    $.get("http://119.23.38.100:8080/cma/Equipment/getAll", null,(res) =>{
      let temp = res.data;
      this.setState({
        allEquip: temp
      })
    })
  }

  componentWillMount() {
    this.getAllEquip();
    this.getAll();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  refreshData = () => {
    this.setState({
      allRecord: getStore().getState().EquipmentUseRecord.items
    });
  }

  render() 
  {
    const options = this.state.allEquip.map(d => <Option key={d.id}>{d.name}</Option>);
    const searchoptions = this.state.allEquip.map(d => <Option key={d.id}>{d.name}</Option>);
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '使用日期',
      dataIndex: 'useDate',
      key: 'useDate',
    }, {
      title: '开机时间',
      dataIndex: 'openDate',
      key: 'openDate',
    }, {
      title: '关机时间',
      dataIndex: 'closeDate',
      key: 'closeDate',
    }, {
      title: '样品编号',
      dataIndex: 'sampleNumber',
      key: 'sampleNumber',
    }, {
      title: '测试项目',
      dataIndex: 'testProject',
      key: 'testProject',
    }, {
      title: '使用人',
      dataIndex: 'user',
      key: 'user',
    }, {
      title: '操作',
      dataIndex: 'action',
      colSpan: 2,
      key: 'inspect',
      render: (text, record) => {
        var props = 
        {
          item: record
        }
        return (
          <div>
            <Button type="primary" onClick={() => this.handleAddTab(props)}>查看</Button> 
          </div>
        );
      }
    }, {
      title: '操作',
      dataIndex: 'action',
      colSpan: 0,
      key: 'delete',
      render: (text, record) => {
        return (
          <div>
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                      <Button type="danger">删除</Button>
                  </Popconfirm>
          </div>
        );
        },
    }]
    return (
      <Form>
        <FormItem>
          <Col span={6}>
            设备名称：
            {getFieldDecorator('sid',{
                        rules: [],
                    })(<Select
                        showSearch
                        style={{ width: 100 }}
                        placeholder="选择一个设备"
                        optionFilterProp="resigner"
                        onChange={this.handleSelectChange}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {searchoptions}
                    </Select>)}
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              onClick={this.handleSearch}>
              搜索
            </Button>
          </Col>
        </FormItem>
        <FormItem>
        <Col span={6}>
          <Button
            type="primary"
            icon="sync"
            onClick={this.getAll}>
            刷新
          </Button>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={this.showModal}>
            新增
          </Button>
          <Modal
            title="新增仪器设备使用记录"
            visible={this.state.visible}
            onOk={this.addOne}
            onCancel={this.handleCancel}
          >
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label = "设备：" hasFeedback>
                {getFieldDecorator('equipmentId',{
                  rules:[{required: true, message: "请选择设备!"}],
                  })(
                    <Select
                        showSearch
                        style={{ width: 150 }}
                        placeholder="请选择一个设备"
                        optionFilterProp="resigner"
                        onChange={this.handleSelectChange}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="使用日期：" hasFeedback>
                {getFieldDecorator('useDate', {
                  rules: [{required: true, message: '请选择使用日期!'}],
                  })(
                      <DatePicker />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="开机时间：" hasFeedback>
                {getFieldDecorator('openDate', {
                  rules: [{required: true, message: '请选择开机时间!'}],
                  })(
                      <TimePicker />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="关机时间：" hasFeedback>
                {getFieldDecorator('closeDate', {
                  rules: [{required: true, message: '请选择关机时间!'}],
                  })(
                      <TimePicker />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="样品编号：" hasFeedback>
                {getFieldDecorator('sampleNumber', {
                  rules: [{required: true, message: '请输入样品编号!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="测试项目：" hasFeedback>
                {getFieldDecorator('testProject', {
                  rules: [{required: true, message: '请输入测试项目!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="使用前情况：" hasFeedback>
                {getFieldDecorator('beforeUse', {
                  rules: [{required: true, message: '请输入仪器使用前情况!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="使用后情况：" hasFeedback>
                {getFieldDecorator('afterUse', {
                  rules: [{required: true, message: '请输入仪器使用后情况!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="使用人：" hasFeedback>
                {getFieldDecorator('user', {
                  rules: [{required: true, message: '请输入使用人!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注：" hasFeedback>
                {getFieldDecorator('remark', {
                  rules: [{required: true, message: '请输入备注!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
            </Form>
          </Modal>
        </Col>
        </FormItem>
        
        <FormItem>
          <Table columns={columns} dataSource={this.state.allPlan} rowKey="id"/>
        </FormItem>
      </Form>
    );
  }
}

const EquipmentUseRecord=Form.create()(EquipmentUseRecordView);
export default EquipmentUseRecord