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
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { FC, useEffect } from 'react';
import * as Yup from 'yup';
import { Booking } from '../types';

interface Field {
  id: string;
  name: string;
  pricePerHour: number;
}

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Booking) => Promise<void>;
  booking?: Booking | null;
  fields: Field[];
}

const validationSchema = Yup.object({
  fieldId: Yup.string().required('Vui lòng chọn sân bóng'),
  date: Yup.date().required('Vui lòng chọn ngày'),
  startTime: Yup.string().required('Vui lòng chọn giờ bắt đầu'),
  endTime: Yup.string()
    .required('Vui lòng chọn giờ kết thúc')
    .test('is-after-start', 'Giờ kết thúc phải sau giờ bắt đầu', function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return value > startTime;
    }),
  note: Yup.string(),
});

export const BookingDialog: FC<BookingDialogProps> = ({
  open,
  onClose,
  onSubmit,
  booking,
  fields,
}) => {
  const formik = useFormik({
    initialValues: {
      fieldId: booking?.fieldId || '',
      date: booking?.date
        ? format(new Date(booking.date), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      startTime: booking?.startTime || '09:00',
      endTime: booking?.endTime || '10:00',
      note: booking?.note || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit({
        ...values,
        date: new Date(values.date),
        id: booking?.id || '',
        status: '',
        paymentStatus: '',
        totalPrice: 0,
      });
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
          {booking?.id ? 'Chỉnh sửa đặt sân' : 'Tạo đặt sân mới'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              select
              fullWidth
              label="Chọn Sân Bóng"
              name="fieldId"
              value={formik.values.fieldId}
              onChange={formik.handleChange}
              error={formik.touched.fieldId && Boolean(formik.errors.fieldId)}
              helperText={formik.touched.fieldId && formik.errors.fieldId}
            >
              {fields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.name} - ${field.pricePerHour}/hour
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              type="date"
              label="Chọn Ngày"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                type="time"
                label="Chọn Giờ Bắt Đầu"
                name="startTime"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                helperText={formik.touched.startTime && formik.errors.startTime}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                fullWidth
                type="time"
                label="Chọn Giờ Kết Thúc"
                name="endTime"
                value={formik.values.endTime}
                onChange={formik.handleChange}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Ghi chú (Tùy chọn)"
              name="note"
              value={formik.values.note}
              onChange={formik.handleChange}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
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
            {booking?.id ? 'Cập nhật' : 'Tạo'} Đặt Sân
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
