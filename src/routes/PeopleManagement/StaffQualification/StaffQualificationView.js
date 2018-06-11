import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox, Upload, Popconfirm, Button, Icon, Table, Form, Input, Modal, AutoComplete, message} from 'antd';

import StaffQualificationInspect from './StaffQualificationInspect'
import StaffQualificationPersonalView from './StaffQualificationPersonalView'
import {baseAddress} from 'services/index'
import $ from 'lib/jquery-3.3.1';

const FormItem=Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const AutoCompleteOption = AutoComplete.Option;
const TabPane = Tabs.TabPane;

//style
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class TestViewForm extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      visible: false,
      confirmDirty: false,
      autoCompleteResult: [],
      filteredInfo: null,
      fileData: [],
      fileList: [],
      uploading: false,
      allPeople: [],
      searchId: 0, // for search
      select: null,
      count: 1, //ob key
    };

    this.handleAdd=this.handleAdd.bind(this);
    this.handleSelectChange=this.handleSelectChange.bind(this);
  }

  handleAddTab = (props) => {
    console.log(props);
    this.props.addTab("人员资质信息", "人员资质信息", StaffQualificationInspect, props);
  }

  //新增时
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  //新增时数据的上传
  handleAdd = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if(err) {
        return ;
      }
    });

    const {fileList} = this.state;

   var pid = this.props.form.getFieldValue('pid');
   var qname = this.props.form.getFieldValue('qualificationName');
   var formda = new FormData();
   formda.append("id", pid);
   formda.append("qualificationName", qname);
   fileList.forEach((file) => {
    formda.append("qualificationImage", file);
   });

   this.setState({
    visible:false,
    uploading: true,
   });
   //var request = new XMLHttpRequest();
   //request.open("POST", "http://119.23.38.100:8080/cma/StaffQualification/addOne");
   //request.send(formda);

  $.ajax({
    type: "post",
    url: "http://119.23.38.100:8080/cma/StaffQualification/addOne",
    data: formda,
    processData: false,
    contentType: false,
    async: false,
    success: () => {
      message.success("新增成功");
      this.setState({
        fileList: [],
        uploading: false,
      });
    },
    error: () => {
      message.error("新增失败");
      this.setState({
        uploading: false,
      });
    }
   });

    this.props.form.resetFields();
  }

  
  handleChange = (pagination, filters) => {
    console.log('Various parameters', pagination, filters);
    this.setState({
      filteredInfo: filters,
    });
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return ;
      }
      console.log('Received values of form: ', values);
    });
  }

  onDelete = (key) => {
    console.log(key);
    let id = key;
    $.ajax({
    type: "post",
    url: "http://119.23.38.100:8080/cma/StaffQualification/deleteOne",
    data: {qualificationId: id},
    async: false,
    success:function(d) {
      message.success("删除成功");
    }
   });
  }

  onRecNPD = () => {
    $.get("http://119.23.38.100:8080/cma/StaffFile/getAll", null,(res) =>{
      let temp = res.data;
      for(var i = temp.length-1; i >= 0; i--) {
        temp[i].key = temp[i].id;
      }
      this.setState({
        allPeople: temp
      })
    })
  }

  onRec = () => {
    $.get("http://119.23.38.100:8080/cma/StaffQualification/getAll", null,(res) =>{
      let temp = res.data;
      for(var i = temp.length-1; i >= 0; i--) {
        temp[i].key = temp[i].qualificationId;
      }
      this.setState({
        fileData: temp
      })
    })
  }

  handleImage = (key) => {
    console.log(key);
    const url = "http://119.23.38.100:8080/cma/StaffQualification/getImage?qualificationId="+key;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  handleSearch = (key) => {
    const newid = this.props.form.getFieldValue('id');

    /*var props = {
      item: {
        id: newid,
      }
    }
    this.props.addTab("个人资质信息","个人资质信息",StaffQualificationPersonalView,props);
    */
    $.get("http://119.23.38.100:8080/cma/StaffQualification/getAllByStaff?id="+newid, null,(res) =>{
      let temp = res.data;
      for(var i = temp.length-1; i >= 0; i--) {
        temp[i].key = temp[i].qualificationId;
        for(var j = this.state.allPeople.length-1; j >= 0; j--) {
          if(this.state.allPeople[j].id == newid) {
            temp[i].name = this.state.allPeople[j].name;
            temp[i].position = this.state.allPeople[j].position;
            temp[i].department = this.state.allPeople[j].department;
            temp[i].id = newid;
          }
        }
      }
      this.setState({
        fileData: temp
      })
    })
  }

  handleSelectChange(value) {
    const newpid = this.props.form.getFieldValue('pid');
    console.log(newpid);
  }

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  componentWillMount() {
    this.onRecNPD();
    this.onRec();
  }

	render()
	{
    //const options = this.state.fileData.map(d => <Option key={d.qualificationId}>{d.name}</Option>);
    const options = this.state.allPeople.map(d => <Option key={d.id}>{d.name}</Option>);
    const peopleoptions = this.state.allPeople.map(d => <Option key={d.id}>{d.name}</Option>);
    
    const columns = [{
      title: '名称',
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
      title: '资质名称',
      dataIndex: 'qualificationName',
      key: 'qualificationName',
    }, {
      title: '资质证书扫描件',
      dataIndex: 'qualificationImage',
      key: 'qualificationImage',
      render: (text, record) => {
        return (
          <a onClick={() => this.handleImage(record.key)}>查看</a>
        );
      }
    }, {
      title: '操作', 
      colSpan: 2, 
      width: '10%',
      key: 'inspect', 
      render: (text, record) => { 
        let fileData: null;
        let dataSource = this.state.fileData;
        for(var i = this.state.fileData.length-1; i >= 0; i--){
          if(record.qualificationId == this.state.fileData[i].qualificationId)
            fileData = this.state.fileData[i];
        }

        var props = 
        {
          item: record,
          fileData: fileData,
          dataSource: dataSource,
        }
        return (
          <div>
            <Button onClick={() => this.handleAddTab(props)}>Inspect</Button> 
          </div> 
        );
      },
    }, {
      title: '操作', 
      colSpan: 0, 
      width: '10%',
      key: 'delete', 
      render: (text, record) => { 
        return (
          <div>
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <Button>Delete</Button>
            </Popconfirm>
          </div>
        );
      },
    }];

    const { getFieldDecorator } = this.props.form;
		const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
     	selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
		
    const addprops = {
      action: "http://119.23.38.100:8080/cma/StaffQualification/addOne",
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    }
    return(
			<Form>
				        <FormItem {...formItemLayout} label = "人员名称：">
                    {getFieldDecorator('id',{
                        rules: [],
                    })(<Select
                        showSearch
                        style={{ width: 100 }}
                        placeholder="Select a person"
                        optionFilterProp="resigner"
                        onChange={this.handleSelectChange}
                        filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options}
                    </Select>)}
                </FormItem>

                <FormItem>
                	<Button
                		type="primary"
                		icon="search"
                    onClick={() => this.handleSearch(this.state.searchId)}
                	>
                	search
                	</Button>
                </FormItem>

                <FormItem>
                	<Button
                		type="primary"
                    onClick={this.showModal}
                		>
                	增加
                	</Button>
                  
                  <Modal
                    title="新增人员资质信息"
                    visible={this.state.visible}
                    onOk={this.handleAdd}
                    onCancel={this.handleCancel}
                  >
                    <Form layout="horizontal">
                      
                      <FormItem {...formItemLayout} label = "人员名称：">
                        {getFieldDecorator('pid',{
                              rules: [],
                          })(<Select
                              showSearch
                              style={{ width: 100 }}
                              placeholder="Select a person"
                              optionFilterProp="resigner"
                              onChange={this.handleSelectChange}
                              filterOption={(input, option) => option.props.resigner.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {peopleoptions}
                    </Select>)}
                </FormItem>
                      
                      <FormItem {...formItemLayout} label="资质名称：" hasFeedback>
                        {getFieldDecorator('qualificationName', {
                          rules: [{required: true, message: 'Please input the qualificationname!'}],
                          initialValue: '',
                        })(
                        <Input style ={{width: 100,offset:4}}/>
                        )}
                      </FormItem>
                    </Form>

                    <Form id="upfile">
                      <FormItem>资质证书扫描件</FormItem>
                      <Upload {...addprops}>
                        <Button>
                          <Icon type="upload" /> 添加图片文件
                        </Button>
                      </Upload>
                    </Form>

                  </Modal>
                	<Button type="primary" onClick={this.onRec}>
                	查看全部
                	</Button>
                </FormItem>
                <FormItem>
                	<span style={{ marginLeft: 8 }}>
            			{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          			</span>
          			<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.fileData} rowKey="key"/>
                </FormItem>
			</Form>
		);
	}
}


const StaffQualificationView = Form.create()(TestViewForm);
export default StaffQualificationView