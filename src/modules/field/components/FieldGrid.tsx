import { Field } from '@/api/field';
import { AppContext, FieldStatus, RoutePaths } from '@/constants';
import { isAuthenticated } from '@/middlewares';
import { getFields } from '@/modules/field/services';
import { buildPriceString } from '@/utils';
import { EventAvailable } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function FieldGrid() {
  const [fields, setFields] = useState<Field[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fieldsData = await getFields();
      setFields(fieldsData);
    };
    fetchData();
  }, []);

  const handleBookNow = (fieldId: string) => {
    if (!isAuthenticated()) {
      navigate(RoutePaths.LOGIN);
      return;
    }
    navigate(`${RoutePaths.BOOK_FIELD}?fieldId=${fieldId}`);
  };

  return (
    <Grid container spacing={3}>
      {[...fields, ...fields].map((f, index) => (
        <Grid size={3} key={`${f.id}-${index}`}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)',
              transition: '0.3s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Box sx={{ overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="200"
                image={f.images?.[0] || '/fallback-field.jpg'}
                sx={{
                  transition: '0.5s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight={700}>
                {f.name}
              </Typography>

              <Chip
                label={AppContext[f.type.toLowerCase() as keyof typeof AppContext]}
                color="primary"
                size="small"
                sx={{
                  mt: 1,
                  fontWeight: 600,
                  borderRadius: 1,
                  width: 'fit-content',
                }}
              />

              <Typography mt={1} color="text.secondary" fontSize={15}>
                <strong>Giá thuê:</strong> {buildPriceString(f.pricePerHour)} / giờ
              </Typography>

              <Chip
                label={AppContext[f.status.toLowerCase() as keyof typeof AppContext]}
                size="small"
                sx={{
                  mt: 1.5,
                  width: 'fit-content',
                  bgcolor:
                    f.status === FieldStatus.AVAILABLE
                      ? 'rgba(0, 200, 83, 0.15)'
                      : 'rgba(255, 167, 38, 0.15)',
                  color: f.status === FieldStatus.AVAILABLE ? 'green' : 'orange',
                  fontWeight: 600,
                }}
              />

              {/* Booked status indicator - shown when field has bookings for current time */}
              {f.hasCurrentBooking && (
                <Chip
                  label="Booked"
                  size="small"
                  sx={{
                    mt: 1,
                    width: 'fit-content',
                    bgcolor: 'rgba(211, 47, 47, 0.15)',
                    color: 'error.main',
                    fontWeight: 600,
                  }}
                />
              )}

              <Button
                variant="contained"
                fullWidth
                startIcon={<EventAvailable />}
                onClick={() => handleBookNow(f.id)}
                disabled={f.status !== FieldStatus.AVAILABLE}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Đặt ngay
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
