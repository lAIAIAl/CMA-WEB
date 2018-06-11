import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import AuthInspectView from './AuthInspectView';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;
const dataFormat= 'YYYY-MM-DD';

class SAIForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        }, {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        }, {
        title: '职位',
        dataIndex: 'position',
        key: 'position',
        }, {
        title: '授权内容',
        dataIndex: 'content',
        key:'content',
        },{
        title: '授权人姓名',
        dataIndex: 'authorizerName',
        key:'authorizerName',
        },{
        title: '授权时间',
        dataIndex: 'authorizerDate',
        key:'authorizerDate',
        },{
        title: '操作',
        colSpan: 2,
        dataIndex: 'check',
        width: '7%',
        key: 'check',
        render:(text,record)=>{
            let AuthData:null;
            let dataSource = this.state.AuthData;
            for(var i=this.state.AuthData.length-1;i>=0;i--)
            {
                if(record.authorizationId==this.state.AuthData[i].authorizationId)
                    AuthData = this.state.AuthData[i];
            }
            var props ={
                item: record,
                AuthData: AuthData,
                dataSource: dataSource,
            }
            return(
            <div>
                <Button onClick={()=>{this.handleInspect(props)}}>查看</Button>
            </div>
            );
            },
        },{
        title: '操作',
        colSpan: 0,
        dataIndex: 'delete',
        width: '7%',
        key:'delete',
        render: (text, record) => {
            return (
                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
                <Button>Delete</Button>
                </Popconfirm>
            );
        },
        }];
        this.state = {
            visible: false,
            AuthData:[],
            id:this.props.item.id,
        };
    }
    onDelete = (key) => {
  	    $.ajax({
	        type: "post",
	        url: baseAddress+"/cma/StaffAuthorization/deleteOne",
	        data: {authorizationId:key},
	        async:false,
	        success: function (d) {
	        }
	    });
	    this.search();
    }
    componentWillMount(){
        this.search();
    }
    search=()=>{
        const newData = {
              id: this.state.id,
              }
      		$.get(baseAddress+"/cma/StaffAuthorization/getAllByStaff?id="+newData.id ,null,(res)=>{
                let test = res.data;
      		    for (var i = test.length - 1; i >= 0; i--) {
      			    test[i].key = test[i].authorizationId;
      		    }
      		    this.setState({
      		        AuthData: test
      		    })
      		});
        console.log(this.props.form.getFieldsValue());
        this.props.form.resetFields();
    }
    handleInspect = (props) => {
         this.props.addTab("授权详情", "授权详情", AuthInspectView, props);
    }

    render(){
        const{AuthData}=this.state;
        const columns= this.columns;
        return(
            <Form>
                <FormItem>
                    <Button type="primary" onClick={this.search}>刷新</Button>
                </FormItem>
                <FormItem>
                    <Table bordered dataSource={this.state.AuthData} columns={columns} />
                </FormItem>
            </Form>
        );
    }
}

const SAI = Form.create()(SAIForm);

export default SAI;