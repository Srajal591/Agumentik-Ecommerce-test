import { useState, useEffect } from 'react';
import { categoryService } from '../api/categoryService';
import { uploadService } from '../api/uploadService';
import { colors, spacing } from '../theme/colors';
import { MdCloudUpload, MdDelete, MdImage } from 'react-icons/md';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
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
      } else {
        console.error('Failed to fetch categories:', response);
        alert('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert(`Failed to fetch categories: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('📝 Submitting category form...');
    console.log('   Form data:', formData);
    console.log('   Uploading:', uploading);

    // Prevent submission while uploading
    if (uploading) {
      alert('Please wait for image upload to complete');
      return;
    }

    // Validate form
    if (!formData.name || formData.name.trim() === '') {
      alert('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        console.log('📝 Updating category:', editingCategory._id);
        const response = await categoryService.update(editingCategory._id, formData);
        console.log('📥 Update response:', response);
        if (response.success) {
          alert('Category updated successfully');
          fetchCategories();
          handleCloseModal();
        } else {
          alert(`Failed to update category: ${response.message || 'Unknown error'}`);
        }
      } else {
        console.log('📝 Creating new category');
        const response = await categoryService.create(formData);
        console.log('📥 Create response:', response);
        if (response.success) {
          alert('Category created successfully');
          fetchCategories();
          handleCloseModal();
        } else {
          alert(`Failed to create category: ${response.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('❌ Error saving category:', error);
      alert(`Failed to save category: ${error.message || 'Unknown error'}`);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📤 Starting image upload...');
    console.log('   File:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Upload to Cloudinary FIRST (before creating preview)
      console.log('📡 Uploading to Cloudinary...');
      const response = await uploadService.uploadImage(file, 'categories');
      console.log('📥 Upload response:', response);
      
      if (response.success) {
        const imageUrl = response.data.url;
        console.log('✅ Image uploaded successfully');
        console.log('   URL:', imageUrl);
        
        // Update form data with the image URL
        setFormData(prev => ({ ...prev, image: imageUrl }));
        
        // Create preview using the uploaded URL
        setImagePreview(imageUrl);
        console.log('✅ Form data updated with image URL');
      } else {
        console.error('❌ Upload failed:', response);
        alert(`Failed to upload image: ${response.message || 'Unknown error'}`);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    setImagePreview(category.image || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        alert('Category deleted successfully');
        fetchCategories();
      } else {
        alert(`Failed to delete category: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(`Failed to delete category: ${error.message || 'Unknown error'}`);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await categoryService.toggleStatus(id);
      if (response.success) {
        alert(response.message || 'Category status updated successfully');
        fetchCategories();
      } else {
        alert(`Failed to update category status: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert(`Failed to update category status: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
    setImagePreview(null);
    setUploading(false);
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
            {/* Category Image */}
            {category.image ? (
              <div style={styles.imageContainer}>
                <img src={category.image} alt={category.name} style={styles.categoryImage} />
              </div>
            ) : (
              <div style={styles.imagePlaceholder}>
                <MdImage style={styles.placeholderIcon} />
                <span>No Image</span>
              </div>
            )}
            
            <div style={styles.cardContent}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{category.name}</h3>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: category.isActive ? colors.successLight : colors.errorLight,
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
                <label style={styles.label}>Category Image</label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div style={styles.imagePreviewContainer}>
                    <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={styles.removeImageButton}
                      className="remove-image-btn"
                      disabled={uploading}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                {!imagePreview && (
                  <label style={styles.uploadLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={styles.fileInput}
                      disabled={uploading}
                    />
                    <div style={styles.uploadButton} className="upload-button">
                      <MdCloudUpload size={24} />
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    </div>
                  </label>
                )}

                <p style={styles.helpText}>
                  Recommended: 500x500px, Max size: 5MB
                </p>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} style={styles.cancelButton}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    ...styles.submitButton,
                    opacity: uploading ? 0.6 : 1,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : editingCategory ? 'Update' : 'Create'}
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
    width: '100%',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '16px',
    color: colors.textSecondary,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '180px',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '180px',
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    color: colors.textSecondary,
  },
  placeholderIcon: {
    fontSize: '48px',
    color: colors.textLight,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  },
  cardDescription: {
    fontSize: '14px',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cardActions: {
    display: 'flex',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  editButton: {
    flex: 1,
    minWidth: '80px',
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
    minWidth: '80px',
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
    minWidth: '80px',
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
    padding: spacing.md,
  },
  modal: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
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
    color: colors.textPrimary,
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
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: `2px solid ${colors.border}`,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '36px',
    height: '36px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  uploadLabel: {
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.lg,
    border: `2px dashed ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: colors.background,
    color: colors.textSecondary,
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  helpText: {
    fontSize: '12px',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  modalActions: {
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: colors.border,
    color: colors.textPrimary,
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

// Add hover styles
const hoverStyles = `
  .upload-button:hover {
    border-color: ${colors.primary};
    background-color: ${colors.primaryLight}20;
  }

  .remove-image-btn:hover {
    opacity: 0.9;
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('categories-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'categories-styles';
  styleSheet.textContent = hoverStyles;
  document.head.appendChild(styleSheet);
}

export default Categories;
