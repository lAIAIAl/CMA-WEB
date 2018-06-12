import reqwest from 'reqwest';
import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
import ResignerInspectView from './ResignerInspectView'
import ResignerAddView from "./ResignerAddView";
const FormItem = Form.Item;
const Option = Select.Option;
import $ from 'lib/jquery-3.3.1';
const { MonthPicker, RangePicker } = DatePicker;


class App extends React.Component {
    constructor(props) {
        super(props);


        this.columns = [{
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            width: '20%',
        }, {
            title: 'department',
            dataIndex: 'department',
            width: '20%',
        },
            {
                title: 'position',
                dataIndex: 'position',
                width: '20%',
            }, {
                title: 'leavingDate',
                dataIndex: 'leavingDate',
            }
            ,
            {
            title: 'operation',
                dataIndex: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={()=> {
                            props = record;
                            this.showCurRowMessage(props)
                        }}>Detail</a>
                    </span>
                ),
            }
        ];

    }

    state = {
        data: [],
        pagination: {},
        loading: false,
    };


    showCurRowMessage = (props) =>
    {
        this.props.addTab("离任人员信息","离任人员信息",ResignerInspectView,props);
    }


    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            data: pagination.pageSize,
            //显示数量
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }
    fetch = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });
        reqwest({
            url: 'http://119.23.38.100:8080/cma/StaffLeaving/getAll',
            method: 'get',
            data: {
                ...params,

            },
            type: 'json',
        }).then((data) => {
            const pagination = { ...this.state.pagination };
            // Read total count from server
            pagination.total = data.totalCount;
            //  pagination.total = 200;
            this.setState({
                loading: false,
                data: data.data,
                pagination,
            });
        });
        console.log('data',this.state.data);
    }



    componentDidMount() {
        this.fetch();
    }


    refreshData(){
        this.fetch();
    }


    addResigner=()=>{

        this.props.addTab("新增离任人员","新增离任人员",ResignerAddView);

    }



    render() {
        const columns = this.columns;

        return (
            <Form>
                <FormItem >
                    <Button type="primary" onClick={()=>
                    {
                        this.refreshData()}}>刷新
                    </Button>
                </FormItem>
                <FormItem >
                        <Button type="primary" onClick={()=>
                        {
                            this.addResigner()}}>新增离任人员
                        </Button>
                </FormItem>
                <FormItem>
                        <Table columns={columns}
                               rowKey={record => record.id}
                               dataSource={this.state.data}
                               pagination={this.state.pagination}
                               loading={this.state.loading}
                               onChange={this.handleTableChange}
                        />

                 </FormItem>
            </Form>
        );
    }
}


App = Form.create({})(App);

export default class TestView extends React.Component{
    render(){
        return(
            <Form>
                <FormItem>
                    <App addTab={this.props.addTab}/>
                </FormItem>
            </Form>
        )
    }
}

