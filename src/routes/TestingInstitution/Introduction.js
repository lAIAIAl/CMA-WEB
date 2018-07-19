import React, {Component, PropTypes} from 'react';
import {Row, Col, Card, Tabs, Select,Radio, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, InputNumber, DatePicker, Divider, Modal, Tooltip, AutoComplete, message} from 'antd';
import AddView from 'common/basic/components/AddView';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {baseAddress} from 'services';
import $ from 'lib/jquery-3.3.1';

const RadioGroup = Radio.Group;
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
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};


class IntroductionForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            visible:false,
            introduction:{},
            character:"0",
            f_style:"0",
        }
    }
    handleCancel=()=>{
        this.setState({
        visible:false,
        });
        this.props.form.resetFields();
    }
    showModal=()=>{
        this.setState({
            visible:true,
        });
    }
    componentWillMount(){
        this.getIntroduction();
    }
    getIntroduction=()=>{
        $.get(baseAddress+"/cma/TestingInstitutionInformation/get" ,null,(res)=>{
            this.setState({
                introduction:res.data,
            });
        })
    }
    handleModify=()=>{
        const newData={
            testingInstitutionName:this.props.form.getFieldValue('testingInstitutionName'),
            testingInstitutionAddress:this.props.form.getFieldValue('testingInstitutionAddress'),
            postcode:this.props.form.getFieldValue('postcode'),
            fax:this.props.form.getFieldValue('fax'),
            email:this.props.form.getFieldValue('email'),
            tiPeopleInCharge:this.props.form.getFieldValue('tiPeopleInCharge'),
            tiPicPosition:this.props.form.getFieldValue('tiPicPosition'),
            tiPicTelephone:this.props.form.getFieldValue('tiPicTelephone'),
            tiPicMobilephone:this.props.form.getFieldValue('tiPicMobilephone'),
            liaison:this.props.form.getFieldValue('liaison'),
            liaisonPosition:this.props.form.getFieldValue('liaisonPosition'),
            liaisonTelephone:this.props.form.getFieldValue('liaisonTelephone'),
            liaisonMobilephone:this.props.form.getFieldValue('liaisonMobilephone'),
            socialCreditCode:this.props.form.getFieldValue('socialCreditCode'),
            legalEntityBelongedName:this.props.form.getFieldValue('legalEntityBelongedName'),
            legalEntityBelongedAddress:this.props.form.getFieldValue('legalEntityBelongedAddress'),
            lebPeopelInCharge:this.props.form.getFieldValue('lebPeopelInCharge'),
            lebPicPosition:this.props.form.getFieldValue('lebPicPosition'),
            lebPicTelephone:this.props.form.getFieldValue('lebPicTelephone'),
            lebSocialCreditCode:this.props.form.getFieldValue('lebSocialCreditCode'),
            competentDepartmentName:this.props.form.getFieldValue('competentDepartmentName'),
            competentDepartmentAddress:this.props.form.getFieldValue('competentDepartmentAddress'),
            cdPeopelInCharge:this.props.form.getFieldValue('cdPeopelInCharge'),
            cdPicPosition:this.props.form.getFieldValue('cdPicPosition'),
            cdPicTelephone:this.props.form.getFieldValue('cdPicTelephone'),
            characteristic:this.props.form.getFieldValue('characteristic'),
            legalEntity:this.props.form.getFieldValue('legalEntity'),
        }
        $.ajax({
		    type: "post",
		    url: baseAddress+"/cma/TestingInstitutionInformation/modify",
		    data: newData,
		    async: false,
		    success: function (d) {
			message.success("修改成功");
	  	    }
	    });
        this.props.form.resetFields();
        this.getIntroduction();
        this.setState({
            visible:false,
        });
    }
    render()
    {
        if(this.state.introduction.characteristic==0)
            this.state.character="固定";
        else if(this.state.introduction.characteristic==1)
            this.state.character="临时";
        else if(this.state.introduction.characteristic==2)
            this.state.character="可移动";
        else if(this.state.introduction.characteristic==3)
            this.state.character="多场所";

        if(this.state.introduction.legalEntity==0)
            this.state.f_style="独立法人检验检测机构--社团法人";
        if(this.state.introduction.legalEntity==1)
            this.state.f_style="独立法人检验检测机构--事业法人";
        if(this.state.introduction.legalEntity==2)
            this.state.f_style="独立法人检验检测机构--企业法人";
        if(this.state.introduction.legalEntity==3)
            this.state.f_style="独立法人检验检测机构--机关法人";
        if(this.state.introduction.legalEntity==4)
            this.state.f_style="独立法人检验检测机构--其他";
        if(this.state.introduction.legalEntity==5)
            this.state.f_style="检验检测机构所属法人--社团法人";
        if(this.state.introduction.legalEntity==6)
            this.state.f_style="检验检测机构所属法人--事业法人";
        if(this.state.introduction.legalEntity==7)
            this.state.f_style="检验检测机构所属法人--企业法人";
        if(this.state.introduction.legalEntity==8)
            this.state.f_style="检验检测机构所属法人--机关法人";
        if(this.state.introduction.legalEntity==9)
            this.state.f_style="检验检测机构所属法人--其他";
        console.log(this.state.introduction.legalEntity);
        const { getFieldDecorator } = this.props.form;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return(
            <div>
                <Card key='0' title="检测机构概况" style={{marginBottom: 20}}>
                    <Row key='0'>
                        <Col span={12}>
                            <FormItem align="left" >
                                检测检验机构名称：
                                {this.state.introduction.testingInstitutionName}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                检测检验机构地址：
                                {this.state.introduction.testingInstitutionAddress}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='1'>
                        <Col span={12}>
                            <FormItem align="left" >
                                邮编：
                                {this.state.introduction.postcode}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                传真：
                                {this.state.introduction.fax}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='2'>
                        <FormItem align="left" >
                            Email地址：
                            {this.state.introduction.email}
                        </FormItem>
                    </Row>
                    <Row key='3'>
                        <Col span={12}>
                            <FormItem align="left" >
                                负责人：
                                {this.state.introduction.tiPeopelInCharge}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                负责人职务：
                                {this.state.introduction.tiPicPosition}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='4'>
                        <Col span={12}>
                            <FormItem align="left" >
                                负责人固定电话：
                                {this.state.introduction.tiPicTelephone}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                负责人手机：
                                {this.state.introduction.tiPicMobilephone}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='5'>
                        <Col span={12}>
                            <FormItem align="left" >
                                联络人：
                                {this.state.introduction.liaison}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                联络人职务：
                                {this.state.introduction.liaisonPosition}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='6'>
                        <Col span={12}>
                            <FormItem align="left" >
                                联络人固定电话：
                                {this.state.introduction.liaisonTelephone}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem align="left" >
                                联络人手机：
                                {this.state.introduction.liaisonMobilephone}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='7'>
                        <Col span={12}>
                            <FormItem>
                                社会信用代码：
                                {this.state.introduction.socialCreditCode}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                所属法人单位名称：
                                {this.state.introduction.legalEntityBelongedName}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='8'>
                            <FormItem>
                                地址：
                                {this.state.introduction.legalEntityBelongedAddress}
                            </FormItem>
                    </Row>
                    <Row key='9'>
                        <Col span={12}>
                            <FormItem>
                                负责人：
                                {this.state.introduction.lebPeopelInCharge}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                负责人职务：
                                {this.state.introduction.lebPicPosition}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='10'>
                        <Col span={12}>
                            <FormItem>
                                负责人电话：
                                {this.state.introduction.lebPicTelephone}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                社会信用代码：
                                {this.state.introduction.lebSocialCreditCode}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='11'>
                        <Col span={12}>
                            <FormItem>
                                主管部门名称：
                                {this.state.introduction.competentDepartmentName}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                地址：
                                {this.state.introduction.competentDepartmentAddress}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='12'>
                        <Col span={12}>
                            <FormItem>
                                负责人：
                                {this.state.introduction.cdPeopelInCharge}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                负责人职务：
                                {this.state.introduction.cdPicPosition}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row key='13'>
                        <FormItem>
                            负责人电话：
                            {this.state.introduction.cdPicTelephone}
                        </FormItem>
                    </Row>
                    <Row key='14'>
                        <Col span={12}>
                            <FormItem>
                                检测机构设施特点：
                                {this.state.character}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                法人类别：
                                {this.state.f_style}
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
                <Button type="primary" onClick={this.showModal} >
                    修改
                </Button>
                    <Modal title="修改机构信息"  visible={this.state.visible} onOk={this.handleModify} onCancel={this.handleCancel}>
                        <Form layout="horizontal">
                            <FormItem {...formItemLayout}label= "检测机构名称:" hasFeedback>
                                { getFieldDecorator('testingInstitutionName', {rules :[{required: true, message: '请输入检测检验机构名称！'}],initialValue:this.state.introduction.testingInstitutionName,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "检测机构地址:" hasFeedback>
                                { getFieldDecorator('testingInstitutionAddress', {rules :[{required: true, message: '请输入检测检验机构地址！'}],initialValue:this.state.introduction.testingInstitutionAddress,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "邮编:" hasFeedback>
                                { getFieldDecorator('postcode', {rules :[{required: true, message: '请输入邮编！'}],initialValue:this.state.introduction.postcode,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "传真:" hasFeedback>
                                { getFieldDecorator('fax', {rules :[{required: true, message: '请输入传真！'}],initialValue:this.state.introduction.fax,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "Email地址:" hasFeedback>
                                { getFieldDecorator('email', {rules :[{required: true, message: '请输入Email地址！'}],initialValue:this.state.introduction.email,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人:" hasFeedback>
                                { getFieldDecorator('tiPeopelInCharge', {rules :[{required: true, message: '请输入负责人！'}],initialValue:this.state.introduction.tiPeopelInCharge,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人职务:" hasFeedback>
                                { getFieldDecorator('tiPicPosition', {rules :[{required: true, message: '请输入负责人职务！'}],initialValue:this.state.introduction.tiPicPosition,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人固定电话:" hasFeedback>
                                { getFieldDecorator('tiPicTelephone', {rules :[{required: true, message: '请输入负责人固定电话！'}],initialValue:this.state.introduction.tiPicTelephone,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人手机:" hasFeedback>
                                { getFieldDecorator('tiPicMobilephone', {rules :[{required: true, message: '请输入负责人手机！'}],initialValue:this.state.introduction.tiPicMobilephone,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "联络人:" hasFeedback>
                                { getFieldDecorator('liaison', {rules :[{required: true, message: '请输入联络人！'}],initialValue:this.state.introduction.liaison,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "联络人职务:" hasFeedback>
                                { getFieldDecorator('liaisonPosition', {rules :[{required: true, message: '请输入联络人职务！'}],initialValue:this.state.introduction.liaisonPosition,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "联络人固定电话:" hasFeedback>
                                { getFieldDecorator('liaisonTelephone', {rules :[{required: true, message: '请输入联络人固定电话！'}],initialValue:this.state.introduction.liaisonTelephone,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "联络人手机:" hasFeedback>
                                { getFieldDecorator('liaisonMobilephone', {rules :[{required: true, message: '请输入联络人手机！'}],initialValue:this.state.introduction.liaisonMobilephone,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "社会信用代码:" hasFeedback>
                                { getFieldDecorator('socialCreditCode', {rules :[{required: true, message: '请输入社会信用代码！'}],initialValue:this.state.introduction.socialCreditCode,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "所属法人单位名:" hasFeedback>
                                { getFieldDecorator('legalEntityBelongedName', {rules :[{required: true, message: '请输入所属法人单位名称！'}],initialValue:this.state.introduction.legalEntityBelongedName,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "地址:" hasFeedback>
                                { getFieldDecorator('legalEntityBelongedAddress', {rules :[{required: true, message: '请输入地址！'}],initialValue:this.state.introduction.legalEntityBelongedAddress,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人:" hasFeedback>
                                { getFieldDecorator('lebPeopelInCharge', {rules :[{required: true, message: '请输入负责人！'}],initialValue:this.state.introduction.lebPeopelInCharge,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人职务:" hasFeedback>
                                { getFieldDecorator('lebPicPosition', {rules :[{required: true, message: '请输入负责人职务！'}],initialValue:this.state.introduction.lebPicPosition,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人电话:" hasFeedback>
                                { getFieldDecorator('lebPicTelephone', {rules :[{required: true, message: '请输入负责人电话！'}], initialValue:this.state.introduction.lebPicTelephone, })
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "社会信用代码:" hasFeedback>
                                { getFieldDecorator('lebSocialCreditCode', {rules :[{required: true, message: '请输入社会信用代码！'}],initialValue:this.state.introduction.lebSocialCreditCode,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "主管部门名称:" hasFeedback>
                                { getFieldDecorator('competentDepartmentName', {rules :[{required: true, message: '请输入主管部门名称！'}],initialValue:this.state.introduction.competentDepartmentName,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "地址:" hasFeedback>
                                { getFieldDecorator('competentDepartmentAddress', {rules :[{required: true, message: '请输入地址！'}],initialValue:this.state.introduction.competentDepartmentAddress,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人:" hasFeedback>
                                { getFieldDecorator('cdPeopelInCharge', {rules :[{required: true, message: '请输入负责人！'}],initialValue:this.state.introduction.cdPeopelInCharge,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人职务:" hasFeedback>
                                { getFieldDecorator('cdPicPosition', {rules :[{required: true, message: '请输入负责人职务！'}],initialValue:this.state.introduction.cdPicPosition,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label= "负责人电话:" hasFeedback>
                                { getFieldDecorator('cdPicTelephone', {rules :[{required: true, message: '请输入负责人电话！'}],initialValue:this.state.introduction.cdPicTelephone,})
                                 (<Input  style = {{width:200,offset:4}}/>) }
                            </FormItem>
                            <FormItem {...formItemLayout} label ="机构设施特点:" hasFeedback>
                                {getFieldDecorator('characteristic', {rules :[{required: true, message: '请选择检测机构设施特点！'}],initialValue:this.state.introduction.characteristic,
                                })
                                (
                                    <RadioGroup name={"检测机构设施特点:"} disabled={this.props.disable} >
                                        <Radio value={0}/>固定
                                        <Radio value={1}/>临时
                                        <Radio value={2}/>可移动
                                        <Radio value={3}/>多场所
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem {...formItemLayout} label ="法人类别:" hasFeedback>
                                {getFieldDecorator('legalEntity', {rules :[{required: true, message: '请选择法人类别！'}],initialValue:this.state.introduction.legalEntity,
                                })
                                (
                                    <RadioGroup name={"法人类别:"} disabled={this.props.disable} >
                                        独立法人检测检验机构：
                                        <br />
                                        <Radio value={0}/>社团法人
                                        <Radio value={1}/>事业法人
                                        <Radio value={2}/>企业法人
                                        <Radio value={3}/>机关法人
                                        <Radio value={4}/>其他
                                        检验检测机构所属法人：
                                        <br />
                                        <Radio value={5}/>社团法人
                                        <Radio value={6}/>事业法人
                                        <Radio value={7}/>企业法人
                                        <Radio value={8}/>机关法人
                                        <Radio value={9}/>其他
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                        </Form>
                    </Modal>
            </div>
        );
    }
}

const Introduction = Form.create()(IntroductionForm);

export default Introduction;