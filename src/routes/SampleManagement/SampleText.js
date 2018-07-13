import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';
import SampleReceiveList from './SampleReceiveList';
import SampleReceiveInspect from './SampleReceiveInspect';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const MonthPicker = DatePicker.MonthPicker;
const { TextArea } = Input;
const dateFormat= 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class SampleReceipt extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            sampleId:this.props.sampleId,
            visible:false,
            item:null,
        }
    }
    getReceipt=()=>{
        $.get(baseAddress+"/cma/SampleReceipt/getOne?SampleId="+this.props.sampleId ,null,(res)=>{
            let item = res.data;
   		    this.setState({
   		        item:item
   		    })
        });
    }
    componentWillMount(){
        this.getReceipt();
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const width = '100%';
        if(this.state.item.ReadMe==0)
            this.state.item.ReadMe="没有该文档";
        else if(this.state.item.ReadMe==1)
            this.state.item.ReadMe="只有电子文档";
        else if(this.state.item.ReadMe==2)
            this.state.item.ReadMe="只有书面文档";
        else if(this.state.item.ReadMe==3)
            this.state.item.ReadMe="书面电子版都有";

        if(this.state.item.Application==0)
            this.state.item.Application="没有该文档";
        else if(this.state.item.Application==1)
            this.state.item.Application="只有电子文档";
        else if(this.state.item.Application==2)
            this.state.item.Application="只有书面文档";
        else if(this.state.item.Application==3)
            this.state.item.Application="书面电子版都有";

        if(this.state.item.MaterialReceipt==0)
            this.state.item.MaterialReceipt="没有该文档";
        else if(this.state.item.MaterialReceipt==1)
            this.state.item.MaterialReceipt="只有电子文档";
        else if(this.state.item.MaterialReceipt==2)
            this.state.item.MaterialReceipt="只有书面文档";
        else if(this.state.item.MaterialReceipt==3)
            this.state.item.MaterialReceipt="书面电子版都有";

        if(this.state.item.Function==0)
            this.state.item.Function="没有该文档";
        else if(this.state.item.Function==1)
            this.state.item.Function="只有电子文档";
        else if(this.state.item.Function==2)
            this.state.item.Function="只有书面文档";
        else if(this.state.item.Function==3)
            this.state.item.Function="书面电子版都有";

        if(this.state.item.Confirmations==0)
            this.state.item.Confirmations="没有该文档";
        else if(this.state.item.Confirmations==1)
            this.state.item.ReadMe="只有电子文档";
        else if(this.state.item.Confirmations==2)
            this.state.item.Confirmations="只有书面文档";
        else if(this.state.item.Confirmations==3)
            this.state.item.Confirmations="书面电子版都有";

        if(this.state.item.Introduction==0)
            this.state.item.Introduction="没有该文档";
        else if(this.state.item.Introduction==1)
            this.state.item.Introduction="只有电子文档";
        else if(this.state.item.Introduction==2)
            this.state.item.Introduction="只有书面文档";
        else if(this.state.item.Introduction==3)
            this.state.item.Introduction="书面电子版都有";

        if(this.state.item.Guarantee==0)
            this.state.item.Guarantee="没有该文档";
        else if(this.state.item.Guarantee==1)
            this.state.item.Guarantee="只有电子文档";
        else if(this.state.item.Guarantee==2)
            this.state.item.Guarantee="只有书面文档";
        else if(this.state.item.Guarantee==3)
            this.state.item.Guarantee="书面电子版都有";

        if(this.state.item.softwareSample==0)
            this.state.item.softwareSample="没有该文档";
        else if(this.state.item.softwareSample==1)
            this.state.item.softwareSample="有电子文档";

        if(this.state.item.softwareType==0)
            this.state.item.softwareType="系统软件";
        else if(this.state.item.softwareType==1)
            this.state.item.softwareType="支持软件";
        else if(this.state.item.softwareType==2)
            this.state.item.softwareType="应用软件";
        else if(this.state.item.softwareType==3)
            this.state.item.softwareType="其它软件";

        if(this.state.item.testType==0)
            this.state.item.testType="登记检测";
        else if(this.state.item.testType==1)
            this.state.item.testType="确认检测";
        else if(this.state.item.testType==2)
            this.state.item.testType="验收检测";

        return(
            <div>
                <Card key='0' title="样品接收单" style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={8}>
                            <FormItem align="left" >
                                软件名称：
                                {this.state.item.sampleName}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                申报单位：
                                {this.state.item.applicationUnit}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                产品版本号：
                                {this.state.item.version}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='1'>
                        <Col span={8}>
                            <FormItem align="left" >
                                合同登记编号：
                                {this.state.item.contractId}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                测试类型：
                                {this.state.item.testType}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                电子媒介：
                                {this.state.item.electronicMedia}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='2'>
                        <Col span={8}>
                            <FormItem align="left" >
                                《用户手册》：
                                {this.state.item.ReadMe}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《软件登记检测申请表》：
                                {this.state.item.Application}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《材料交接单》：
                                {this.state.item.MaterialReceipt}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='3'>
                        <Col span={8}>
                            <FormItem align="left" >
                                《软件产品功能列表》：
                                {this.state.item.Function}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《软件名称版本号确认单》：
                                {this.state.item.Confirmations}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem align="left" >
                                《受测软件产品简介》：
                                {this.state.item.Introduction}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='4'>
                        <Col span={12}>
                            <FormItem align="left" >
                                《自主产权保证书》：
                                {this.state.item.Guarantee}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                软件样品一套：
                                {this.state.item.softwareSample}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='5'>
                        <Col>
                            <FormItem align="left" >
                                其他材料：
                                {this.state.item.others}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='6'>
                        <Col span={12}>
                            <FormItem align="left" >
                                软件类型：
                                {this.state.item.softwareType}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                接收单位：
                                {this.state.item.receiveUnit}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='7'>
                        <Col>
                            <FormItem align="left" >
                                接收日期：
                                {this.state.item.receiveDate}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='8'>
                        <Col span={12}>
                            <FormItem align="left" >
                                送样人：
                                {this.state.item.sender}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                受理人：
                                {this.state.item.receiver}
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}