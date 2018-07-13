import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Row, Col, Card, Tabs, Select, Checkbox, DatePicker, TimePicker, Radio, Popconfirm, Button, Icon, Table, Form, Input, Upload, Modal, Tooltip, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';
import {getAllRecord} from './EquipmentMaintenanceRecord'

const FormItem=Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';

class EquipmentMaintenanceInspectView extends React.Component 
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
        maintenanceDate: this.props.form.getFieldValue('maintenanceDate').format('YYYY-MM-DD'),
        maintenanceContent: this.props.form.getFieldValue('maintenanceContent'),
        maintenancePerson: this.props.form.getFieldValue('maintenancePerson'),
        confirmer: this.props.form.getFieldValue('confirmer'),
      }

      console.log(formda);

  		this.setState({
    		visible: false,
    	});

    	$.ajax({
    		type: "post",
    		url: "http://119.23.38.100:8080/cma/EquipmentMaintenance/modifyOne",
    		data: formda,
    		async: false,
    		success: () => {
      			message.success("修改成功");
            if(formda.equipmentId != this.props.item.equipmentId)
              for(var j = this.state.allEquip.length-1; j >= 0; j--) {
                if(formda.equipmentId == this.state.allEquip[j].id)
                  this.setState({
                    name: this.state.allEquip[j].name
                  })
                break;
              }
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

    handleSelectChange = (value) => {
      console.log(value);
    }

    getOne = () => {
      $.get("http://119.23.38.100:8080/cma/EquipmentMaintenance/getOne?id="+this.state.id, null,(res) =>{
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
			<Card key='0' title='仪器设备维修保养信息' style={{marginBottom: 20}}>
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
              记录日期：
              {this.state.item.maintenanceDate}
            </FormItem>
          </Col>
				</Row>
				<Row key='1'>
					<Col span={12}>
						<FormItem
		        			align="left"		          			
		        		>
                保养内容：
		        		{this.state.item.maintenanceContent}
		        		</FormItem>
					</Col>
          <Col span={12}>
            <FormItem
                  align="left"                  
                >
                保养人：
                {this.state.item.maintenancePerson}
                </FormItem>
          </Col>
				</Row>
        <Row key='2'>
          <Col span={12}>
            <FormItem
                align="left"                  
              >
                确认人：
                {this.state.item.confirmer}
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
						title="修改设备维修保养记录"
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
                      
                      <FormItem {...formItemLayout} label="记录日期：" hasFeedback>
                        {getFieldDecorator('maintenanceDate', {
                          rules: [],
                          initialValue: moment(this.state.item.maintenanceDate, dateFormat),
                        })(
                          <DatePicker />
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="保养内容：" hasFeedback>
                        {getFieldDecorator('maintenanceContent', {
                          rules: [],
                          initialValue: this.state.item.maintenanceContent,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="保养人：" hasFeedback>
                        {getFieldDecorator('maintenancePerson', {
                          rules: [],
                          initialValue: this.state.item.maintenancePerson,
                        })(
                          <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="确认人：" hasFeedback>
                        {getFieldDecorator('confirmer', {
                          rules: [],
                          initialValue: this.state.item.confirmer,
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

const EquipmentMaintenanceInspect = Form.create()(EquipmentMaintenanceInspectView);
export default EquipmentMaintenanceInspect