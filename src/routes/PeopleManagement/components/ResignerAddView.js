import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, DatePicker, InputNumber, Card } from 'antd';
import reqwest from "reqwest";
import $ from 'lib/jquery-3.3.1';


const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;

class ResignerAddView extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        data: [],
        loading: false,
    };

    handleChange(value) {
        console.log(`selected ${value}`);

    }

    handleBlur() {
        console.log('blur');
    }

    handleFocus() {
        console.log('focus');
    }



    fetch = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            url: 'http://119.23.38.100:8080/cma/StaffManagement/getAll',
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
            });
        });
    }

    componentDidMount() {
        this.fetch();
    }
    myAdd()
    {
        const leavingDate = this.props.form.getFieldValue('leavingDate').format('YYYY-MM-DD');
        const id = this.props.form.getFieldValue('id');

        $.ajax(
            {
                type: "post",
                url: 'http://119.23.38.100:8080/cma/StaffLeaving/addOne',
                data: {
                    "id":id,
                    "leavingDate":leavingDate
                },
                async:false,
                success: function (d) {
                    alert("新增成功");
                }

            }
        );
        this.fetch();
        this.props.form.resetFields();

    }

    render(){
        const options = this.state.data.map(data => <Option key={data.id}>{data.name}</Option>);
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 30 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 30 },
                sm: { span: 10 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 30,
                    offset: 20,
                },
                sm: {
                    span: 20,
                    offset: 10,
                },
            },
        };
        return(

            <div>
               <FormItem {...formItemLayout} label = "离任人员">
                    {getFieldDecorator('id',{
                        rules: [{required: true, message: '请输入时间!'}],
                    })(<Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a person"
                        optionFilterProp="resigner"
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>)}
                </FormItem>
                <br />
                <FormItem {...formItemLayout} label="离任日期">

                    {getFieldDecorator('leavingDate', {
                        rules: [{required: true, message: '请输入时间!'}],
                    })( <DatePicker />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={()=>{this.myAdd()}}>
                    提交
                </Button>
                </FormItem>
            </div>

        );
    }



}

ResignerAddView = Form.create({})(ResignerAddView);

export default ResignerAddView
