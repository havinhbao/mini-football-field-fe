import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { FC } from 'react';

const OverviewPage: FC = () => {
  return (
    <Box sx={{ p: 1, gap: 2, display: 'flex', flexDirection: 'column' }}>
      {/* Title */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        Tổng quan hoạt động
      </Typography>

      {/* Top Stats */}
      <Grid container spacing={2}>
        {/* Số sân đang hoạt động */}
        <Grid size={3}>
          <Card sx={{ borderRadius: 1, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Sân đang hoạt động
              </Typography>
              <Typography variant="h4" fontWeight={700} mt={1}>
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lượt đặt hôm nay */}
        <Grid size={3}>
          <Card sx={{ borderRadius: 1, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Lượt đặt hôm nay
              </Typography>
              <Typography variant="h4" fontWeight={700} mt={1}>
                34
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Doanh thu hôm nay */}
        <Grid size={3}>
          <Card sx={{ borderRadius: 1, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Doanh thu hôm nay
              </Typography>
              <Typography variant="h4" fontWeight={700} mt={1}>
                5.200.000 đ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Khách hàng mới */}
        <Grid size={3}>
          <Card sx={{ borderRadius: 1, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Khách hàng mới
              </Typography>
              <Typography variant="h4" fontWeight={700} mt={1}>
                7
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts + Booking list */}
      <Grid container spacing={2}>
        {/* Doanh thu 7 ngày */}
        <Grid size={6}>
          <Card sx={{ borderRadius: 1, height: 350 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Doanh thu 7 ngày gần nhất
              </Typography>

              {/* Placeholder */}
              <Box
                sx={{
                  width: '100%',
                  height: 250,
                  bgcolor: '#E2E8F0',
                  borderRadius: 1,
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Lượt đặt theo giờ */}
        <Grid size={6}>
          <Card sx={{ borderRadius: 1, height: 350 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Khung giờ đặt sân nhiều nhất
              </Typography>

              <Box
                sx={{
                  width: '100%',
                  height: 250,
                  bgcolor: '#E2E8F0',
                  borderRadius: 1,
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Booking list */}
        <Grid size={6}>
          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Lịch đặt sân sắp tới
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem>
                  <ListItemText primary="Sân 5A – 14:00 – Nguyễn Văn A" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sân 7B – 15:30 – Trần Huỳnh B" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sân 5C – 17:00 – Lê Quốc C" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sân 7A – 19:00 – Nguyễn Thảo D" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top khách hàng */}
        <Grid size={6}>
          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Khách hàng đặt sân nhiều nhất
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem>
                  <ListItemText primary="Nguyễn Đức T – 18 lần" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Lê Thanh P – 12 lần" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Hoàng Việt T – 10 lần" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Nguyễn Thị L – 9 lần" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewPage;
