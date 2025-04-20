import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MantineProvider } from '@mantine/core';
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MantineProvider defaultColorScheme='dark'>
       <Notifications />
       <App />
  </MantineProvider>
);
