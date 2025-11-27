import { AppContext } from '@/constants';
import { useToast } from '@/hooks';
import { customerRegister } from '@/modules/auth/services';
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
import { useNavigate } from 'react-router';
import * as Yup from 'yup';

const RegisterForm = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email(AppContext.invalid_email).required(AppContext.required_email),
      password: Yup.string().min(6, AppContext.min_password).required(AppContext.required_password),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], AppContext.invalid_confirm_password)
        .required(AppContext.required_confirm_password),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);

        await customerRegister(values.email, values.password);

        showToast(AppContext.register_success, 'success');
        navigate('/login', { replace: true, state: { email: values.email } });
      } catch (err: any) {
        showToast(err?.response?.data?.message || AppContext.register_failed, 'error');
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
          {AppContext.register}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          {/* EMAIL */}
          <TextField
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
            type="password"
            label={AppContext.password}
            margin="normal"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          {/* CONFIRM PASSWORD */}
          <TextField
            fullWidth
            type="password"
            label={AppContext.confirm_password}
            margin="normal"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          {/* BUTTON */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, height: 45 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : AppContext.register}
          </Button>
        </form>

        {/* Đã có tài khoản? */}
        <Typography textAlign="center" mt={3} fontSize={14}>
          {AppContext.have_account}?{' '}
          <MuiLink href="/login" underline="hover">
            {AppContext.login}
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
