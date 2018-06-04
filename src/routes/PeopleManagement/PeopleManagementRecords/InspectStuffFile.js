import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Upload, message, Select, DatePicker, InputNumber} from 'antd';

import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import ModifyStuffFile from './ModifyStuffFile';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const InspectStuffFile = Form.create()(
class extends React.Component {

    state = {
        visible: false,
        item: null,
    };

  constructor(props){
      super(props);
  }

    componentWillMount(){
        this.setState({
            item: this.props.fileData
        });
    }

    handleModify = () => {
        let props = {
          item : this.props.item
        }
        this.props.addTab("修改档案", "修改档案", ModifyStuffFile, props);
    }

    handleDelete = () => {
        $.ajax({
            type: "post",
            url: baseAddress+"/cma/StaffFile/deleteOne",
            data: {id : this.props.item.id},
            async: false,
            success: function (d) {
              message.success("删除成功");
            }
        });
    }

    render() {
      let people = this.state.item;
      //console.log(people);
      const formItemLayout = 
      {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };
      return (
          <div>
            <Card title='人员档案信息'>
              <Row key='0'>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                        label="姓名"
                    >
                      {people.name}
                    </FormItem>
                  </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                    label="档案编号"
                >
                  {people.fileId}
                </FormItem>
              </Col>
            </Row>
            <Row key='1'>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                    label="档案存放位置"
                >
                  {people.fileLocation}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                    label="部门"
                >
                  {people.department}
                </FormItem>
              </Col>
            </Row>
            </Card>
            <Button 
                style={{margin:'5px 10px'}}
                type="primary" 
                onClick={this.handleModify }>
                修改
            </Button>
            <Button 
                type="danger"
                onClick={this.handleDelete}>
                删除
            </Button>
          </div>
      );
    }
}
);

export default InspectStuffFile;