import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Popconfirm, Upload, Select, DatePicker, Button, Icon, Table, Form, Input, Modal, AutoComplete, message, Radio} from 'antd';

import $ from 'lib/jquery-3.3.1';

const FormItem=Form.Item;
const { Option, OptGroup } = Select;
//style
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

class EquipmentReceiveFileRecordView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      visible: false,
      allPlan: [],
      fileList: [],
      uploading: false,
    }
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

  handleSelectChange = () =>{
  }

  handleDownload = (key) => {
    const url = "http://119.23.38.100:8080/cma/EquipmentReceive/getOneAttachment?attachmentId="+key;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  addOne = () => {
    const {fileList} = this.state;

    const formdata = new FormData();
    var id = this.state.id;
    formdata.append("id",id);
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
      url: "http://119.23.38.100:8080/cma/EquipmentReceive/addAttachment",
      processData: false,
      contentType: false,
      data: formdata,
      async: false,
      success: function(data){
        if(data.code ==200) {
          message.success("新增成功啦");
          this.setState({
            fileList: [],
          })
        }
        else
          message.error(data.msg);
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
      url: "http://119.23.38.100:8080/cma/EquipmentReceive/deleteAttachment",
      data: {attachmentId: key},
      async: false,
      success:function(d) {
        message.success("删除成功");
      }
    });

    this.getAll();
  }

  getAll = () => {
    $.get("http://119.23.38.100:8080/cma/EquipmentReceive/getAllAttachmentNameById?id="+this.state.id, null,(res) =>{
      let temp = res.data;
      for(var i = temp.length-1; i >= 0; i--) {
        temp[i].key = temp[i].attachmentId;
      }
      this.setState({
        allPlan: temp
      })
    })
  }

  componentWillMount() {
    this.getAll();
  }
  
  render() 
  {
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '文件名称',
      dataIndex: 'name',
      width: '50%',
      align: 'center',
      key: 'name',
    }, {
      title: '操作',
      dataIndex: 'action',
      colSpan: 2,
      key: 'inspect',
      width: '10%',
      render: (text, record) => {
        return (
          <div>
            <Button type="primary" onClick={() => this.handleDownload(record.key)}>下载</Button> 
          </div>
        );
      }
    }, {
      title: '操作',
      dataIndex: 'action',
      colSpan: 0,
      key: 'delete',
      width: '10%',
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
      action: "http://119.23.38.100:8080/cma/EquipmentReceive/addAttachment",
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
            title="添加验收附属文件"
            visible={this.state.visible}
            onOk={this.addOne}
            onCancel={this.handleOk}
          >
            <Form id="upfile">
              附属文件：
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
          <Table columns={columns} dataSource={this.state.allPlan} rowKey="attachmentId"/>
        </FormItem>
      </Form>
    );
  }
}

const EquipmentReceiveFileRecord=Form.create()(EquipmentReceiveFileRecordView);
export default EquipmentReceiveFileRecord