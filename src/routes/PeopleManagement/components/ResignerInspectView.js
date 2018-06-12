import React, { Component }from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import ReactDOM from 'react-dom';
const FormItem = Form.Item;

class ResignerInspectView extends React.Component{

    constructor(props){
        super(props);
    }
    render()
    {


        return(

            <Card key='0' title='离任人员信息' style={{marginBottom: 20}}>
                <Row key='0'>
                    <Col span={12}>
                        <FormItem
                            label="姓名"
                        >
                            {this.props.name}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="部门"
                        >
                            {this.props.department}
                        </FormItem>
                    </Col>
                </Row>
                <Row key='1'>
                    <Col span={12}>
                        <FormItem label='职位'>
                            {this.props.position}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='离任日期'>
                            {this.props.leavingDate}
                        </FormItem>
                    </Col>
                </Row>
            </Card>
        );
    }

}

export default ResignerInspectView
/*
export default class newView extends React.Component{
    render()
    {
        return(
            <form>
            <formItem>
                <myView />
            </formItem>
        </form>)
    }

}*/
