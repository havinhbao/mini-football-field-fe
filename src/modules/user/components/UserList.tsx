import { UserRole } from '@/constants';
import { Delete, Edit, Person } from '@mui/icons-material';
import { Avatar, Box, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { FC } from 'react';
import { User } from '../types';

interface UserListProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete?: (id: string) => void;
}

const roleColors = {
  [UserRole.ADMIN]: 'error',
  [UserRole.STAFF]: 'warning',
  [UserRole.CUSTOMER]: 'success',
};

export const UserList: FC<UserListProps> = ({ users, loading, onEdit, onDelete }) => {
  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Họ và Tên',
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 32,
              height: 32,
              fontSize: '0.875rem',
            }}
          >
            {params.row.fullName?.charAt(0).toUpperCase() || <Person />}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {params.row.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'phoneNumber',
      headerName: 'Số điện thoại',
      width: 150,
      valueGetter: (_value, row) => row.phoneNumber || 'N/A',
    },
    {
      field: 'role',
      headerName: 'Vai trò',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={(roleColors[params.value as UserRole] || 'default') as any}
          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tham gia',
      width: 150,
      valueGetter: (_value, row) =>
        row.createdAt ? format(new Date(row.createdAt), 'dd/MM/yyyy') : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              onClick={() => onEdit(params.row)}
              sx={{ color: 'primary.main' }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {onDelete && (
            <Tooltip title="Xóa người dùng">
              <IconButton
                size="small"
                onClick={() => onDelete(params.row.id)}
                sx={{ color: 'error.main' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        height: 600,
        width: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
        }}
      />
    </Paper>
  );
};
