import { changePassword } from '@/api/auth';
import { userApi } from '@/api/user';
import { StorageKey } from '@/constants';
import { useToast } from '@/hooks';
import { Lock, Person } from '@mui/icons-material';
import { Box, Button, CircularProgress, Container, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { CustomerNavBar } from '../components/CustomerNavBar';

const MyProfilePage: FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem(StorageKey.ACCESS_TOKEN);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id || decoded.sub || '');
        if (decoded.id || decoded.sub) {
          fetchUserData(decoded.id || decoded.sub);
        }
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }
  }, []);

  const fetchUserData = async (id: string) => {
    try {
      const user = await userApi.getUserById(id);
      if (user) {
        profileFormik.setValues({
          username: user.username || '',
          phoneNumber: user.phoneNumber || '',
        });
      }
    } catch (error) {
      showToast('Failed to load profile', 'error');
    }
  };

  const profileFormik = useFormik({
    initialValues: {
      username: '',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Full name is required'),
      phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
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

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await changePassword(values.oldPassword, values.newPassword);
        showToast('Password changed successfully', 'success');
        resetForm();
      } catch (error) {
        showToast('Failed to change password', 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <CustomerNavBar />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Profile
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Manage your account settings
        </Typography>

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
          >
            <Tab icon={<Person />} iconPosition="start" label="Profile" />
            <Tab icon={<Lock />} iconPosition="start" label="Security" />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Box component="form" onSubmit={profileFormik.handleSubmit}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Full Name"
                  value={profileFormik.values.username}
                  onChange={profileFormik.handleChange}
                  error={profileFormik.touched.username && Boolean(profileFormik.errors.username)}
                  helperText={profileFormik.touched.username && profileFormik.errors.username}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  value={profileFormik.values.phoneNumber}
                  onChange={profileFormik.handleChange}
                  error={profileFormik.touched.phoneNumber && Boolean(profileFormik.errors.phoneNumber)}
                  helperText={profileFormik.touched.phoneNumber && profileFormik.errors.phoneNumber}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  Save Changes
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box component="form" onSubmit={passwordFormik.handleSubmit}>
                <TextField
                  fullWidth
                  id="oldPassword"
                  name="oldPassword"
                  label="Current Password"
                  type="password"
                  value={passwordFormik.values.oldPassword}
                  onChange={passwordFormik.handleChange}
                  error={passwordFormik.touched.oldPassword && Boolean(passwordFormik.errors.oldPassword)}
                  helperText={passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                  helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                  helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  Change Password
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyProfilePage;
