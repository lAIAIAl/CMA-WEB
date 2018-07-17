import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Tabs, Select, Checkbox, Popconfirm, Button, Icon, Table, Form, Input, Upload, Modal, Tooltip, AutoComplete, message} from 'antd';

import $ from 'lib/jquery-3.3.1';

const FormItem=Form.Item;
const Option=Select.Option;

class StaffQualificationInspectView extends React.Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
			item: null,
			visible: false,
			fileData: null,
			dataSource: this.props.dataSource,
			fileList: [],
			uploading: false,
		}

		let item: null;
		var id: 0;
		for(var i = this.props.dataSource.length-1; i >= 0; i--)
		{
			if(this.props.dataSource[i].qualificationId == this.props.item.qualificationId) { 
				id = this.props.item.id;
				item = this.props.item;
			}
		}
		this.state.item = item;
	}

	showModal = () => {
    this.setState({
    	visible: true,
    });
  }

  //modify
  handleModify = () => {
  	this.props.form.validateFields((err, fieldsValue) => {
      if(err) {
        return ;
      }
    });

    const {fileList} = this.state;

    var pid = this.state.item.qualificationId;
   	var qname = this.props.form.getFieldValue('qualificationName');
   	var formda = new FormData();
   	formda.append("qualificationId", pid);
   	formda.append("qualificationName", qname);
   	fileList.forEach((file) => {
    	formda.append("qualificationImage", file);
   	});

  	this.setState({
    	visible: false,
    	uploading: true,
    });

    $.ajax({
    	type: "post",
    	url: "http://119.23.38.100:8080/cma/StaffQualification/modifyOne",
    	data: formda,
    	processData: false,
    	contentType: false,
    	async: false,
    	success: () => {
      	message.success("修改成功");
      	this.setState({
        	fileList: [],
        	uploading: false,
      	});
    	},
    	error: () => {
      	message.error("修改失败");
      		this.setState({
        		uploading: false,
      		});
    	}
    });

    this.props.form.resetFields();
  }

  // download image
  handleImage = (key) => {
    console.log(key);
    const url = "http://119.23.38.100:8080/cma/StaffQualification/getImage?qualificationId="+key;
    var tempwindow = window.open();
    tempwindow.location = url;
  }

  handleCancel = () => {
  	this.setState({
    	visible: false,
    });
  }

	render(){
    
    let imageSrc = "http://119.23.38.100:8080/cma/StaffQualification/getImage?qualificationId="+this.props.item.qualificationId;
		const formItemLayout = 
		{
			labelCol: { span:6 },
			wrapperCol: { span:14 },
		};

		const width = '100%';
		const {getFieldDecorator} = this.props.form;

		const addprops = {
      action: "http://119.23.38.100:8080/cma/StaffQualification/modifyOne",
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
			  <Card key='0' title='资质基本信息' style={{marginBottom: 20}}>
				  <Row key='0'>
					  <Col span={12}>
						  <FormItem
		        		align="left"
                >
		          		名称：
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
		          		职位：
		        		  {this.state.item.position}
		        	</FormItem>
					  </Col>
					  <Col span={12}>
						  <FormItem
		        		align="left"
                >
                  资质名称：
		        		  {this.state.item.qualificationName}
		        	</FormItem>
					  </Col>
				  </Row>
				  <Row key='2'>
					  <Col span={12}>
						  <FormItem align="left">
		        	  证书扫描件：
                <img src={imageSrc} width='200' height='200'/>
		        	  <a onClick={() => this.handleImage(this.state.item.qualificationId)}>下载</a>
		          </FormItem>
					  </Col>
				  </Row>
			  </Card>
				<FormItem>
					<Button
					type="primary"
					onClick={this.showModal}
					>
					编辑
					</Button>
					<Modal
						title="修改人员资质信息"
            visible={this.state.visible}
            onOk={this.handleModify}
            onCancel={this.handleCancel}
            >
            <Form layout="horizontal">
                      
              <FormItem {...formItemLayout } label="人员名称：" hasFeedback>
                {this.state.item.name}
              </FormItem>
                      
              <FormItem {...formItemLayout} label="资质名称：" hasFeedback>
                {getFieldDecorator('qualificationName', {
                  rules: [],
                  initialValue: this.state.item.qualificationName,
                  })(
                      <Input style ={{width: 100,offset:4}}/>
                      )}
              </FormItem>
                      
                资质证书扫描件：
                <Upload {...addprops}>
                  <Button>
                    <Icon type="upload" /> 添加图片文件
                  </Button>
                </Upload>

            </Form>
          </Modal>
				</FormItem>
			</Form>
		);
	}
}

const StaffQualificationInspect = Form.create()(StaffQualificationInspectView);
export default StaffQualificationInspect