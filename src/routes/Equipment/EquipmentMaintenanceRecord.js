import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Select, DatePicker, TimePicker, Button, Icon, Table, Form, Input, Modal, AutoComplete, message, Radio} from 'antd';

import $ from 'lib/jquery-3.3.1';
import EquipmentMaintenanceRecordInspect from './EquipmentMaintenanceRecordInspect'
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
  $.get("http://119.23.38.100:8080/cma/EquipmentMaintenance/getAll" , null,(res)=>{
      let data = res.data;
      for (var i = data.length - 1; i >= 0; i--) {
        data[i].key = data[i].id;
      }
      let store = getStore();
    store.dispatch(setItems(data, 'EquipmentMaintenanceRecord'));
    });
}

class EquipmentMaintenanceRecordView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      allPlan: [],
      allEquip: [],
    }
  }

  handleAddTab = (props) => {
    this.props.addTab("设备维修保养信息", "设备维修保养信息", EquipmentMaintenanceRecordInspect, props);
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
    $.get("http://119.23.38.100:8080/cma/EquipmentMaintenance/getAllByEquipmentId?equipmentId="+eid, null,(res) =>{
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
      maintenanceDate: this.props.form.getFieldValue('maintenanceDate').format('YYYY-MM-DD'),
      maintenanceContent: this.props.form.getFieldValue('maintenanceContent'),
      maintenancePerson: this.props.form.getFieldValue('maintenancePerson'),
      confirmer: this.props.form.getFieldValue('confirmer'),
    }

    console.log(newapp);

    $.ajax({
      type: "post",
      url: "http://119.23.38.100:8080/cma/EquipmentMaintenance/addOne",
      data: newapp,
      async: false,
      success: function(data) {
        //console.log(data.code);
        if(data.code == 200)
          message.success("新增成功啦");
        else
          message.error("设备已停用，无法添加维修保养记录");
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
        url: "http://119.23.38.100:8080/cma/EquipmentMaintenance/deleteOne",
        data: {id: key},
        async: false,
        success:function(d) {
            message.success("删除成功");
        }
      });

      this.getAll();
  }

  getAll = () => {
    
    $.get("http://119.23.38.100:8080/cma/EquipmentMaintenance/getAll", null,(res) => {
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
      allRecord: getStore().getState().EquipmentMaintenanceRecord.items
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
      title: '记录日期',
      dataIndex: 'maintenanceDate',
      key: 'maintenanceDate',
    }, {
      title: '保养内容',
      dataIndex: 'maintenanceContent',
      key: 'maintenanceContent',
    }, {
      title: '保养人',
      dataIndex: 'maintenancePerson',
      key: 'maintenancePerson',
    }, {
      title: '确认人',
      dataIndex: 'confirmer',
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
            title="新增仪器设备维修保养记录"
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
              <FormItem {...formItemLayout} label="记录日期：" hasFeedback>
                {getFieldDecorator('maintenanceDate', {
                  rules: [{required: true, message: '请选择记录日期!'}],
                  })(
                      <DatePicker />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="保养内容：" hasFeedback>
                {getFieldDecorator('maintenanceContent', {
                  rules: [{required: true, message: '请输入保养内容!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="保养人：" hasFeedback>
                {getFieldDecorator('maintenancePerson', {
                  rules: [{required: true, message: '请输入保养人!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="确认人：" hasFeedback>
                {getFieldDecorator('confirmer', {
                  rules: [{required: true, message: '请输入确认人!'}],
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

const EquipmentMaintenanceRecord=Form.create()(EquipmentMaintenanceRecordView);
export default EquipmentMaintenanceRecord