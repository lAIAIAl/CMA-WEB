import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox, Radio, Popconfirm, Button, Icon, Table, Form, Input, Upload, Modal, Tooltip, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';
import {getAllRecord} from './EquipmentRecord'

const FormItem=Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;

class EquipmentInspectView extends React.Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
      id: this.props.item.id,
      item: this.props.item,
			visible: false,
			fileData: null,
		}
	}

	showModal = () => {
    	this.setState({
    		visible: true,
    	});
  	}

  	handleModify = () => {
  		this.props.form.validateFields((err, fieldsValue) => {
      		if(err) {
        		return ;
      		}
    	});

      const formda = {
        id: this.state.item.id,
        name: this.props.form.getFieldValue('name'),
        model: this.props.form.getFieldValue('model'),
        cpu: this.props.form.getFieldValue('cpu'),
        memory: this.props.form.getFieldValue('memory'),
        hardDisk: this.props.form.getFieldValue('hardDisk'),
        equipmentNumber: this.props.form.getFieldValue('equipmentNumber'),
        application: this.props.form.getFieldValue('application'),
        state: parseInt(this.props.form.getFieldValue('state')),
      }

      console.log(formda);

  		this.setState({
    		visible: false,
    	});

    	$.ajax({
    		type: "post",
    		url: "http://119.23.38.100:8080/cma/Equipment/modifyOne",
    		data: formda,
    		async: false,
    		success: () => {
      			message.success("修改成功");
    		},
    		error: () => {
      			message.error("修改失败");
    		}
    	});

      //getAllRecord();
      this.getOne();

    	this.props.form.resetFields();
  	}

  	handleCancel = () => {
  		this.setState({
    		visible: false,
    	});
  	}

    getOne = () => {
      $.get("http://119.23.38.100:8080/cma/Equipment/getOne?id="+this.state.id, null,(res) =>{
          let temp = res.data;

          if(temp.state == 0)
            temp.state = "停用";
          else
            temp.state = "准用";
          
          
          this.setState({
            item: temp
          })
          //console.log(this.state.item);
      })
    }

    componentWillMount() {
      this.getOne();
    }

	render(){
		const formItemLayout = 
		{
			labelCol: { span:5 },
			wrapperCol: { span:14 },
		};

		const width = '100%';
		const {getFieldDecorator} = this.props.form;

    var value = 0;
    if(this.state.item.state == 1 || this.state.item.state == "准用")
      value = 1;

		return(
			<Form>
			<Card key='0' title='仪器设备信息' style={{marginBottom: 20}}>
				<Row key='0'>
					<Col span={12}>
						<FormItem
		        			align="left"		          		
		        		>
                名称：
		        		{this.state.item.name}
		        		</FormItem>
					</Col>
          <Col span={12}>
            <FormItem
              align="left"              
            >
              型号：
              {this.state.item.model}
            </FormItem>
          </Col>
				</Row>
				<Row key='1'>
					<Col span={12}>
						<FormItem
		        			align="left"		          			
		        		>
                CPU：
		        		{this.state.item.cpu}
		        		</FormItem>
					</Col>
					<Col span={12}>
						<FormItem
		        			align="left"		          			
		        		>
                内存：
		        		{this.state.item.memory}
		        		</FormItem>
					</Col>
				</Row>
        <Row key='2'>
          <Col span={12}>
            <FormItem
                  align="left"                    
                >
                硬盘：
                {this.state.item.hardDisk}
                </FormItem>
          </Col>
        </Row>
        <Row key='3'>
          <Col span={12}>
            <FormItem
                  align="left"
                >
                机身编号：
                {this.state.item.equipmentNumber}
                </FormItem>
          </Col>
        </Row>
        <Row key='4'>
          <Col span={12}>
            <FormItem
                  align="left"
                >
                用途：
                {this.state.item.application}
                </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
                  align="left"                    
                >
                状态：
                {this.state.item.state}
                </FormItem>
          </Col>
        </Row>
			</Card>
				<FormItem>
					<Button
					type="primary"
					onClick={this.showModal}
					>
					编辑
					</Button>
					<Modal
						title="修改设备信息"
                    	visible={this.state.visible}
                    	onOk={this.handleModify}
                    	onCancel={this.handleCancel}
                  	>
                    <Form layout="horizontal">
                      
                      <FormItem {...formItemLayout } label="设备名称：" hasFeedback>
                        {getFieldDecorator('name', {
                          rules: [],
                          initialValue: this.state.item.name,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>
                      
                      <FormItem {...formItemLayout} label="设备型号：" hasFeedback>
                        {getFieldDecorator('model', {
                          rules: [],
                          initialValue: this.state.item.model,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="CPU：" hasFeedback>
                        {getFieldDecorator('cpu', {
                          rules: [],
                          initialValue: this.state.item.cpu,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="内存：" hasFeedback>
                        {getFieldDecorator('memory', {
                          rules: [],
                          initialValue: this.state.item.memory,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="硬盘：" hasFeedback>
                        {getFieldDecorator('hardDisk', {
                          rules: [],
                          initialValue: this.state.item.hardDisk,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="机身编号：" hasFeedback>
                        {getFieldDecorator('equipmentNumber', {
                          rules: [],
                          initialValue: this.state.item.equipmentNumber,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="用途：" hasFeedback>
                        {getFieldDecorator('application', {
                          rules: [],
                          initialValue: this.state.item.application,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="使用情况：" hasFeedback>
                        {getFieldDecorator('state', {
                          rules: [],
                          initialValue: value,
                        })(
                          <RadioGroup>
                            <Radio value={0}> 0（停用）</Radio>
                            <Radio value={1}> 1（准用）</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Form>
                  </Modal>
				</FormItem>
			</Form>
		);
	}
}

const EquipmentInspect = Form.create()(EquipmentInspectView);
export default EquipmentInspect