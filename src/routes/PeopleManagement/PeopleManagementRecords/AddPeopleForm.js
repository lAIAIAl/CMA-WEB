import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Upload, message, Select, DatePicker, InputNumber} from 'antd';

import {baseAddress} from 'services';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

const AddPeopleForm = Form.create()(
class extends React.Component {
    render() {
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;
        return (
          <Modal
            visible={visible}
            title="新增人员管理记录"
            okText="确定"
            onCancel={onCancel}
            onOk={onCreate}
          >
              <Form layout="vertical">
                  <FormItem label="姓名">
                      {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入姓名！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="性别">
                      {getFieldDecorator('gender', {
                          initialValue: '0',
                          rules: [{ required: true, message: '请选择性别！' }],
                      })(
                          <Select style={{ width: 120 }}>
                              <Option value = '0'>男</Option>
                              <Option value = '1'>女</Option>
                          </Select>
                      )}
                  </FormItem>
                  <FormItem label="部门">
                      {getFieldDecorator('department', {
                          rules: [{ required: true, message: '请输入部门！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="职位">
                      {getFieldDecorator('position', {
                          rules: [{ required: true, message: '请输入职位！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="职称">
                      {getFieldDecorator('title', {
                          initialValue: '教授',
                          rules: [{ required: true, message: '请选择职称！' }],
                      })(
                          <Select style={{ width: 120 }}>
                              <Option value = '教授'>教授</Option>
                              <Option value = '副教授'>副教授</Option>
                              <Option value = '助理研究员'>助理研究员</Option>
                              <Option value = '工程师'>工程师</Option>
                              <Option value = '其他'>其他</Option>
                          </Select>
                      )}
                  </FormItem>
                  <FormItem label="文化程度">
                      {getFieldDecorator('degree', {
                          rules: [{ required: true, message: '请输入文化程度！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="毕业院校">
                      {getFieldDecorator('graduationSchool', {
                          rules: [{ required: true, message: '请输入毕业院校！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="毕业专业">
                      {getFieldDecorator('graduationMajor', {
                          rules: [{ required: true, message: '请输入毕业专业！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="毕业时间">
                      {getFieldDecorator('graduationDate', {
                          rules: [{ required: true, message: '请输入毕业时间！' }],
                      })(
                          <DatePicker />
                      )}
                  </FormItem>
                  <FormItem label="工作年限">
                      {getFieldDecorator('workingYears', {
                          initialValue: '1',
                          rules: [{ required: true, message: '请输入工作年限！' }],
                      })(
                          <InputNumber min={0} max={100}/>
                      )}
                  </FormItem>
                  
              </Form>
          </Modal>
      );
    }
  }
);

export default AddPeopleForm;