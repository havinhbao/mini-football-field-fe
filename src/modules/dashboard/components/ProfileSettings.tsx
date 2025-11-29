import { userApi } from '@/api/user';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useToast } from '@/hooks';

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
      username: Yup.string().required('Full name is required'),
      phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits')
        .required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await userApi.updateUser({
          id: userId,
          username: values.username,
          phoneNumber: values.phoneNumber,
        });
        showToast('Profile updated successfully', 'success');
      } catch (error) {
        showToast('Failed to update profile', 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Profile Information
      </Typography>

      <TextField
        fullWidth
        id="username"
        name="username"
        label="Full Name"
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
        label="Phone Number"
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
        Save Changes
      </Button>
    </Box>
  );
};
