import { Row, Col, Typography, Spin, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import S from "./Home.module.css";
import TimerViewer from "../../TimerViewer";
import TimerEditor from "../../TimerEditor";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  createTimer,
  deleteTimer,
  fetchTimers,
  selectTimers,
  updateTimer,
} from "../../features/timersSlice";
import { unwrapResult } from "@reduxjs/toolkit";
const Title = Typography.Title;

export interface IHomeProps {}
export default function Home(props: IHomeProps) {
  let dispatch = useAppDispatch();
  let timers = useAppSelector(selectTimers) as Array<any>;
  let timersStatus = useAppSelector((state) => state.timers.status);
  let timersError = useAppSelector((state) => state.timers.error);

  let [editingTimer, setEditingTimer] = useState(-1);
  let [creating, setCreating] = useState(false);

  useEffect(() => {
    if (timersStatus === "idle") dispatch(fetchTimers());
  }, [dispatch, timersStatus]);

  const onEditClick = useCallback((ind) => {
    setEditingTimer(ind);
  }, []);
  const onSaveClick = useCallback(
    (id: string, title: string) => {
      dispatch(updateTimer({ id, title }))
        .then(unwrapResult)
        .then((payload) => {})
        .finally(() => setEditingTimer(-1));
    },
    [timers]
  );

  const onDiscardClick = useCallback(
    (ind) => {
      setEditingTimer(-1);
    },
    [setEditingTimer]
  );
  const onDeleteClick = useCallback(
    (id: string) => {
      dispatch(deleteTimer(id));
    },
    [dispatch]
  );
  const onCreateNew = useCallback(() => {
    setCreating(true);
    dispatch(createTimer({ title: "Timer" }))
      .then(unwrapResult)
      .then((timer: any) => {
        console.log(timer);
        console.log(timers);
        setEditingTimer(timers.length);
      })
      .finally(() => setCreating(false));
  }, [timers]);

  return (
    <Row
      style={{
        marginTop: "10px",
        paddingBottom: "50px",
        justifyContent: "center",
      }}
      align="middle"
    >
      <Col span={22}>
        <Title level={1} style={{ fontSize: "20pt" }}>
          Timers
        </Title>
        {timersStatus === "loading" ? (
          <Spin />
        ) : (
          <QueueAnim
            type="top"
            leaveReverse={true}
            component={Row}
            componentProps={{
              gutter: [16, 23],
              align: "middle",
              style: { justifyContent: "center" },
            }}
          >
            {timers.map((n, i) => (
              <Col key={n.id} span={24}>
                <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                  {editingTimer === i ? (
                    <TimerEditor
                      onSaveClick={(name) => onSaveClick(n.id, name)}
                      onDiscardClick={() => onDiscardClick(i)}
                      defaultName={n.title}
                      isLoading={n.status === "loading"}
                      error={n.error}
                    />
                  ) : (
                    <TimerViewer
                      onDeleteClick={() => onDeleteClick(n.id)}
                      onEditClick={() => onEditClick(i)}
                      startTimeMs={n.startTime}
                      title={n.title}
                    />
                  )}
                </div>
              </Col>
            ))}

            <Col key="0">
              <Button
                size="large"
                type="primary"
                shape="circle"
                loading={creating}
                onClick={(ev) => onCreateNew()}
                icon={<PlusOutlined />}
              />
            </Col>
          </QueueAnim>
        )}
      </Col>
    </Row>
  );
}
