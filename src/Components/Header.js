import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, styled, Button } from '@mui/material';
import TaskModal from './TaskModal';

const StyledAppBar = styled(AppBar)({
  position: 'sticky',
  top: 0,
  zIndex: (theme) => theme.zIndex.drawer + 1,
});

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ marginRight: 'auto' }}>Header</Typography>
          <Avatar alt="Avatar" src="/path/to/avatar-image.jpg" sx={{ marginLeft: 'auto' }} />
          <Button color="inherit" onClick={handleModalOpen}>Create Task</Button>
        </Toolbar>
      </StyledAppBar>
      <TaskModal open={modalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default Header;