import { createStaff } from '@/api/auth';
import { userApi } from '@/api/user';
import { UserRole } from '@/constants';
import { Add } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { UserDialog } from '../components/UserDialog';
import { UserList } from '../components/UserList';
import { User } from '../types';

const StaffManagementPage: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const allUsers = await userApi.getAllUsers({ role: UserRole.STAFF });
      setUsers(allUsers as unknown as User[]);
    } catch (error) {
      showSnackbar('Failed to fetch staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveUser = async (values: any) => {
    try {
      if (selectedUser?.id) {
        await userApi.updateUser({ ...values, id: selectedUser.id });
        showSnackbar('Staff updated successfully', 'success');
      } else {
        await createStaff(values.email, values.password);
        showSnackbar('Staff created successfully', 'success');
      }
      fetchStaff();
      setDialogOpen(false);
      setSelectedUser(undefined);
    } catch (error) {
      showSnackbar('Failed to save staff', 'error');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDelete = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // await userApi.deleteUser(id);
        showSnackbar('Delete functionality coming soon', 'warning');
      } catch (error) {
        showSnackbar('Failed to delete staff', 'error');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Staff Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage your staff and administrators
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedUser(undefined);
              setDialogOpen(true);
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            New Staff
          </Button>
        </Box>

        <UserList
          users={users}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <UserDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUser(undefined);
          }}
          onSubmit={handleSaveUser}
          user={selectedUser}
          defaultRole={UserRole.STAFF}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default StaffManagementPage;
