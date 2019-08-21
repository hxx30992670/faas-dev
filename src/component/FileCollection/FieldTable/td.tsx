import * as React from 'react';
import {Form, Input} from "antd";
const EditableContext = React.createContext({});

export interface ITdProps {
}

class Td extends React.Component<any, any> {
  public renderCell = () => {
    const {
      dataIndex,
      title,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        <Form.Item style={{ margin: 0 }}>
          {this.props.form.getFieldDecorator(dataIndex, {
            validateTrigger: ["onBlur"],
            rules: [
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <Input />
          )}
        </Form.Item>
      </td>
    );
  };
  public render() {
    return (
      <EditableContext.Consumer>
        {this.renderCell}
      </EditableContext.Consumer>
    );
  }
}
export default Form.create({
  name: 'td'
})(Td);
