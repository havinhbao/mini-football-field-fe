import { AppContext, FieldSize, FieldStatus, FieldType } from '@/constants';
import { getFields } from '@/modules/field/services';
import { buildPriceString } from '@/utils';
import { Box, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Field = {
  id: string;
  name: string;
  type: FieldType;
  size: FieldSize;
  status: FieldStatus;
  pricePerHour: number;
  images?: string[];
};

export default function FieldGrid() {
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fieldsData = await getFields();
      setFields(fieldsData);
    };
    fetchData();
  }, []);

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
              cursor: 'pointer',
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

            <CardContent>
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
                  bgcolor:
                    f.status === FieldStatus.AVAILABLE
                      ? 'rgba(0, 200, 83, 0.15)'
                      : 'rgba(255, 167, 38, 0.15)',
                  color: f.status === FieldStatus.AVAILABLE ? 'green' : 'orange',
                  fontWeight: 600,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
