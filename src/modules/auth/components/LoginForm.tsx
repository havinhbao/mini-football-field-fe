import { AppContext, RoutePaths } from '@/constants';
import { useToast } from '@/hooks';
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
import { useLocation } from 'react-router';
import * as Yup from 'yup';

const LoginForm = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: (location.state?.email as string) || '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email(AppContext.invalid_email).required(AppContext.required_email),
      password: Yup.string().required(AppContext.required_password),
    }),

    onSubmit: async (values) => {
      setLoading(true);

      try {
        await login(values.email, values.password);

        showToast(AppContext.login_success, 'success');
        window.location.href = '/dashboard';
      } catch (error: any) {
        showToast(error.message || AppContext.unknown_error, 'error');
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
      <Paper elevation={3} sx={{ width: 420, p: 4, borderRadius: 2 }}>
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
          {/* {apiError && (
            <Typography color="error" mt={1} mb={1} fontSize={14}>
              {apiError}
            </Typography>
          )} */}

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
          <MuiLink href={RoutePaths.REGISTER} underline="hover">
            {AppContext.register}
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
