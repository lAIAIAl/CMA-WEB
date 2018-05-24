import React from 'react';
import { Form, Input, Icon, Row, Col, Button, Card} from 'antd';
import {Table, Divider, Modal, Avatar, Upload, message} from 'antd';

import {baseAddress} from 'services';

const FormItem = Form.Item;

const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
      //此处
      authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        } 
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};


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
                  <FormItem label="档案编号">
                      {getFieldDecorator('fileId', {
                          rules: [{ required: true, message: '请输入档案编号！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>
                  <FormItem label="档案存放位置">
                      {getFieldDecorator('location', {
                          rules: [{ required: true, message: '请输入档案存放位置！' }],
                      })(
                          <Input />
                      )}
                  </FormItem>

                  
              </Form>
          </Modal>
      );
    }
  }
);

export default AddPeopleForm;

/*                  <FormItem label="档案扫描件">
                      {getFieldDecorator('fileImage', {
                         
                      })(  
                          <Upload {...props}>
                              <Button>
                                  <Icon type="upload" /> 上传档案扫描件
                              </Button>
                          </Upload>

                      )}
                  </FormItem>*/