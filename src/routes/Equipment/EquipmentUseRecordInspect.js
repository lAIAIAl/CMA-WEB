import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Row, Col, Card, Tabs, Select, Checkbox, DatePicker, TimePicker, Radio, Popconfirm, Button, Icon, Table, Form, Input, Upload, Modal, Tooltip, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';
import {getAllRecord} from './EquipmentUseRecord'

const FormItem=Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';

class EquipmentUseInspectView extends React.Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
      id: this.props.item.id,
      name :this.props.item.name,
      item: this.props.item,
			visible: false,
			fileData: null,
      allEquip: [],
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
      equipmentId: this.props.form.getFieldValue('name'),
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

    console.log(formda);

  	this.setState({
    	visible: false,
    });

    $.ajax({
    	type: "post",
    	url: "http://119.23.38.100:8080/cma/EquipmentUse/modifyOne",
    	data: formda,
    	async: false,
    	success: () => {
      	message.success("修改成功");
        if(formda.equipmentId != this.props.item.equipmentId)
          for(var j = this.state.allEquip.length-1; j >= 0; j--) {
            if(formda.equipmentId == this.state.allEquip[j].id)
            {
              this.setState({
                name: this.state.allEquip[j].name
              })
              break;
            }
          }
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

  handleSelectChange = (value) => {
    console.log(value);
  }

  getOne = () => {
    $.get("http://119.23.38.100:8080/cma/EquipmentUse/getOne?id="+this.state.id, null,(res) =>{
      let temp = res.data;
      this.setState({
        item: temp
      })
      //console.log(this.state.item);
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
    const options = this.state.allEquip.map(d => <Option key={d.id}>{d.name}</Option>);

		return(
			<Form>
			<Card key='0' title='仪器设备使用信息' style={{marginBottom: 20}}>
				<Row key='0'>
					<Col span={12}>
						<FormItem
              align="left"		
		        	>
                设备名称：
		        		{this.state.name}
		        </FormItem>
					</Col>
          <Col span={12}>
            <FormItem
              align="left"
            >
              使用日期：
              {this.state.item.useDate}
            </FormItem>
          </Col>
				</Row>
				<Row key='1'>
					<Col span={12}>
						<FormItem
		        	align="left"		          			
		        	>
                开机时间：
		        		{this.state.item.openDate}
		        </FormItem>
					</Col>
          <Col span={12}>
            <FormItem
              align="left"                  
              >
                关机时间：
                {this.state.item.closeDate}
            </FormItem>
          </Col>
				</Row>
        <Row key='2'>
          <Col span={12}>
            <FormItem
              align="left"                  
              >
                样品编号：
                {this.state.item.sampleNumber}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              align="left"      
              >
                测试项目：
                {this.state.item.testProject}
            </FormItem>
          </Col>
        </Row>
        <Row key='3'>
          <Col span={12}>
            <FormItem
              align="left"      
              >
                仪器使用前情况：
                {this.state.item.beforeUse}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              align="left"      
              >
                仪器使用后情况：
                {this.state.item.afterUse}
            </FormItem>
          </Col>
        </Row>
        <Row key='4'>
          <Col span={12}>
            <FormItem
              align="left"      
              >
                使用人：
                {this.state.item.user}
            </FormItem>
          </Col>
        </Row>
        <Row key='5'>
          <Col span={12}>
            <FormItem
              align="left"      
              >
                备注：
                {this.state.item.remark}
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
						title="修改设备使用记录"
            visible={this.state.visible}
            onOk={this.handleModify}
            onCancel={this.handleCancel}
            >
              <Form layout="horizontal">
                      
                <FormItem {...formItemLayout } label="设备名称：" hasFeedback>
                  {getFieldDecorator('name', {
                    rules: [],
                    })(
                        <Select
                          showSearch
                          style={{ width: 150 }}
                          placeholder={this.state.name}
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
                    rules: [],
                    initialValue: moment(this.state.item.useDate, dateFormat),
                    })(
                        <DatePicker />
                      )}
                </FormItem>

                <FormItem {...formItemLayout} label="开机时间：" hasFeedback>
                  {getFieldDecorator('openDate', {
                    rules: [],
                    initialValue: moment(this.state.item.openDate, timeFormat),
                    })(
                        <TimePicker />
                      )}
                </FormItem>

                <FormItem {...formItemLayout} label="关机时间：" hasFeedback>
                  {getFieldDecorator('closeDate', {
                    rules: [],
                    initialValue: moment(this.state.item.closeDate, timeFormat),
                    })(
                        <TimePicker />
                      )}
                </FormItem>

                <FormItem {...formItemLayout} label="样品编号：" hasFeedback>
                  {getFieldDecorator('sampleNumber', {
                    rules: [],
                    initialValue: this.state.item.sampleNumber,
                    })(
                        <Input style ={{width: 100,offset:4}}/>
                      )}
                </FormItem>

                <FormItem {...formItemLayout} label="测试项目：" hasFeedback>
                  {getFieldDecorator('testProject', {
                    rules: [],
                    initialValue: this.state.item.testProject,
                    })(
                        <Input style ={{width: 100,offset:4}}/>
                      )}
                </FormItem>

                <FormItem {...formItemLayout} label="仪器使用前情况：" hasFeedback>
                  {getFieldDecorator('beforeUse', {
                    rules: [],
                    initialValue: this.state.item.beforeUse,
                    })(
                        <Input style ={{width: 100,offset:4}}/>
                      )}
                </FormItem>

                <FormItem {...formItemLayout} label="仪器使用后情况：" hasFeedback>
                  {getFieldDecorator('afterUse', {
                    rules: [],
                    initialValue: this.state.item.afterUse,
                    })(
                        <Input style ={{width: 100,offset:4}}/>
                      )}
                </FormItem>
                      
                <FormItem {...formItemLayout} label="使用人：" hasFeedback>
                  {getFieldDecorator('user', {
                    rules: [],
                    initialValue: this.state.item.user,
                    })(
                        <Input style ={{width: 100,offset:4}}/>
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="备注：" hasFeedback>
                  {getFieldDecorator('remark', {
                    rules: [],
                    initialValue: this.state.item.remark,
                    })(
                        <Input style ={{width: 100,offset:4}}/>
                      )}
                </FormItem>

              </Form>
            </Modal>
				</FormItem>
			</Form>
		);
	}
}

const EquipmentUseInspect = Form.create()(EquipmentUseInspectView);
export default EquipmentUseInspect