import React, { useState, useEffect } from 'react';
import {
  Settings,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Globe,
  Save,
  CheckCircle2,
  ExternalLink,
  Share2,
  Building2,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './SettingsModule.css';

export default function SettingsModule() {
  const { companySettings, updateCompanySettings } = useApp();

  const [formData, setFormData] = useState({
    whatsapp_number: '',
    contact_number: '',
    secondary_phone: '',
    support_email: '',
    office_address: '',
    business_hours: '',
    maps_link: '',
    website_url: '',
    instagram_url: '',
    facebook_url: ''
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (companySettings) {
      setFormData(companySettings);
    }
  }, [companySettings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompanySettings(formData);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 4000);
  };

  // Helper to format WhatsApp link for testing
  const cleanWhatsappNumber = (formData.whatsapp_number || '').replace(/[^\d]/g, '');
  const whatsappTestUrl = `https://wa.me/${cleanWhatsappNumber}`;

  return (
    <div className="settings-module">
      {/* Header Banner */}
      <div className="settings-header">
        <div>
          <div className="module-title-row">
            <Settings className="module-header-icon" size={28} />
            <h1 className="module-title">System & Contact Settings</h1>
          </div>
          <p className="module-subtitle">
            Manage official WhatsApp line, phone numbers, office location, and company details editable by Admin.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="settings-success-alert">
          <CheckCircle2 size={20} />
          <span>Settings saved successfully! WhatsApp and primary contact numbers updated across system.</span>
        </div>
      )}

      {/* Quick Overview Cards */}
      <div className="settings-overview-grid">
        <div className="settings-overview-card green">
          <div className="overview-card-icon">
            <MessageSquare size={22} />
          </div>
          <div>
            <div className="overview-card-label">Official WhatsApp Line</div>
            <div className="overview-card-value">{formData.whatsapp_number || 'Not Set'}</div>
          </div>
          {cleanWhatsappNumber && (
            <a
              href={whatsappTestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="overview-card-action"
              title="Test WhatsApp Link"
            >
              <ExternalLink size={14} /> Test Link
            </a>
          )}
        </div>

        <div className="settings-overview-card yellow">
          <div className="overview-card-icon">
            <Phone size={22} />
          </div>
          <div>
            <div className="overview-card-label">Primary Contact Number</div>
            <div className="overview-card-value">{formData.contact_number || 'Not Set'}</div>
          </div>
        </div>

        <div className="settings-overview-card blue">
          <div className="overview-card-icon">
            <Mail size={22} />
          </div>
          <div>
            <div className="overview-card-label">Official Support Email</div>
            <div className="overview-card-value">{formData.support_email || 'Not Set'}</div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="settings-form-wrapper">
        {/* Section 1: WhatsApp & Phone Numbers */}
        <div className="settings-card-section">
          <div className="settings-section-header">
            <Smartphone size={20} />
            <div>
              <h3>1. WhatsApp & Primary Contact Numbers</h3>
              <p>Configure official customer contact numbers & WhatsApp business integration line</p>
            </div>
          </div>

          <div className="settings-form-grid-2">
            <div className="form-field">
              <label className="field-label required">
                WhatsApp Business Number <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <MessageSquare size={16} className="input-left-icon green" />
                <input
                  type="text"
                  className="form-input icon-padded"
                  placeholder="e.g. +91 98421 88321"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  required
                />
              </div>
              <span className="field-hint">Used for automated quote sharing and instant customer WhatsApp chat.</span>
            </div>

            <div className="form-field">
              <label className="field-label required">
                Primary Contact Number <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Phone size={16} className="input-left-icon yellow" />
                <input
                  type="text"
                  className="form-input icon-padded"
                  placeholder="e.g. +91 98421 88321"
                  value={formData.contact_number}
                  onChange={(e) => handleChange('contact_number', e.target.value)}
                  required
                />
              </div>
              <span className="field-hint">Main office helpline displayed on header and customer invoices.</span>
            </div>

            <div className="form-field">
              <label className="field-label">Secondary / Support Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-left-icon" />
                <input
                  type="text"
                  className="form-input icon-padded"
                  placeholder="e.g. +91 97892 11045"
                  value={formData.secondary_phone}
                  onChange={(e) => handleChange('secondary_phone', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Official Support Email</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-left-icon" />
                <input
                  type="email"
                  className="form-input icon-padded"
                  placeholder="e.g. contact@yeloline.com"
                  value={formData.support_email}
                  onChange={(e) => handleChange('support_email', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Office Location & Timings */}
        <div className="settings-card-section">
          <div className="settings-section-header">
            <Building2 size={20} />
            <div>
              <h3>2. Office Location & Working Timings</h3>
              <p>Headquarters address, Google Maps link, and working hours</p>
            </div>
          </div>

          <div className="settings-form-grid-2">
            <div className="form-field full-width">
              <label className="field-label">Head Office Address</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-left-icon" />
                <input
                  type="text"
                  className="form-input icon-padded"
                  placeholder="e.g. No. 45, Perundurai Road, Near Golden City, Erode - 638011, Tamil Nadu"
                  value={formData.office_address}
                  onChange={(e) => handleChange('office_address', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Working Days & Hours</label>
              <div className="input-with-icon">
                <Clock size={16} className="input-left-icon" />
                <input
                  type="text"
                  className="form-input icon-padded"
                  placeholder="e.g. Monday - Saturday: 8:30 AM - 7:00 PM"
                  value={formData.business_hours}
                  onChange={(e) => handleChange('business_hours', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Google Maps Location URL</label>
              <div className="input-with-icon">
                <Globe size={16} className="input-left-icon" />
                <input
                  type="text"
                  className="form-input icon-padded"
                  placeholder="e.g. https://maps.google.com/?q=..."
                  value={formData.maps_link}
                  onChange={(e) => handleChange('maps_link', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Website & Social Media */}
        <div className="settings-card-section">
          <div className="settings-section-header">
            <Globe size={20} />
            <div>
              <h3>3. Digital & Social Media Links</h3>
              <p>Official website and social media profiles</p>
            </div>
          </div>

          <div className="settings-form-grid-3">
            <div className="form-field">
              <label className="field-label">Official Website URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. https://yeloline.com"
                value={formData.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Instagram Profile Link</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. https://instagram.com/yeloline_constructions"
                value={formData.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Facebook Page Link</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. https://facebook.com/yelolineconstructions"
                value={formData.facebook_url}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="settings-footer-actions">
          <button type="submit" className="btn btn-primary large">
            <Save size={18} />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
