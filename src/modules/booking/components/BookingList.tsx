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
      headerName: 'Date',
      width: 120,
      renderCell: (params: GridRenderCellParams) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 130,
      valueGetter: (_value, row) => `${row.startTime} - ${row.endTime}`,
    },
    {
      field: 'field',
      headerName: 'Field',
      width: 150,
      valueGetter: (_value, row) => row.field?.name || 'N/A',
    },
    {
      field: 'user',
      headerName: 'Customer',
      width: 180,
      valueGetter: (_value, row) => row.user?.fullName || row.user?.email || 'N/A',
    },
    {
      field: 'totalPrice',
      headerName: 'Price',
      width: 100,
      renderCell: (params: GridRenderCellParams) => `$${params.value?.toFixed(2) || '0.00'}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={statusColors[params.value as keyof typeof statusColors] || 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === 'paid' ? 'success' : 'default'}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
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
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => onEdit(booking)} color="primary">
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {isPending && (
              <Tooltip title="Confirm">
                <IconButton size="small" onClick={() => onConfirm(booking.id)} color="info">
                  <CheckCircle fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {isConfirmed && (
              <Tooltip title="Mark as Paid">
                <IconButton size="small" onClick={() => onPay(booking.id)} color="success">
                  <Payment fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {!isCanceled && (
              <Tooltip title="Cancel">
                <IconButton size="small" onClick={() => onCancel(booking.id)} color="warning">
                  <Cancel fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Delete">
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
