import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import StaffAuthorizationView from './StaffAuthorizationView';
import {getAuthorization} from './StaffAuthorizationView';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;

 class AIViewForm extends React.Component{
    constructor(props)
    {
    	super(props);
		this.state = {
		    StaffData:[],
			item: null,
			visible: false,
			AuthData: null,
			dataSource: this.props.dataSource,
		}
		let item: null;
		for(var i = this.props.dataSource.length-1; i >= 0; i--)
		{
			if(this.props.dataSource[i].authorizationId == this.props.item.authorizationId)
				item = this.props.item;
		}
		//console.log(item);
		this.state.item = item;
    }
  	getAllStaff = () => {
  		$.get(baseAddress+"/cma/StaffManagement/getAll" , null,(res)=>{
            let test = res.data;
  		    for (var i = test.length - 1; i >= 0; i--)
  		    {
  			    test[i].key = test[i].authorizationId;
  		    }
  		    this.setState({
  		        StaffData: test })
  		});
  	}
    showModal = () => {
        this.setState({
        visible: true,
        });
    }
    handleSubmit = () => {
        this.setState({
            visible: false,
        });
        this.getAllStaff();
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.getAllStaff();
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    getAuthInfo=()=>{
        $.get(baseAddress+"/cma/StaffAuthorization/getOne?authorizationId="+this.state.item.authorizationId ,null,(res)=>{
   		    let NiMa=res.data;
   		    console.log(NiMa);
            this.setState({
                item:NiMa,
            });
        });
    }
    handleModify=()=>{
        const newData = {
        id: this.props.form.getFieldValue('id'),
        authorizerId: this.props.form.getFieldValue('authorizerId'),
        content: this.props.form.getFieldValue('content'),
        authorizerDate: this.props.form.getFieldValue('authorizerDate').format('YYYY-MM-DD'),
        authorizationId: this.state.item.authorizationId
        };
	    $.ajax({
	        type: "post",
		    url: baseAddress+"/cma/StaffAuthorization/modifyOne",
		    data: newData,
		    async: false,
		    success: function (d) {
		        message.success("修改成功");
		      	}
		    });
        this.setState({
            visible: false,
        });
        this.getAllStaff();
        getAuthorization();
        this.getAuthInfo();
        console.log(this.props.form.getFieldsValue());
        this.props.form.resetFields();
    }
  	componentWillMount() {
  		this.getAllStaff();
  	}
    render(){
        const options = this.state.StaffData.map(StaffData => <Option key={StaffData.id}>{StaffData.name}</Option>);
		const formItems = [];
        const { getFieldDecorator } = this.props.form;
		const formItemLayout =
		{
			labelCol: { span:6 },
			wrapperCol: { span:14 },
		};

		const width = '100%';
		return(
		<div>
            <Card key='0' title='授权信息'  style={{marginBottom: 20}}>
				<Row key='0'>
					<Col span={12}>
				        <FormItem
				        	 align="left"
				        >
				        姓名：
				        {this.state.item.name}
		        		</FormItem>
		        	</Col>
					<Col span={12}>
						<FormItem
		          			align="left"
		        		>
		        		部门：
		        		{this.state.item.department}
		        		</FormItem>
					</Col>
				</Row>
				<Row key='1'>
					<Col span={12}>
				        <FormItem
				        	align="left"
				        >
				        职称：
				        {this.state.item.position}
		        		</FormItem>
		        	</Col>
					<Col span={12}>
				        <FormItem
				        	align="left"
				        >
				        授权人：
				        {this.state.item.authorizerName}
		        		</FormItem>
		        	</Col>
				</Row>
				<Row key='2'>
					<Col span={12}>
				        <FormItem
				        	align="left"
				        >
				        授权内容：
				        {this.state.item.content}
		        		</FormItem>
		        	</Col>
		        	<Col span ={12}>
				        <FormItem
				        	align="left"
				        >
				        授权时间：
				        {this.state.item.authorizerDate}
		        		</FormItem>
		            </Col>
				</Row>
		    </Card>
		    <Button className="add" type="primary" onClick={this.showModal}>修改</Button>
                <Modal title="授权信息"  visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                <Form layout="horizontal">
                    <FormItem {...formItemLayout}label ="被授权人:" hasFeedback>
                    {getFieldDecorator('id',{ rules: [{required: true, message: '请选择被授权人!'}],
                    })(<Select
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="resigner"
                        placeholder="请选择被授权人"
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label= "授权人:" hasFeedback>
                    {getFieldDecorator('authorizerId',{ rules: [{required: true, message: '请选择授权人!'}],
                    })(<Select
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="resigner"
                        placeholder="请选择授权人"
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label= "授权内容:" hasFeedback>
                    {
                          getFieldDecorator('content', {rules :[{required: true, message: '请输入授权内容！'}],
                          initialValue:  this.state.item.content,})
                          (<Input  style = {{width:100,offset:4}}/>)
                    }
                    </FormItem>
                    <FormItem {...formItemLayout} label= "授权时间:" hasFeedback>
                                {getFieldDecorator('authorizerDate', {
                                  rules: [{required: true, message: '请输入授权时间!'}],
                                })(
                                  <DatePicker format="YYYY-MM-DD" />
                                )}
                    </FormItem>
                </Form>
            </Modal>
		</div>
        );
    }
}

const AIView = Form.create()(AIViewForm);

export default AIView;