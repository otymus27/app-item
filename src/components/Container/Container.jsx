import React from 'react';
import { Container } from '@mui/material';

const Containers = ({ children }) => {
  return (
    <Container
      maxWidth="lg-sm"
      sx={{
        marginTop: '20px',
        marginBottom: '20px',
        padding: 3,
        bgcolor: 'white',
        borderRadius: 8,
        boxShadow: 1,
      }}
    >
      {children}
    </Container>
  );
};

export default Containers;
