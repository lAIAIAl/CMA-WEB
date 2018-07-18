import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;
import InternalAuditDocument from "./InternalAuditDocument"
class InternalAuditList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                /*{
                    key:'0',
                    "year": "2017",
                    "date": "2017-12-23",
                },
                {
                    key:'1',
                    "year": "2018",
                    "date": "2018-12-23",

                }*/
            ],
            pagination: {},
            loading: false,
            filtersInfo: null,
            visible: false,

        };
        this.columns = [{
            title: '内审年份',
            dataIndex: 'year',
            sorter: (a, b) => a.year - b.year,
        }, {
            title: '内审日期',
            dataIndex: 'date',
        }, {
            title: 'operation',
            dataIndex: 'detail',
            colSpan: 1,
            width: '7%',
            render: (text, record) => (

                <Button type="primary" onClick={() =>{
                var props = {
                  item: record,
                }
                this.showCurRowMessage(props)
                 }}>
                    查看
                </Button>
            ),

        }, {
            title: 'operation',
            dataIndex: 'delete',
            colSpan: 0,
            width: '7%',
            render: (text, record) => (
                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.year)}>
                    <Button type="danger" >
                        删除
                    </Button>
                </Popconfirm>

            ),

        }
        ];

    }
    getAll =()=>{
        $.get("http://119.23.38.100:8080/cma/InternalAuditManagement/getAll",null,(res)=>{
            this.setState({data:res.data})
        });
    }

    showCurRowMessage = (props) => {
        this.props.addTab(props.item.year+"年内审文档", props.item.year+"年内审文档", InternalAuditDocument, props);
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onDelete = (year) => {

            $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/InternalAuditManagement/deleteOne",
            data:{year:year},
            async:false,
            success:function(d){
                alert("删除成功");
                }
        });

        this.getAll();


    }

    componentWillMount(){
        this.getAll();
    }

    handleAdd =() =>{
        /*const {data} = this.state;
        const newData={
            year:this.props.form.getFieldValue('year'),
            date: this.props.form.getFieldValue('date').format('YYYY-MM-DD'),
        };
        this.setState({
            data:[...data,newData],
        })*/
        const newItem ={
            year: this.props.form.getFieldValue('date').format('YYYY'),
            date: this.props.form.getFieldValue('date').format('YYYY-MM-DD'),
        };
        $.ajax({
            type:"post",
            url:"http://119.23.38.100:8080/cma/InternalAuditManagement/addOne",
            data:newItem,
            async:false,
            success:function (d) {
                alert("新增成功");
            }
        });
        this.setState({
            visible:false,
        });
        this.getAll();
        this.props.form.resetFields();
    }
    showModal = () => {
        this.setState({visible: true,});
    }
    downLoad =() =>{
        const url = "http://119.23.38.100:8080/cma/InternalAuditManagement/getExample";
        var tempwindow = window.open();
        tempwindow.location = url;
    }

    render() {
        const columns = this.columns;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout =
            {
                labelCol: {span: 8},
                wrapperCol: {span: 14},
            };
        return (
            <div>
            <FormItem>
                <div>
                <Button 
                    style={{margin:'10px 20px 10px 0px'}}
                type="primary" onClick={this.showModal}>
                    新增
                </Button>
                <Button style={{margin:'10px 20px 10px 0px'}} type="primary" onClick={this.downLoad}>
                    下载模版
                </Button>
                </div>
                <Table columns={columns}
                       rowKey={record => record.id}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                       onChange={this.handleTableChange}
                />
            </FormItem>
                <Modal title="新增内审" visible={this.state.visible} onOk={this.handleAdd}
                       onCancel={this.handleCancel}>
                    <Form layout="horizontal">
                        {/*<FormItem {...formItemLayout} label="内审年份:" hasFeedback>
                            {
                                getFieldDecorator('year', {
                                    rules: [{required: true, message: '请输入年份！'}],
                                })
                                (<Input style={{width: 100, offset: 4}}/>)
                            }
                        </FormItem>*/}
                        <FormItem {...formItemLayout} label= "内审时间:" hasFeedback>
                        {getFieldDecorator('date', {
                            rules: [{required: true, message: '请输入内审时间!'}],
                        })
                        (
                            <DatePicker format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    </Form>
                </Modal>
            </div>

        );
    }
}
InternalAuditList = Form.create({})(InternalAuditList);
class InternalAuditComponent extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <InternalAuditList addTab={this.props.addTab} />
                </FormItem>
            </Form>
        )
    }
}

export default InternalAuditComponent;
