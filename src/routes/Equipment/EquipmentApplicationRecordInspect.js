import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Row, Col, Card, Tabs, Select, Checkbox, DatePicker, Radio, Popconfirm, Button, Icon, Table, Form, Input, Upload, Modal, Tooltip, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';
import {getAllRecord} from './EquipmentRecord'

const FormItem=Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
const CheckboxGroup = Checkbox.Group;

class EquipmentApplicationRecordInspectView extends React.Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
      id: this.props.item.id,
      item: this.props.item,
			visible: false,
			fileData: null,
      isservice: false,
      istest: false,
      selectvalue: 0,
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
        applicant: this.props.form.getFieldValue('applicant'),
        applicationDate: this.props.form.getFieldValue('applicationDate').format('YYYY-MM-DD'),
        applicationPurpose: this.props.form.getFieldValue('applicationPurpose'),
        equipmentUse: this.state.selectvalue,
        equipmentNumber: this.props.form.getFieldValue('equipmentNumber'),
        softwareInfo: this.props.form.getFieldValue('softwareInfo'),
        auditor: this.props.form.getFieldValue('auditor'),
        auditDate: this.props.form.getFieldValue('auditDate').format('YYYY-MM-DD'),
        auditOpinion: this.props.form.getFieldValue('auditOpinion'),
      }

      console.log(formda);

  		this.setState({
    		visible: false,
    	});

    	$.ajax({
    		type: "post",
    		url: "http://119.23.38.100:8080/cma/EquipmentApplication/modifyOne",
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

    handleSelect = (checkedValues) =>{
      var value = 0;
      for(var i = checkedValues.length-1; i >= 0; i--)
        value = checkedValues[i]+value;
      this.setState({
        selectvalue: value,
      })
    }

    getOne = () => {
      $.get("http://119.23.38.100:8080/cma/EquipmentApplication/getOne?id="+this.state.id, null,(res) =>{
          let temp = res.data;

          if(temp.equipmentUse == 1)
            this.setState({
              isservice: true,
            })
          else if(temp.equipmentUse == 2)
            this.setState({
              istest: true,
            })
          else if(temp.equipmentUse == 3)
            this.setState({
              istest: true,
              isservice: true
            })
          else ;
          this.setState({
            item: temp,
            selectvalue: temp.equipmentUse
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
    const options = [
    {label:'服务器', value:1, defaultChecked:true, disabled: true},
    {label:'测试机', value:2, checked:true, disabled: true},
    ];

    var value = 0;

		return(
			<Form>
			<Card key='0' title='仪器设备使用申请详情' style={{marginBottom: 20}}>
				<Row key='0'>
					<Col span={12}>
						<FormItem
		        			align="left"		          		
		        		>
                申请人：
		        		{this.state.item.applicant}
		        		</FormItem>
					</Col>
          <Col span={12}>
            <FormItem
              align="left"              
            >
              申请日期：
              {this.state.item.applicationDate}
            </FormItem>
          </Col>
				</Row>
				<Row key='1'>
					<Col span={12}>
						<FormItem
		        			align="left"		          			
		        		>
                申请用途：
		        		{this.state.item.applicationPurpose}
		        		</FormItem>
					</Col>
				</Row>
        <Row key='2'>
          <Col span={12}>
            <FormItem
                  align="left"                    
                >
                仪器类型：
                <CheckboxGroup options={options}/>
              </FormItem>
          </Col>
        </Row>
        <Row key='3'>
          <Col span={12}>
            <FormItem
                  align="left"
                >
                设备编号：
                {this.state.item.equipmentNumber}
                </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
                  align="left"
                >
                申请软件信息：
                {this.state.item.softwareInfo}
                </FormItem>
          </Col>
        </Row>
        <Row key='4'>
          <Col span={12}>
            <FormItem
                  align="left"
                >
                审核人：
                {this.state.item.auditor}
                </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
                  align="left"                    
                >
                审核时间：
                {this.state.item.auditDate}
                </FormItem>
          </Col>
        </Row>
        <Row key='5'>
          <Col span={12}>
            <FormItem
                  align="left"
                >
                审核意见：
                {this.state.item.auditOpinion}
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
						title="修改设备使用申请信息"
                    	visible={this.state.visible}
                    	onOk={this.handleModify}
                    	onCancel={this.handleCancel}
                  	>
                    <Form layout="horizontal">
                      
                      <FormItem {...formItemLayout } label="申请人：" hasFeedback>
                        {getFieldDecorator('applicant', {
                          rules: [],
                          initialValue: this.state.item.applicant,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>
                      
                      <FormItem {...formItemLayout} label="申请日期：" hasFeedback>
                        {getFieldDecorator('applicationDate', {
                          rules: [],
                          initialValue: moment(this.state.item.applicationDate, dateFormat),
                        })(
                          <DatePicker />
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="申请用途：" hasFeedback>
                        {getFieldDecorator('applicationPurpose', {
                          rules: [],
                          initialValue: this.state.item.applicationPurpose,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="仪器类型：" hasFeedback>
                        <Checkbox.Group onChange={this.handleSelect}>
                          <Row>
                            <Checkbox value={1} defaultChecked={true} checked="checked">1</Checkbox>
                            <Checkbox value={2} defaultChecked={false} checked="true">2</Checkbox>
                          </Row>
                        </Checkbox.Group>
                      </FormItem>

                      <FormItem {...formItemLayout} label="设备编号：" hasFeedback>
                        {getFieldDecorator('equipmentNumber', {
                          rules: [],
                          initialValue: this.state.item.equipmentNumber,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="申请软件信息：" hasFeedback>
                        {getFieldDecorator('softwareInfo', {
                          rules: [],
                          initialValue: this.state.item.softwareInfo,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="审核人：" hasFeedback>
                        {getFieldDecorator('auditor', {
                          rules: [],
                          initialValue: this.state.item.auditor,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="审核时间：" hasFeedback>
                        {getFieldDecorator('auditDate', {
                          rules: [],
                          initialValue: moment(this.state.item.auditDate, dateFormat),
                        })(
                          <DatePicker />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="审核意见：" hasFeedback>
                        {getFieldDecorator('auditOpinion', {
                          rules: [],
                          initialValue: this.state.item.auditOpinion,
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

const EquipmentApplicationRecordInspect = Form.create()(EquipmentApplicationRecordInspectView);
export default EquipmentApplicationRecordInspect