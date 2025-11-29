import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { FC, useEffect } from 'react';
import * as Yup from 'yup';
import { UserRole } from '@/constants';
import { User } from '../types';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  user?: User;
  defaultRole?: UserRole;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  fullName: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string().matches(/^[0-9]+$/, 'Must be only digits'),
  role: Yup.string().required('Role is required'),
  password: Yup.string().when('isNew', {
    is: true,
    then: (schema) => schema.required('Password is required').min(6, 'Min 6 chars'),
    otherwise: (schema) => schema.optional(),
  }),
});

export const UserDialog: FC<UserDialogProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  defaultRole,
}) => {
  const isNew = !user;

  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      role: user?.role || defaultRole || UserRole.CUSTOMER,
      password: '',
      isNew,
    },
    validationSchema,
    onSubmit: async (values) => {
      const { isNew, ...submitValues } = values;
      if (!isNew && !submitValues.password) {
        delete (submitValues as any).password;
      }
      await onSubmit(submitValues);
      onClose();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {user ? 'Edit User' : 'Create New User'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={!isNew}
            />

            {isNew && (
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />

              <TextField
                select
                fullWidth
                label="Role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            {user ? 'Update' : 'Create'} User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
