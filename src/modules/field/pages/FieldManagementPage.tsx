import { fetchFields } from '@/api/field';
import { Add } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { FieldCard } from '../components/FieldCard';
import { FieldDialog } from '../components/FieldDialog';
import { Field } from '../types';

const FieldManagementPage: FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | undefined>(undefined);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchFieldsData = async () => {
    setLoading(true);
    try {
      const response = await fetchFields();
      setFields(response as Field[]);
    } catch (error) {
      showSnackbar('Failed to fetch fields', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldsData();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateField = async (values: Partial<Field>) => {
    try {
      if (selectedField?.id) {
        // Update field - API call would go here
        // await updateField(selectedField.id, values);
        showSnackbar('Update functionality coming soon', 'error');
      } else {
        // Create field - API call would go here
        // await createField(values);
        showSnackbar('Create functionality coming soon', 'error');
      }
      fetchFieldsData();
      setDialogOpen(false);
      setSelectedField(undefined);
    } catch (error) {
      showSnackbar('Failed to save field', 'error');
    }
  };

  const handleEdit = (field: Field) => {
    setSelectedField(field);
    setDialogOpen(true);
  };

  const handleDelete = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        // Note: Delete endpoint not implemented in API yet
        // await deleteField(id);
        showSnackbar('Delete functionality coming soon', 'error');
        // fetchFieldsData();
      } catch (error) {
        showSnackbar('Failed to delete field', 'error');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Field Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage your football fields with ease
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedField(undefined);
              setDialogOpen(true);
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            New Field
          </Button>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : fields.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              No fields found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create your first field to get started
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        )}

        {/* Field Dialog */}
        <FieldDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedField(undefined);
          }}
          onSubmit={handleCreateField}
          field={selectedField}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default FieldManagementPage;
