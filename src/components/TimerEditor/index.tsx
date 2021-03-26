import S from "./TimerViewer.module.css";
import {
  Row,
  Col,
  Typography,
  TypographyProps,
  Card,
  Avatar,
  Space,
  InputNumber,
  Form,
  Input,
  Button,
  Checkbox,
} from "antd";
import { red } from "@ant-design/colors";

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useState } from "react";
import { useForm } from "antd/lib/form/Form";

const Meta = Card.Meta;

export interface ITimeEditorProps {
  onSaveClick: (name: string) => void;
  onDiscardClick: () => void;
  defaultName: string;
  isLoading: boolean;
  error?: string;
}

export default function TimerEditor({
  defaultName,
  onSaveClick,
  onDiscardClick,
  isLoading,
  error,
}: ITimeEditorProps) {
  let [name, setName] = useState(defaultName);

  let [form] = useForm();

  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 16 },
  };

  return (
    <Card
      title="Edit Timer"
      actions={[
        <Button
          type="link"
          loading={isLoading}
          onClick={(e) => {
            form.submit();
          }}
        >
          Save
        </Button>,
        <Button
          danger
          type="link"
          disabled={isLoading}
          onClick={onDiscardClick}
        >
          Discard
        </Button>,
      ]}
      style={{ textAlign: "left" }}
    >
      <Title style={{ textAlign: "center", fontSize: "12pt" }} level={2}>
        <Form
          {...layout}
          name="basic"
          initialValues={{ name: name }}
          onFinish={() => {
            onSaveClick(form.getFieldValue("name"));
          }}
          onFinishFailed={() => {}}
          form={form}
        >
          <Form.Item
            label="Timer Name"
            name="name"
            rules={[{ required: true, message: "Please input timer name!" }]}
          >
            <Input autoFocus={true} placeholder="Timer Name" />
          </Form.Item>
        </Form>
      </Title>
    </Card>
  );
}
