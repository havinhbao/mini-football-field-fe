import { RevenueData } from '@/api/revenue';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { FC } from 'react';

interface RevenueTableProps {
  data: RevenueData[];
  loading: boolean;
}

export const RevenueTable: FC<RevenueTableProps> = ({ data, loading }) => {
  if (loading) {
    return <Typography>Loading data...</Typography>;
  }

  if (!data.length) {
    return <Typography>No data available for this period.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
      <Table>
        <TableHead sx={{ bgcolor: 'grey.100' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Revenue (VND)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.date} hover>
              <TableCell>{row.date}</TableCell>
              <TableCell align="right">{row.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
