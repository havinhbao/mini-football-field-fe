import { AppContext, AppErrorMessages, AppValidationMessages } from '@/constants';
import { login } from '@/modules/auth/services';
import {
  Box,
  Button,
  CircularProgress,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email(AppValidationMessages.invalid_email)
        .required(AppValidationMessages.required_email),
      password: Yup.string().required(AppValidationMessages.required_password),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      setApiError('');

      try {
        await login(values.email, values.password);

        window.location.href = '/dashboard';
      } catch (error: any) {
        setApiError(error.message || AppErrorMessages.unknown_error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ width: 380, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
          {AppContext.login}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          {/* EMAIL */}
          <TextField
            variant="outlined"
            fullWidth
            label={AppContext.email}
            margin="normal"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            label={AppContext.password}
            type="password"
            margin="normal"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          {/* API ERROR */}
          {apiError && (
            <Typography color="error" mt={1} mb={1} fontSize={14}>
              {apiError}
            </Typography>
          )}

          {/* QUÊN MẬT KHẨU */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 1,
              mb: 2,
            }}
          >
            <MuiLink href="/forgot-password" underline="hover" fontSize={14}>
              {AppContext.forgot_password}?
            </MuiLink>
          </Box>

          {/* BUTTON LOGIN */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ height: 45 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : AppContext.login}
          </Button>
        </form>

        {/* ĐĂNG KÝ */}
        <Typography textAlign="center" mt={3} fontSize={14}>
          {AppContext.no_account}?{' '}
          <MuiLink href="/register" underline="hover">
            {AppContext.register}
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
