import React, { useState } from "react";
import Header from "./Components/Header";
import TaskModal from "./Components/TaskModal";
import TaskBoard from "./Components/TaskBoard";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Header />
      <TaskBoard />
      <TaskModal open={modalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default App;
