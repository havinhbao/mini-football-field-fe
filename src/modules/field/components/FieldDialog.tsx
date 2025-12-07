import { FieldSize, FieldStatus, FieldType } from '@/constants';
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
import { Field } from '../types';

interface FieldDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Field>) => Promise<void>;
  field?: Field;
}

const displayStatus: Record<FieldStatus, string> = {
  available: 'Khả dụng',
  maintenance: 'Bảo trì',
  unavailable: 'Không khả dụng',
  inactive: 'Không hoạt động',
  booked: 'Đã đặt',
};

const displaySize: Record<FieldSize, string> = {
  [FieldSize.FIVE_SIDE]: 'Sân 5',
  [FieldSize.SEVEN_SIDE]: 'Sân 7',
};

const displayType: Record<FieldType, string> = {
  [FieldType.ARTIFICIAL]: 'Sân cỏ nhân tạo',
  [FieldType.NATURAL]: 'Sân cỏ tự nhiên',
  [FieldType.FUTSAL]: 'Sân futsal',
  [FieldType.INDOOR]: 'Sân trong nhà',
};

const validationSchema = Yup.object({
  name: Yup.string().required('Tên sân bóng là bắt buộc'),
  size: Yup.string().required('Kích thước là bắt buộc'),
  type: Yup.string().required('Loại sân là bắt buộc'),
  pricePerHour: Yup.number().required('Giá theo giờ là bắt buộc').min(0, 'Giá phải là số dương'),
  status: Yup.string().required('Trạng thái là bắt buộc'),
  images: Yup.array().of(Yup.string().url('Phải là một URL hợp lệ')),
});

export const FieldDialog: FC<FieldDialogProps> = ({ open, onClose, onSubmit, field }) => {
  const formik = useFormik({
    initialValues: {
      name: field?.name || '',
      size: field?.size || FieldSize.FIVE_SIDE,
      type: field?.type || FieldType.ARTIFICIAL,
      pricePerHour: field?.pricePerHour || 0,
      status: field?.status || FieldStatus.AVAILABLE,
      images: field?.images || [],
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
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
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
          {field?.id ? 'Chỉnh sửa sân bóng' : 'Tạo sân bóng mới'}
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
              label="Tên sân bóng"
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
                label="Kích thước"
                name="size"
                value={formik.values.size}
                onChange={formik.handleChange}
                error={formik.touched.size && Boolean(formik.errors.size)}
                helperText={formik.touched.size && formik.errors.size}
              >
                {Object.values(FieldSize).map((size) => (
                  <MenuItem key={size} value={size}>
                    {displaySize[size]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Loại sân"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {Object.values(FieldType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {displayType[type]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Giá theo giờ (VND)"
                name="pricePerHour"
                value={formik.values.pricePerHour}
                onChange={formik.handleChange}
                error={formik.touched.pricePerHour && Boolean(formik.errors.pricePerHour)}
                helperText={formik.touched.pricePerHour && formik.errors.pricePerHour}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 0.01,
                  },
                }}
              />

              <TextField
                select
                fullWidth
                label="Trạng thái"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                {Object.values(FieldStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {displayStatus[status]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              fullWidth
              label="Hình ảnh (URL, cách nhau bằng dấu phẩy)"
              name="images"
              value={formik.values.images?.toString() || ''}
              onChange={(e) =>
                formik.setFieldValue(
                  'images',
                  e.target.value.split(',').map((url) => url.trim()),
                )
              }
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Hủy
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
            {field?.id ? 'Cập nhật' : 'Tạo'} Sân bóng
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
