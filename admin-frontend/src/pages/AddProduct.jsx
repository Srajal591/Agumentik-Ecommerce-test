import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { uploadService } from '../api/uploadService';
import { colors, spacing } from '../theme/colors';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    brand: '',
    material: '',
    images: [],
    sizes: [{ size: 'S', stock: 0 }],
    colors: [''],
    tags: [''],
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedUrls = [];
      
      for (const file of files) {
        try {
          const response = await uploadService.uploadImage(file, 'products');
          if (response.success) {
            uploadedUrls.push(response.data.url);
          }
        } catch (uploadError) {
          console.error('Error uploading single image:', uploadError);
          // Continue with other images even if one fails
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
        alert(`${uploadedUrls.length} image(s) uploaded successfully`);
      } else {
        alert('Failed to upload images. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: '', stock: 0 }],
    });
  };

  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleColorChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({ ...formData, colors: [...formData.colors, ''] });
  };

  const removeColor = (index) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Clean up data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        colors: formData.colors.filter(c => c.trim()),
        tags: formData.tags.filter(t => t.trim()),
        sizes: formData.sizes.filter(s => s.size.trim()),
      };

      console.log('📤 Sending product data:', productData);
      const response = await productService.create(productData);
      console.log('✅ Product created:', response);
      
      if (response.success) {
        alert('Product created successfully!');
        navigate('/products');
      } else {
        alert('Failed to create product: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error creating product:', error);
      const errorMessage = error?.message || error?.error || 'Failed to create product';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Product</h1>
        <button onClick={() => navigate('/products')} style={styles.backButton}>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter product name"
            />
            {errors.name && <span style={styles.error}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter product description"
              rows="4"
            />
            {errors.description && <span style={styles.error}>{errors.description}</span>}
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span style={styles.error}>{errors.category}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., Cotton, Polyester"
            />
          </div>
        </div>

        {/* Pricing */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Pricing</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <span style={styles.error}>{errors.price}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                style={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Product Images *</h2>
          
          <div style={styles.formGroup}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={styles.fileInput}
              disabled={uploadingImages}
            />
            {uploadingImages && <span style={styles.uploadingText}>Uploading...</span>}
            {errors.images && <span style={styles.error}>{errors.images}</span>}
          </div>

          {formData.images.length > 0 && (
            <div style={styles.imageGrid}>
              {formData.images.map((url, index) => (
                <div key={index} style={styles.imagePreview}>
                  <img src={url} alt={`Product ${index + 1}`} style={styles.previewImage} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={styles.removeImageButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sizes & Stock */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Sizes & Stock</h2>
          
          {formData.sizes.map((size, index) => (
            <div key={index} style={styles.row}>
              <div style={styles.formGroup}>
                <input
                  type="text"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  style={styles.input}
                  placeholder="Size (e.g., S, M, L)"
                />
              </div>
              <div style={styles.formGroup}>
                <input
                  type="number"
                  value={size.stock}
                  onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                  style={styles.input}
                  placeholder="Stock"
                  min="0"
                />
              </div>
              {formData.sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addSize} style={styles.addButton}>
            + Add Size
          </button>
        </div>

        {/* Colors */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Colors</h2>
          
          {formData.colors.map((color, index) => (
            <div key={index} style={styles.row}>
              <div style={styles.formGroup}>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  style={styles.input}
                  placeholder="Color name"
                />
              </div>
              {formData.colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addColor} style={styles.addButton}>
            + Add Color
          </button>
        </div>

        {/* Tags */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Tags</h2>
          
          {formData.tags.map((tag, index) => (
            <div key={index} style={styles.row}>
              <div style={styles.formGroup}>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  style={styles.input}
                  placeholder="Tag"
                />
              </div>
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addTag} style={styles.addButton}>
            + Add Tag
          </button>
        </div>

        {/* Status */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Status</h2>
          
          <div style={styles.formGroup}>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div style={styles.submitSection}>
          <button
            type="submit"
            disabled={loading || uploadingImages}
            style={{
              ...styles.submitButton,
              opacity: loading || uploadingImages ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottom: `1px solid ${colors.border}`,
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
    flex: 1,
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  error: {
    display: 'block',
    color: colors.error,
    fontSize: '12px',
    marginTop: spacing.xs,
  },
  fileInput: {
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
  uploadingText: {
    display: 'block',
    color: colors.primary,
    fontSize: '14px',
    marginTop: spacing.xs,
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    backgroundColor: colors.background,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  previewImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    width: '24px',
    height: '24px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: '50%',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: spacing.xs,
  },
  removeButton: {
    padding: '10px 16px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '24px',
  },
  submitSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AddProduct;
