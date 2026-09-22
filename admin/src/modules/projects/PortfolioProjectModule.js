import React, { useState } from 'react';
import { Plus, Star, MapPin, Clock, Edit3, Trash2, Layers, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/common/Modal/Modal';
import MultiImageUploader from '../../components/common/MultiImageUploader/MultiImageUploader';
import CoverImageUploader from '../../components/common/CoverImageUploader/CoverImageUploader';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import './PortfolioProjectModule.css';

const CATEGORIES = ["Residential", "Commercial", "Villa", "Renovation"];

export default function PortfolioProjectModule() {
  const { projects, addProject, editProject, deleteProject, toggleFeaturedProject } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Villa',
    client_name: '',
    location: '',
    area_sqft: 3000,
    duration_months: 8,
    completion_date: '2026-10-01',
    description: '',
    cover_image: '',
    gallery_images: [],
    featured: false
  });

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Villa',
      client_name: '',
      location: '',
      area_sqft: 3000,
      duration_months: 8,
      completion_date: '2026-10-01',
      description: '',
      cover_image: '',
      gallery_images: [],
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({ ...proj });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      editProject(formData);
    } else {
      addProject(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="projects-container">
      <div className="leads-header-row">
        <div>
          <h1 className="dashboard-title">Portfolio Project Management</h1>
          <p className="dashboard-subtitle">Upload & showcase finished and ongoing construction showcase projects for client mobile app</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Create New Project
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="leads-filter-bar">
        <CustomSelect
          icon={Filter}
          label="Category:"
          value={selectedCategory}
          onChange={(val) => setSelectedCategory(val)}
          options={[
            { value: "ALL", label: `All Showcase Projects (${projects.length})`, badge: projects.length },
            ...CATEGORIES.map(c => ({
              value: c,
              label: c,
              badge: projects.filter(p => p.category === c).length
            }))
          ]}
        />
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map(proj => (
          <div key={proj.project_id} className="project-card">
            <div className="project-card-image-wrap">
              <img src={proj.cover_image || (proj.gallery_images && proj.gallery_images[0]?.url)} alt={proj.title} className="project-card-image" />
              {proj.featured && (
                <div className="project-featured-badge">
                  <Star size={12} fill="var(--dark-charcoal)" /> Featured on App
                </div>
              )}
              <div className="project-category-badge">{proj.category}</div>
            </div>

            <div className="project-card-body">
              <h3 className="project-card-title">{proj.title}</h3>

              <div className="project-meta-row">
                <div className="project-meta-item"><MapPin size={13} /> {proj.location}</div>
                <div className="project-meta-item"><Layers size={13} /> {proj.area_sqft} sq. ft.</div>
                <div className="project-meta-item"><Clock size={13} /> {proj.duration_months} mo</div>
              </div>

              <p className="project-description">{proj.description}</p>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Gallery Photos ({proj.gallery_images?.length || 0}):
                </div>
                <div className="project-gallery-thumbs">
                  {(proj.gallery_images || []).slice(0, 4).map((g, i) => (
                    <img key={g.id || i} src={g.url} alt={g.tag} className="project-thumb-small" title={g.tag} />
                  ))}
                  {(proj.gallery_images?.length || 0) > 4 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                      +{proj.gallery_images.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="project-card-footer">
              <button
                style={{
                  background: proj.featured ? 'var(--primary-yellow-light)' : 'transparent',
                  border: '1px solid var(--light-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: proj.featured ? 'var(--accent-yellow-dark)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onClick={() => toggleFeaturedProject(proj.project_id)}
              >
                <Star size={13} fill={proj.featured ? 'var(--accent-yellow-dark)' : 'none'} />
                {proj.featured ? 'Featured' : 'Mark Featured'}
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  style={{ background: 'var(--light-background)', border: '1px solid var(--light-border)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => openEditModal(proj)}
                  title="Edit Project"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  style={{ background: 'var(--danger-bg)', border: 'none', color: 'var(--danger-red)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => deleteProject(proj.project_id)}
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? `Edit Project - ${editingProject.project_id}` : "Upload New Portfolio Project"}
        maxWidth="800px"
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Modern Luxury Villa - Erode"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Site Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Perundurai, Erode"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Built-up Area (Sq. Ft.)</label>
            <input
              type="number"
              className="form-input"
              value={formData.area_sqft}
              onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Months)</label>
            <input
              type="number"
              className="form-input"
              value={formData.duration_months}
              onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Completion Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.completion_date}
              onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description & Architectural Highlights</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Detailed specs, materials used, structural highlights..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Cover Image Drag & Drop Uploader */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Primary Cover Image (Drag & Drop File or Image URL)</label>
            <CoverImageUploader
              value={formData.cover_image}
              onChange={(newCover) => setFormData({ ...formData, cover_image: newCover })}
            />
          </div>

          {/* Multi Image Uploader Component */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Project Gallery Multi-Image Uploader (Elevation, Floor Plans, Interiors)</label>
            <MultiImageUploader
              images={formData.gallery_images || []}
              onChange={(updatedGallery) => setFormData({ ...formData, gallery_images: updatedGallery })}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Project Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
