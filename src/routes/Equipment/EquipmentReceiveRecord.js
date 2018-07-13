import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Upload, Select, DatePicker, Button, Icon, Table, Form, Input, Modal, AutoComplete, message, Radio} from 'antd';

import $ from 'lib/jquery-3.3.1';
import EquipmentReceiveRecordInspect from './EquipmentReceiveRecordInspect'
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
  $.get("http://119.23.38.100:8080/cma/EquipmentReceive/getAll" , null,(res)=>{
      let data = res.data;
      for (var i = data.length - 1; i >= 0; i--) {
        data[i].key = data[i].id;
      }
      let store = getStore();
    store.dispatch(setItems(data, 'EquipmentReceiveRecord'));
    });
}

class EquipmentReceiveRecordView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      allPlan: [],
      fileList: [],
      uploading: false,
    }
  }

  handleAddTab = (props) => {
    this.props.addTab("设备验收信息", "设备验收信息", EquipmentReceiveRecordInspect, props);
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

  }

  addOne = () => {
    const {fileList} = this.state;

    var name = this.props.form.getFieldValue('name');
    var model = this.props.form.getFieldValue('model');
    var manufacturer = this.props.form.getFieldValue('manufacturer');
    var receiveSituation = this.props.form.getFieldValue('receiveSituation');
    var recipient = this.props.form.getFieldValue('recipient');
    var receiveDate = this.props.form.getFieldValue('receiveDate').format('YYYY-MM-DD');
    var equipmentSituation = this.props.form.getFieldValue('equipmentSituation');
    var acceptance = this.props.form.getFieldValue('acceptance');
    var acceptancePerson = this.props.form.getFieldValue('acceptancePerson');
    var acceptanceDate = this.props.form.getFieldValue('acceptanceDate').format('YYYY-MM-DD');

    var formdata = new FormData();
    formdata.append("name",name);
    formdata.append("model",model);
    formdata.append("manufacturer",manufacturer);
    formdata.append("receiveSituation",receiveSituation);
    formdata.append("recipient",recipient);
    formdata.append("receiveDate",receiveDate);
    formdata.append("equipmentSituation",equipmentSituation);
    formdata.append("acceptance",acceptance);
    formdata.append("acceptancePerson",acceptancePerson);
    formdata.append("acceptanceDate",acceptanceDate);
    fileList.forEach((file) => {
      formdata.append("attachment", file)
    });

    console.log(formdata);
    this.setState({
      visible: false,
      uploading: true,
    })

    $.ajax({
      type: "post",
      url: "http://119.23.38.100:8080/cma/EquipmentReceive/addOne",
      processData: false,
      contentType: false,
      data: formdata,
      async: false,
      success: () => {
        message.success("新增成功啦");
        this.setState({
          fileList: [],
        })
      },
      error: () => {
        message.error("新增失败哦");
      }
    });

    this.setState({
      uploading: false,
    })
    this.getAll();

    this.props.form.resetFields();
  }

  onDelete = (key) => {
    $.ajax({
        type: "post",
        url: "http://119.23.38.100:8080/cma/EquipmentReceive/deleteOne",
        data: {id: key},
        async: false,
        success:function(d) {
            message.success("删除成功");
        }
      });

      this.getAll();
  }

  getAll = () => {
      $.get("http://119.23.38.100:8080/cma/EquipmentReceive/getAll", null,(res) =>{
          let temp = res.data;
          for(var i = temp.length-1; i >= 0; i--) {
            temp[i].key = temp[i].id;
          }
          this.setState({
            allPlan: temp
          })
      })
    }

    componentWillMount() {
      this.getAll();
    }
    componentWillUnmount() {
        this.unsubscribe();
  }
  refreshData = () => {
    this.setState({
      allRecord: getStore().getState().EquipmentReceiveRecord.items
    });
  }

  render() 
  {
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '设备型号',
      dataIndex: 'model',
      key: 'model',
    }, {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    }, {
      title: '接受情况',
      dataIndex: 'receiveSituation',
      key: 'receiveSituation',
    }, {
      title: '安装调试情况',
      dataIndex: 'equipmentSituation',
      key: 'equipmentSituation',
    }, {
      title: '验收情况',
      dataIndex: 'acceptance',
      key: 'acceptance',
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

    const addprops = {
          action: "http://119.23.38.100:8080/cma/EquipmentReceive/addOne",
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
        
        <FormItem>
        <Col span={4}>
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
            title="新增仪器设备验收记录"
            visible={this.state.visible}
            onOk={this.addOne}
            onCancel={this.handleCancel}
          >
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label = "设备名称：" hasFeedback>
                {getFieldDecorator('name',{
                  rules:[{required: true, message: "请输入设备名称!"}],
                  initialValue: '',
                  })(
                    <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="设备型号：" hasFeedback>
                {getFieldDecorator('model', {
                  rules: [{required: true, message: '请输入设备型号!'}],
                  initialValue: '',
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="生产厂家：" hasFeedback>
                {getFieldDecorator('manufacturer', {
                  rules: [{required: true, message: '请输入生产厂家!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="接受情况：" hasFeedback>
                {getFieldDecorator('receiveSituation', {
                  rules: [{required: true, message: '请输入接受情况!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="接收人：" hasFeedback>
                {getFieldDecorator('recipient', {
                  rules: [{required: true, message: '请输入接收人!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="接收日期：" hasFeedback>
                {getFieldDecorator('receiveDate', {
                  rules: [{required: true, message: '请选择接收日期!'}],
                  })(
                      <DatePicker />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="安装调试情况：" hasFeedback>
                {getFieldDecorator('equipmentSituation', {
                  rules: [{required: true, message: '请输入安装调试情况!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="验收情况：" hasFeedback>
                {getFieldDecorator('acceptance', {
                  rules: [{required: true, message: '请输入验收情况!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="验收人：" hasFeedback>
                {getFieldDecorator('acceptancePerson', {
                  rules: [{required: true, message: '请输入验收人!'}],
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="验收日期：" hasFeedback>
                {getFieldDecorator('acceptanceDate', {
                  rules: [{required: true, message: '请选择验收日期!'}],
                  })(
                      <DatePicker />
                  )}
              </FormItem>
            </Form>
            <Form id="upfile">
              <FormItem>附属文件</FormItem>
                <Upload {...addprops}>
                  <Button>
                    <Icon type="upload" /> 添加文件
                  </Button>
                </Upload>
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

const EquipmentReceiveRecord=Form.create()(EquipmentReceiveRecordView);
export default EquipmentReceiveRecord