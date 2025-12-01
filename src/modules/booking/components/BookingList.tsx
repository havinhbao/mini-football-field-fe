import { buildPriceString } from '@/utils';
import { Cancel, CheckCircle, Delete, Edit, Payment } from '@mui/icons-material';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { FC } from 'react';
import { Booking } from '../types';

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
  onPay: (id: string) => void;
}

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  paid: 'success',
  canceled: 'error',
} as const;

const displayStatus: Record<string, string> = {
  pending: 'Đang chờ',
  confirmed: 'Đã xác nhận',
  paid: 'Đã thanh toán',
  canceled: 'Đã hủy',
};

export const BookingList: FC<BookingListProps> = ({
  bookings,
  loading,
  onEdit,
  onDelete,
  onCancel,
  onConfirm,
  onPay,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Ngày đặt',
      width: 120,
      renderCell: (params: GridRenderCellParams) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'time',
      headerName: 'Thời gian',
      width: 130,
      valueGetter: (_value, row) => `${row.startTime} - ${row.endTime}`,
    },
    {
      field: 'field',
      headerName: 'Sân',
      width: 150,
      valueGetter: (_value, row) => row.field?.name || 'N/A',
    },
    {
      field: 'user',
      headerName: 'Khách hàng',
      width: 180,
      valueGetter: (_value, row) => row.user?.fullName || row.user?.email || 'N/A',
    },
    {
      field: 'totalPrice',
      headerName: 'Giá',
      width: 100,
      renderCell: (params: GridRenderCellParams) => buildPriceString(params.value as number),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={displayStatus[params.value as keyof typeof displayStatus] || params.value}
          color={statusColors[params.value as keyof typeof statusColors] || 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Thanh toán',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
          color={params.value === 'paid' ? 'success' : 'default'}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const booking = params.row as Booking;
        const isPending = booking.status === 'pending';
        const isConfirmed = booking.status === 'confirmed';
        const isCanceled = booking.status === 'canceled';

        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {!isCanceled && (
              <Tooltip title="Chỉnh sửa">
                <IconButton size="small" onClick={() => onEdit(booking)} color="primary">
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {isPending && (
              <Tooltip title="Xác nhận">
                <IconButton size="small" onClick={() => onConfirm(booking.id)} color="info">
                  <CheckCircle fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {isConfirmed && (
              <Tooltip title="Đánh dấu đã thanh toán">
                <IconButton size="small" onClick={() => onPay(booking.id)} color="success">
                  <Payment fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {!isCanceled && (
              <Tooltip title="Hủy đặt">
                <IconButton size="small" onClick={() => onCancel(booking.id)} color="warning">
                  <Cancel fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Xóa">
              <IconButton size="small" onClick={() => onDelete(booking.id)} color="error">
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 600,
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
          borderRadius: 3,
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'rgba(102, 126, 234, 0.04)',
        },
      }}
    >
      <DataGrid
        rows={bookings}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
};
