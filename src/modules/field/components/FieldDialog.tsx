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
import { FieldSize, FieldStatus, FieldType } from '@/constants';
import { Field } from '../types';

interface FieldDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Field>) => Promise<void>;
  field?: Field;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Field name is required'),
  size: Yup.string().required('Size is required'),
  type: Yup.string().required('Type is required'),
  pricePerHour: Yup.number()
    .required('Price per hour is required')
    .min(0, 'Price must be positive'),
  status: Yup.string().required('Status is required'),
  description: Yup.string(),
});

export const FieldDialog: FC<FieldDialogProps> = ({ open, onClose, onSubmit, field }) => {
  const formik = useFormik({
    initialValues: {
      name: field?.name || '',
      size: field?.size || FieldSize.FIVE_SIDE,
      type: field?.type || FieldType.ARTIFICIAL,
      pricePerHour: field?.pricePerHour || 0,
      status: field?.status || FieldStatus.AVAILABLE,
      description: field?.description || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
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
          {field?.id ? 'Edit Field' : 'Create New Field'}
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
              label="Field Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                select
                fullWidth
                label="Size"
                name="size"
                value={formik.values.size}
                onChange={formik.handleChange}
                error={formik.touched.size && Boolean(formik.errors.size)}
                helperText={formik.touched.size && formik.errors.size}
              >
                {Object.values(FieldSize).map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {Object.values(FieldType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Price per Hour ($)"
                name="pricePerHour"
                value={formik.values.pricePerHour}
                onChange={formik.handleChange}
                error={formik.touched.pricePerHour && Boolean(formik.errors.pricePerHour)}
                helperText={formik.touched.pricePerHour && formik.errors.pricePerHour}
                inputProps={{ min: 0, step: 0.01 }}
              />

              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                {Object.values(FieldStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description (Optional)"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
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
            {field?.id ? 'Update' : 'Create'} Field
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
