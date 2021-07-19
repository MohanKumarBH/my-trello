import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { uuid } from "uuidv4";
import { Button, Modal, Card } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const onDragEnd = (result, cloumns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = cloumns[source.droppableId];
    const destColumn = cloumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...cloumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = cloumns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...cloumns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDes, setCardDes] = useState("");
  const [activeColumn, setActiveColumn] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setColumns({
      ...columns,
      [uuid()]: {
        name: columnName,
        items: [],
      },
    });
    setColumnName("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setColumnName("");
  };

  const setInput = (e) => {
    setColumnName(e.target.value);
  };

  const closeCloumn = (id) => {
    let newColumns = Object.assign({}, columns);
    delete newColumns[id];
    setColumns(newColumns);
  };

  const showCardModal = (id) => {
    setActiveColumn(id);
    setIsCardModalVisible(true);
  };

  const handleCardOk = () => {
    setIsCardModalVisible(false);
    let newColumns = { ...columns };
    newColumns[activeColumn].items = [
      ...columns[activeColumn].items,
      { id: uuid(), title: cardTitle, description: cardDes },
    ];
    setColumns(newColumns);
    setCardTitle("");
    setCardDes("");
  };

  const handleCardCancel = () => {
    setIsCardModalVisible(false);
    setCardTitle("");
    setCardDes("");
  };

  const setCardTitleHandler = (e) => {
    setCardTitle(e.target.value);
  };

  const setCardDesHandler = (e) => {
    setCardDes(e.target.value);
  };

  const deleteCard = (cloumnId, itemId) => {
    console.log("columnId", cloumnId, "itemId", itemId);
    let newItems = columns[cloumnId].items.filter((item) => item.id !== itemId);
    let newColumns = { ...columns };
    newColumns[cloumnId].items = newItems;

    setColumns(newColumns);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          margin: "0px 10px",
          background: "lightgrey",
          alignItems: "center"
        }}
      >
        <h1 style={{ margin:0}}>Trello</h1>
      </div>
      <div   style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px 10px",
          alignItems: "center",
          borderRadius:5
        }}>
      <Button onClick={showModal}>Add column</Button>
      </div>
      <Modal
        title="Add Column"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <input
          placeholder="Enter Column Name"
          onChange={setInput}
          value={columnName}
          style={{ width: "100%" }}
        />
      </Modal>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={id}
              >
                <div
                  style={{
                    margin: "0px 8px 0px 8px",
                    backgroundColor: "lightgrey",
                  }}
                >
                  <div
                    style={{
                      justifyContent: "space-between",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid",
                      margin: "0px 5px 0px 0px ",
                    }}
                  >
                    <h2 style={{ padding: " 6px 10px", marginBottom: "0px" }}>
                      {column.name}
                    </h2>
                    <Button
                      type="primary"
                      icon={<CloseOutlined />}
                      size={"small"}
                      onClick={() => closeCloumn(id)}
                    />
                  </div>
                  <Droppable droppableId={id}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 450,
                          }}
                        >
                          <Modal
                            title="Add Card"
                            visible={isCardModalVisible}
                            onOk={() => handleCardOk(id)}
                            onCancel={handleCardCancel}
                          >
                            <input
                              placeholder="Enter Card Title"
                              onChange={setCardTitleHandler}
                              value={cardTitle}
                              style={{ width: "100%", marginBottom: "20px" }}
                            />
                            <input
                              placeholder="Enter Description"
                              onChange={setCardDesHandler}
                              value={cardDes}
                              style={{ width: "100%" }}
                            />
                          </Modal>
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <Card
                                        size="small"
                                        title={item.title}
                                        extra={
                                          <CloseOutlined
                                            onClick={() =>
                                              deleteCard(id, item.id)
                                            }
                                          />
                                        }
                                        style={{ width: "100%" }}
                                      >
                                        <p> {item.description}</p>
                                      </Card>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                  <Button
                    style={{ alignSelf: "center" }}
                    onClick={() => showCardModal(id)}
                  >
                    Add card
                  </Button>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
