import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { ChakraProvider } from '@chakra-ui/react';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  const root = createRoot(container);
  root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
});
