import { createField, deleteField, fetchFields, updateField } from '@/api/field';
import { useToast } from '@/hooks';
import { Add } from '@mui/icons-material';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { FieldCard } from '../components/FieldCard';
import { FieldDialog } from '../components/FieldDialog';
import { Field } from '../types';

const FieldManagementPage: FC = () => {
  const { showToast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | undefined>(undefined);

  const fetchFieldsData = async () => {
    setLoading(true);
    try {
      const response = await fetchFields();
      setFields(response as Field[]);
    } catch (error) {
      showToast('Tải danh sách sân bóng thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldsData();
  }, []);

  const handleCreateField = async (values: Partial<Field>) => {
    try {
      if (selectedField?.id) {
        await updateField(selectedField.id, values);
        showToast('Cập nhật sân bóng thành công', 'success');
      } else {
        await createField({
          name: values.name!,
          pricePerHour: values.pricePerHour!,
          size: values.size!,
          type: values.type!,
          images: values.images || [],
        });
        showToast('Tạo sân bóng thành công', 'success');
      }
      fetchFieldsData();
      setDialogOpen(false);
      setSelectedField(undefined);
    } catch (error) {
      showToast('Failed to save field', 'error');
    }
  };

  const handleEdit = (field: Field) => {
    setSelectedField(field);
    setDialogOpen(true);
  };

  const handleDelete = async (_id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sân bóng này không?')) {
      try {
        await deleteField(_id);
        showToast('Xóa sân bóng thành công', 'success');
        fetchFieldsData();
      } catch (error) {
        showToast('Failed to delete field', 'error');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        flexGrow: 1,
        px: 4,
        py: 4,
      }}
    >
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
            Quản lý Sân Bóng
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
          Thêm Sân Mới
        </Button>
      </Box>

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
            Chưa có sân bóng nào được tạo. Vui lòng thêm sân mới.
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
            <FieldCard key={field.id} field={field} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </Box>
      )}
      <FieldDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedField(undefined);
        }}
        onSubmit={handleCreateField}
        field={selectedField}
      />
    </Box>
  );
};

export default FieldManagementPage;
