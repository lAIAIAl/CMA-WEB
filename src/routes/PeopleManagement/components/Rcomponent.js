import reqwest from 'reqwest';
import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
const FormItem = Form.Item;


// const columns = [{
//     title: 'Name',
//     dataIndex: 'name',
//     sorter: true,
//     render: name => `${name.first} ${name.last}`,
//     width: '20%',
// }, {
//     title: 'department',
//     dataIndex: 'gender',
//     filters: [
//         { text: 'Male', value: 'male' },
//         { text: 'Female', value: 'female' },
//     ],
//     width: '20%',
// }, {
//     title: 'position',
//     dataIndex: 'email',
// }];

const columns = [{
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
    },{
    title: 'leavingDate',
    dataIndex: 'leavingDate',
    } ,
    //{
    // title: 'operation',
    //     dataIndex: 'operation',
    //     render: (text, record) => (
    //         <span>
    //             <a href="javascript:;" onClick={()=> {
    //                 this.showCurRowMessage(props);
    //             }}>Detail</a>
    //         </span>
    //     ),
    // }
        ];

class App extends React.Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
    };
    showCurRowMessage(props)
    {
        this.props.addTab("离任人员信息","离任人员信息",myView,props);
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
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
            // url: 'https://randomuser.me/api',
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


    render() {
        return (
            <Table columns={columns}
                   rowKey={record => record.id}
                   dataSource={this.state.data}
                   // pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleTableChange}
            />
        );
    }
}

export default class TestView extends React.Component{
    render(){
        return(
            <Form>
                {/*<FormItem>*/}
                {/*姓名：   <Input placeholder="input"  style ={{width: 100,offset:4}} />*/}
                {/*</FormItem>*/}
                {/*<FormItem>*/}
                {/*<Button type="primary" icon="search" >Search</Button>*/}
                {/*</FormItem>*/}
                <FormItem>
                    <App />
                </FormItem>
            </Form>
        )
    }
}