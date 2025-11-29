import { Delete, Edit } from '@mui/icons-material';
import { Box, Card, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { FC } from 'react';
import { Field } from '../types';

interface FieldCardProps {
  field: Field;
  onEdit: (field: Field) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  available: 'success',
  maintenance: 'warning',
  unavailable: 'error',
  inactive: 'default',
} as const;

export const FieldCard: FC<FieldCardProps> = ({ field, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Field Image */}
      <Box
        sx={{
          width: '100%',
          height: 200,
          borderRadius: 2,
          mb: 2,
          background: field.images?.[0]
            ? `url(${field.images[0]})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Chip
          label={field.status}
          color={statusColors[field.status as keyof typeof statusColors] || 'default'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            textTransform: 'capitalize',
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Field Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {field.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={field.size} size="small" variant="outlined" />
          <Chip label={field.type} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
        </Box>

        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
          ${field.pricePerHour}
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
            /hour
          </Typography>
        </Typography>

        {field.description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {field.description}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => onEdit(field)}
            sx={{
              flex: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            onClick={() => onDelete(field.id)}
            sx={{
              flex: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
              },
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};
