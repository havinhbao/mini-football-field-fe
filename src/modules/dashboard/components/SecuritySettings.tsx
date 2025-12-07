import { useToast } from '@/hooks';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import * as Yup from 'yup';

export const SecuritySettings: FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
      newPassword: Yup.string()
        .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
        .required('Vui lòng nhập mật khẩu mới'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu mới'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        // await changePassword(values.oldPassword, values.newPassword);
        showToast('Tính năng chưa khả dụng', 'error');
        resetForm();
      } catch (error) {
        showToast('Đổi mật khẩu thất bại', 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Đổi mật khẩu
      </Typography>

      <TextField
        fullWidth
        id="oldPassword"
        name="oldPassword"
        label="Mật khẩu hiện tại"
        type="password"
        value={formik.values.oldPassword}
        onChange={formik.handleChange}
        error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
        helperText={formik.touched.oldPassword && formik.errors.oldPassword}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        id="newPassword"
        name="newPassword"
        label="Mật khẩu mới"
        type="password"
        value={formik.values.newPassword}
        onChange={formik.handleChange}
        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
        helperText={formik.touched.newPassword && formik.errors.newPassword}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        id="confirmPassword"
        name="confirmPassword"
        label="Xác nhận mật khẩu mới"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        sx={{ mb: 3 }}
      />

      <Button
        color="primary"
        variant="contained"
        type="submit"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        Đổi mật khẩu
      </Button>
    </Box>
  );
};
