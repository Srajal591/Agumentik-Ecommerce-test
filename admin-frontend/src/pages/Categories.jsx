import { useState, useEffect } from 'react';
import { categoryService } from '../api/categoryService';
import { colors, spacing } from '../theme/colors';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const response = await categoryService.update(editingCategory._id, formData);
        if (response.success) {
          alert('Category updated successfully');
        }
      } else {
        const response = await categoryService.create(formData);
        if (response.success) {
          alert('Category created successfully');
        }
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        alert('Category deleted successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await categoryService.toggleStatus(id);
      if (response.success) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert('Failed to update category status');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
  };

  if (loading) {
    return <div style={styles.loading}>Loading categories...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Categories Management</h1>
        <button onClick={() => setShowModal(true)} style={styles.addButton}>
          + Add Category
        </button>
      </div>

      <div style={styles.grid}>
        {categories.map((category) => (
          <div key={category._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{category.name}</h3>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: category.isActive ? colors.success + '20' : colors.error + '20',
                  color: category.isActive ? colors.success : colors.error,
                }}
              >
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p style={styles.cardDescription}>{category.description || 'No description'}</p>
            <div style={styles.cardActions}>
              <button onClick={() => handleEdit(category)} style={styles.editButton}>
                Edit
              </button>
              <button
                onClick={() => handleToggleStatus(category._id)}
                style={styles.toggleButton}
              >
                {category.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(category._id)} style={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '16px',
    color: colors.textGray,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textDark,
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.textDark,
    margin: 0,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: '14px',
    color: colors.textGray,
    marginBottom: spacing.md,
  },
  cardActions: {
    display: 'flex',
    gap: spacing.xs,
  },
  editButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  toggleButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: colors.info,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textDark,
  },
  input: {
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  modalActions: {
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: colors.border,
    color: colors.textDark,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Categories;
