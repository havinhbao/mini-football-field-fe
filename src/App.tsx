import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router';
import { Router } from './Router';
import appTheme from './theme';
import { Toast } from './uiComponents';

function App() {
  return (
    <BrowserRouter>
      <Toast />
      <CssBaseline />
      <ThemeProvider theme={appTheme}>
        <Router />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
