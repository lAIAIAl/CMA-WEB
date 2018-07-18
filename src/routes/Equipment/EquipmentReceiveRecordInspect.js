import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Row, Col, Card, Tabs, Select, Checkbox, DatePicker, Radio, Popconfirm, Button, Icon, Table, Form, Input, Upload, Modal, Tooltip, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';
import {getAllRecord} from './EquipmentReceiveRecord'
import EquipmentReceiveFileRecord from './EquipmentReceiveFileRecord';

const FormItem=Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';

class EquipmentReceiveInspectView extends React.Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
      id: this.props.item.id,
      item: this.props.item,
			visible: false,
			fileList: [],
		}
	}

	showModal = () => {
    this.setState({
    	visible: true,
    });
  }

  handleAddTab = (key) => {
    var props = {
      id: key
    }
    this.props.addTab("设备验收附件", "设备验收附件", EquipmentReceiveFileRecord, props);
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
      manufacturer: this.props.form.getFieldValue('manufacturer'),
      receiveSituation: this.props.form.getFieldValue('receiveSituation'),
      recipient: this.props.form.getFieldValue('recipient'),
      receiveDate: this.props.form.getFieldValue('receiveDate').format('YYYY-MM-DD'),
      equipmentSituation: this.props.form.getFieldValue('equipmentSituation'),
      acceptance: this.props.form.getFieldValue('acceptance'),
      acceptancePerson: this.props.form.getFieldValue('acceptancePerson'),
      acceptanceDate: this.props.form.getFieldValue('acceptanceDate').format('YYYY-MM-DD'),
    }

    console.log(formda);

  	this.setState({
    	visible: false,
    });

    $.ajax({
    	type: "post",
    	url: "http://119.23.38.100:8080/cma/EquipmentReceive/modifyOne",
    	data: formda,
    	async: false,
    	success: () => {
      	message.success("修改成功");
    	},
    	error: () => {
      	message.error("修改失败");
    	}
    });

    this.getOne();

    this.props.form.resetFields();
  }

  handleCancel = () => {
  	this.setState({
    	visible: false,
    });
  }

  getOne = () => {
    $.get("http://119.23.38.100:8080/cma/EquipmentReceive/getOne?id="+this.state.id, null,(res) =>{
      let temp = res.data;
      this.setState({
        item: temp
      })
    })
  }

  componentWillMount() {
    this.getOne();
  }

	render(){
		const formItemLayout = 
		{
			labelCol: { span:6 },
			wrapperCol: { span:14 },
		};

		const width = '100%';
		const {getFieldDecorator} = this.props.form;

		return(
			<Form>
			<Card key='0' title='仪器设备验收信息' style={{marginBottom: 20}}>
				<Row key='0'>
					<Col span={12}>
						<FormItem
                  align="left"		
		        		>
                设备名称：
		        		{this.state.item.name}
		        		</FormItem>
					</Col>
          <Col span={12}>
            <FormItem
              align="left"
            >
              设备型号：
              {this.state.item.model}
            </FormItem>
          </Col>
				</Row>
				<Row key='1'>
					<Col span={12}>
						<FormItem
		        			align="left"		          			
		        		>
                生产厂家：
		        		{this.state.item.manufacturer}
		        		</FormItem>
					</Col>
				</Row>
        <Row key='2'>
          <Col span={12}>
            <FormItem
                  align="left"                  
                >
                接受情况：
                {this.state.item.receiveSituation}
                </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
                align="left"                  
              >
                接收人：
                {this.state.item.recipient}
                </FormItem>
          </Col>
        </Row>
        <Row key='3'>
          <Col span={12}>
            <FormItem
                align="left"      
              >
                接收日期：
                {this.state.item.receiveDate}
                </FormItem>
          </Col>
        </Row>
        <Row key='4'>
          <Col span={12}>
            <FormItem
                align="left"      
              >
                安装调试情况：
                {this.state.item.equipmentSituation}
                </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
                align="left"      
              >
                验收情况：
                {this.state.item.acceptance}
                </FormItem>
          </Col>
        </Row>
        <Row key='5'>
          <Col span={12}>
            <FormItem
                align="left"      
              >
                验收人：
                {this.state.item.acceptancePerson}
                </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
                align="left"      
              >
                验收日期：
                {this.state.item.acceptanceDate}
                </FormItem>
          </Col>
        </Row>
        <Row key='6'>
          <Col span={12}>
            <FormItem
                align="left"   
              >
                附属文件：
                <a onClick={() => this.handleAddTab(this.state.item.id)}> 查看 </a>
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

                      <FormItem {...formItemLayout} label="生产厂家：" hasFeedback>
                        {getFieldDecorator('manufacturer', {
                          rules: [],
                          initialValue: this.state.item.manufacturer,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="接受情况：" hasFeedback>
                        {getFieldDecorator('receiveSituation', {
                          rules: [],
                          initialValue: this.state.item.receiveSituation,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="接收人：" hasFeedback>
                        {getFieldDecorator('recipient', {
                          rules: [],
                          initialValue: this.state.item.recipient,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="接收日期：" hasFeedback>
                        {getFieldDecorator('receiveDate', {
                          rules: [],
                          initialValue: moment(this.state.item.receiveDate, dateFormat),
                        })(
                          <DatePicker />
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="安装调试情况：" hasFeedback>
                        {getFieldDecorator('equipmentSituation', {
                          rules: [],
                          initialValue: this.state.item.equipmentSituation,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="验收情况：" hasFeedback>
                        {getFieldDecorator('acceptance', {
                          rules: [],
                          initialValue: this.state.item.acceptance,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="验收人：" hasFeedback>
                        {getFieldDecorator('acceptancePerson', {
                          rules: [],
                          initialValue: this.state.item.acceptancePerson,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="验收日期：" hasFeedback>
                        {getFieldDecorator('acceptanceDate', {
                          rules: [],
                          initialValue: moment(this.state.item.acceptanceDate, dateFormat),
                        })(
                          <DatePicker />
                        )}
                      </FormItem>
                    </Form>
                  </Modal>
				</FormItem>
			</Form>
		);
	}
}

const EquipmentReceiveInspect = Form.create()(EquipmentReceiveInspectView);
export default EquipmentReceiveInspect