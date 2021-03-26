import S from "./TimerViewer.module.css";
import {
  Row,
  Col,
  Typography,
  TypographyProps,
  Card,
  Avatar,
  Space,
} from "antd";
import {
  red,blue
} from "@ant-design/colors";

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { useState } from "react";
import { useInterval } from "ahooks";

const Meta = Card.Meta;

export interface ITimerViewer {
  onDeleteClick: () => void;
  onEditClick: () => void;
  title: string;
  startTimeMs: number;
}

export default function TimerViewer(props: ITimerViewer) {
  let [diff, setDiff] = useState<Date>(new Date(Date.now()));

  useInterval(
    () => {
      let d = new Date(Date.now() - props.startTimeMs);
      setDiff(d);
    },
    1000,
    { immediate: true }
  );

  return (
    <Card
      title={props.title}
      actions={[
        <EditOutlined style={{color:blue.primary}} onClick={props.onEditClick} key="edit" />,
        <DeleteOutlined style={{color:red.primary}} onClick={props.onDeleteClick} key="delete" />,
      ]}
      style={{ textAlign: "left" }}
    >
      <Title style={{ textAlign: "center" }} level={2}>
        <Space size="small">
          <Text>{diff.getUTCHours().toString().padStart(2, "0")}</Text>
          <Text>:</Text>
          <Text>{diff.getUTCMinutes().toString().padStart(2, "0")}</Text>
          <Text>:</Text>
          <Text>{diff.getUTCSeconds().toString().padStart(2, "0")}</Text>
        </Space>
      </Title>
    </Card>
  );
}
