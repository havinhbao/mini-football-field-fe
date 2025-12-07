import { userApi } from '@/api/user';
import { useToast } from '@/hooks';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';

interface ProfileSettingsProps {
  userId: string;
}

export const ProfileSettings: FC<ProfileSettingsProps> = ({ userId }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const user = await userApi.getUserById(userId);
        if (user) {
          setInitialValues({
            username: user.username || '',
            phoneNumber: user.phoneNumber || '',
          });
        }
      } catch (error) {
        showToast('Failed to load profile', 'error');
      }
    };
    fetchUser();
  }, [userId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      username: Yup.string().required('Tên đầy đủ là bắt buộc'),
      phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Chỉ được nhập số')
        .min(10, 'Phải đúng 10 chữ số')
        .max(10, 'Phải đúng 10 chữ số')
        .required('Số điện thoại là bắt buộc'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await userApi.updateUser({
          id: userId,
          username: values.username,
          phoneNumber: values.phoneNumber,
        });
        showToast('Cập nhật hồ sơ thành công', 'success');
      } catch (error) {
        showToast('Cập nhật hồ sơ thất bại', 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Thông tin hồ sơ
      </Typography>

      <TextField
        fullWidth
        id="username"
        name="username"
        label="Tên đầy đủ"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        id="phoneNumber"
        name="phoneNumber"
        label="Số điện thoại"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        sx={{ mb: 3 }}
      />

      <Button
        color="primary"
        variant="contained"
        type="submit"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        Lưu thay đổi
      </Button>
    </Box>
  );
};
