import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SettingsSectionSkeleton } from '../components/skeletons';

const SECTION_CONFIG = {
  account: {
    title: 'Account',
    subtitle: 'Manage your profile and organization details',
    path: 'account'
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Select which event, ticket, and gateway alerts you receive',
    path: 'notifications'
  },
  privacy: {
    title: 'Privacy & Security',
    subtitle: 'Two-factor authentication, sessions, and compliance controls',
    path: 'privacy & security'
  },
  appearance: {
    title: 'Appearance & Theme',
    subtitle: 'Customize the interface styling and density',
    path: 'appearance'
  },
  integrations: {
    title: 'Connected Integrations',
    subtitle: 'Connect payment gateways, streaming providers, and communication webhooks',
    path: 'integrations'
  }
};

export default function SettingsView() {
  const { isDarkMode, toggleDarkMode, showToast, accountSettings, updateAccountSettings } = useApp();
  const [activeSection, setActiveSection] = useState('account');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [accountFormData, setAccountFormData] = useState({
    displayName: accountSettings?.displayName || 'Ravi Prasanth',
    email: accountSettings?.email || 'ravi@knotnex.com',
    phone: accountSettings?.phone || '+91 98765 43210',
    orgName: accountSettings?.orgName || 'Knotbox Technologies Foundation',
    plan: accountSettings?.plan || 'Enterprise — Active Tier'
  });

  useEffect(() => {
    if (!isEditing && accountSettings) {
      setAccountFormData({
        displayName: accountSettings.displayName || '',
        email: accountSettings.email || '',
        phone: accountSettings.phone || '',
        orgName: accountSettings.orgName || '',
        plan: accountSettings.plan || 'Enterprise — Active Tier'
      });
    }
  }, [accountSettings, isEditing]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!accountFormData.displayName.trim()) {
      showToast('Display Name cannot be empty', 'error');
      return;
    }
    if (!accountFormData.email.trim()) {
      showToast('Email Address cannot be empty', 'error');
      return;
    }
    updateAccountSettings(accountFormData);
    setIsEditing(false);
    showToast('Changes saved successfully!', 'success');
  };

  const handleCancel = () => {
    if (accountSettings) {
      setAccountFormData({
        displayName: accountSettings.displayName || '',
        email: accountSettings.email || '',
        phone: accountSettings.phone || '',
        orgName: accountSettings.orgName || '',
        plan: accountSettings.plan || 'Enterprise — Active Tier'
      });
    }
    setIsEditing(false);
  };

  const handleSectionChange = (sectionKey) => {
    if (sectionKey === activeSection) return;
    setIsTabLoading(true);
    setIsEditing(false);
    setActiveSection(sectionKey);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  // Toggle states
  const [settingsToggles, setSettingsToggles] = useState({
    notifEvents: true,
    notifTickets: true,
    notifDigest: false,
    twoFactor: true,
    publicProfile: true
  });

  const toggle = (key) => {
    setSettingsToggles(prev => {
      const next = !prev[key];
      showToast(`Preference updated.`, 'info');
      return { ...prev, [key]: next };
    });
  };

  const renderSectionHead = (key) => {
    const config = SECTION_CONFIG[key] || {
      title: key,
      subtitle: '',
      path: key
    };

    return (
      <div className="settings-section-head">
        <div className="settings-section-head-info">
          <h3>{config.title}</h3>
          <p>{config.subtitle}</p>
        </div>
        {key === 'account' && (
          <div className="settings-section-head-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn-secondary"
                id="btnCardEditAccount"
                onClick={() => setIsEditing(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '13px' }}
                title="Edit account details"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit</span>
              </button>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  id="btnCardCancelAccount"
                  onClick={handleCancel}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  id="btnCardSaveAccount"
                  onClick={handleSave}
                  style={{ padding: '6px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="app-view active" id="viewSettings">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account, notifications, privacy, and organization preferences.</p>
          </div>
        </div>
        <div className="header-actions">
          {activeSection === 'account' && (
            <div>
              {!isEditing ? (
                <button
                  type="button"
                  className="btn-secondary"
                  id="btnTopEditAccountSettings"
                  onClick={() => setIsEditing(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  title="Edit account details"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Edit</span>
                </button>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    id="btnTopCancelAccountSettings"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    id="btnTopSaveAccountSettings"
                    onClick={handleSave}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="settings-layout">
        {/* Settings Navigation */}
        <div className="settings-nav">
          <button
            className={`settings-nav-item ${activeSection === 'account' ? 'active' : ''}`}
            onClick={() => handleSectionChange('account')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span>Account</span>
          </button>
          <button
            className={`settings-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => handleSectionChange('notifications')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            <span>Notifications</span>
          </button>
          <button
            className={`settings-nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => handleSectionChange('privacy')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span>Privacy &amp; Security</span>
          </button>
          <button
            className={`settings-nav-item ${activeSection === 'appearance' ? 'active' : ''}`}
            onClick={() => handleSectionChange('appearance')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            <span>Appearance</span>
          </button>
          <button
            className={`settings-nav-item ${activeSection === 'integrations' ? 'active' : ''}`}
            onClick={() => handleSectionChange('integrations')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="7" height="7" /><rect x="15" y="3" width="7" height="7" /><rect x="15" y="14" width="7" height="7" /><rect x="2" y="14" width="7" height="7" /><line x1="9" y1="6.5" x2="15" y2="6.5" /><line x1="18.5" y1="10" x2="18.5" y2="14" /><line x1="9" y1="17.5" x2="15" y2="17.5" /><line x1="5.5" y1="10" x2="5.5" y2="14" /></svg>
            <span>Integrations</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {isTabLoading ? (
            <SettingsSectionSkeleton rows={4} />
          ) : (
            <>
              {/* Section: Account */}
              {activeSection === 'account' && (
            <div className="settings-section active" id="settingsSectionAccount">
              {renderSectionHead('account')}

              <form onSubmit={handleSave}>
                <div className="settings-group">
                  <div className="settings-group-label">Profile</div>
                  
                  <div className="settings-row" style={{ alignItems: isEditing ? 'flex-start' : 'center' }}>
                    <div className="settings-row-info">
                      <div className="settings-row-title">Display Name</div>
                      {isEditing ? (
                        <div style={{ marginTop: '6px' }}>
                          <input
                            type="text"
                            className="form-input"
                            id="accountInputDisplayName"
                            style={{ width: '100%', maxWidth: '380px' }}
                            value={accountFormData.displayName}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, displayName: e.target.value }))}
                            placeholder="Enter your display name"
                            required
                          />
                        </div>
                      ) : (
                        <div className="settings-row-desc">{accountSettings?.displayName || 'Ravi Prasanth'}</div>
                      )}
                    </div>
                  </div>

                  <div className="settings-row" style={{ alignItems: isEditing ? 'flex-start' : 'center' }}>
                    <div className="settings-row-info">
                      <div className="settings-row-title">Email Address</div>
                      {isEditing ? (
                        <div style={{ marginTop: '6px' }}>
                          <input
                            type="email"
                            className="form-input"
                            id="accountInputEmail"
                            style={{ width: '100%', maxWidth: '380px' }}
                            value={accountFormData.email}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                      ) : (
                        <div className="settings-row-desc">{accountSettings?.email || 'ravi@knotnex.com'}</div>
                      )}
                    </div>
                  </div>

                  <div className="settings-row" style={{ alignItems: isEditing ? 'flex-start' : 'center' }}>
                    <div className="settings-row-info">
                      <div className="settings-row-title">Phone Number</div>
                      {isEditing ? (
                        <div style={{ marginTop: '6px' }}>
                          <input
                            type="tel"
                            className="form-input"
                            id="accountInputPhone"
                            style={{ width: '100%', maxWidth: '380px' }}
                            value={accountFormData.phone}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter contact phone number"
                          />
                        </div>
                      ) : (
                        <div className="settings-row-desc">{accountSettings?.phone || '+91 98765 43210'}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="settings-group" style={{ marginTop: '16px' }}>
                  <div className="settings-group-label">Organization</div>
                  
                  <div className="settings-row" style={{ alignItems: isEditing ? 'flex-start' : 'center' }}>
                    <div className="settings-row-info">
                      <div className="settings-row-title">Organization Name</div>
                      {isEditing ? (
                        <div style={{ marginTop: '6px' }}>
                          <input
                            type="text"
                            className="form-input"
                            id="accountInputOrgName"
                            style={{ width: '100%', maxWidth: '380px' }}
                            value={accountFormData.orgName}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, orgName: e.target.value }))}
                            placeholder="Enter organization legal name"
                            required
                          />
                        </div>
                      ) : (
                        <div className="settings-row-desc">{accountSettings?.orgName || 'Knotbox Technologies Foundation'}</div>
                      )}
                    </div>
                  </div>

                  <div className="settings-row" style={{ alignItems: isEditing ? 'flex-start' : 'center' }}>
                    <div className="settings-row-info">
                      <div className="settings-row-title">Subscription Plan</div>
                      {isEditing ? (
                        <div style={{ marginTop: '6px' }}>
                          <select
                            className="form-select"
                            id="accountSelectPlan"
                            style={{ width: '100%', maxWidth: '380px' }}
                            value={accountFormData.plan}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, plan: e.target.value }))}
                          >
                            <option value="Enterprise — Active Tier">Enterprise — Active Tier</option>
                            <option value="Growth — Active Tier">Growth — Active Tier</option>
                            <option value="Starter — Basic Tier">Starter — Basic Tier</option>
                          </select>
                        </div>
                      ) : (
                        <div className="settings-row-desc">{accountSettings?.plan || 'Enterprise — Active Tier'}</div>
                      )}
                    </div>
                    {!isEditing && (
                      <span className="status-badge active" style={{ padding: '4px 10px', fontSize: '12px' }}>
                        ● Active Tier
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Row when in Edit Mode */}
                {isEditing && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '16px',
                      padding: '14px 20px',
                      background: 'var(--bg-surface-subtle, #F8FAFC)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-default, #E2E8F0)'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--neutral-500, #64748B)', marginRight: 'auto' }}>
                      You have unsaved changes.
                    </span>
                    <button
                      type="button"
                      className="btn-secondary"
                      id="btnBottomCancelAccount"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      id="btnBottomSaveAccount"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Section: Notifications */}
          {activeSection === 'notifications' && (
            <div className="settings-section active">
              {renderSectionHead('notifications')}

              <div className="settings-group">
                <div className="settings-group-label">Alert Channels</div>
                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">New Event Registrations</div>
                    <div className="settings-row-desc">Receive real-time push alert when an attendee secures a pass</div>
                  </div>
                  <label className="active-toggle-ios" title={settingsToggles.notifEvents ? 'Active' : 'Inactive'}>
                    <input
                      type="checkbox"
                      checked={settingsToggles.notifEvents}
                      onChange={() => toggle('notifEvents')}
                    />
                    <span className="active-toggle-slider" />
                  </label>
                </div>

                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">Support Ticket Alerts</div>
                    <div className="settings-row-desc">Notify immediate response team when attendee raises a booking error</div>
                  </div>
                  <label className="active-toggle-ios" title={settingsToggles.notifTickets ? 'Active' : 'Inactive'}>
                    <input
                      type="checkbox"
                      checked={settingsToggles.notifTickets}
                      onChange={() => toggle('notifTickets')}
                    />
                    <span className="active-toggle-slider" />
                  </label>
                </div>

                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">Weekly Disbursal Digest</div>
                    <div className="settings-row-desc">Weekly summary email of grant scheme applications and gate attendance</div>
                  </div>
                  <label className="active-toggle-ios" title={settingsToggles.notifDigest ? 'Active' : 'Inactive'}>
                    <input
                      type="checkbox"
                      checked={settingsToggles.notifDigest}
                      onChange={() => toggle('notifDigest')}
                    />
                    <span className="active-toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section: Privacy */}
          {activeSection === 'privacy' && (
            <div className="settings-section active">
              {renderSectionHead('privacy')}

              <div className="settings-group">
                <div className="settings-group-label">Authentication</div>
                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">Two-Factor Authentication (2FA)</div>
                    <div className="settings-row-desc">Secure account logins using an authenticator app (TOTP)</div>
                  </div>
                  <label className="active-toggle-ios" title={settingsToggles.twoFactor ? 'Active' : 'Inactive'}>
                    <input
                      type="checkbox"
                      checked={settingsToggles.twoFactor}
                      onChange={() => toggle('twoFactor')}
                    />
                    <span className="active-toggle-slider" />
                  </label>
                </div>

                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">Active Devices &amp; Sessions</div>
                    <div className="settings-row-desc">Logged in on Chrome (Windows 11) — Bengaluru, India</div>
                  </div>
                  <button className="settings-row-action" onClick={() => showToast('Logged out from other devices')}>Revoke Others</button>
                </div>
              </div>
            </div>
          )}

          {/* Section: Appearance */}
          {activeSection === 'appearance' && (
            <div className="settings-section active">
              {renderSectionHead('appearance')}

              <div className="settings-group">
                <div className="settings-group-label">Theme Mode</div>
                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">Dark Mode Theme</div>
                    <div className="settings-row-desc">Switch between light Minimal Canvas and Obsidian dark theme</div>
                  </div>
                  <label
                    className="active-toggle-ios"
                    id="darkThemeToggle"
                    title={isDarkMode ? 'Dark Mode Active (Click to switch to Light Canvas)' : 'Light Mode Active (Click to switch to Obsidian Dark)'}
                  >
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={() => {
                        toggleDarkMode();
                        showToast(isDarkMode ? 'Switched to Light Canvas theme' : 'Switched to Obsidian Dark theme', 'info');
                      }}
                    />
                    <span className="active-toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section: Integrations */}
          {activeSection === 'integrations' && (
            <div className="settings-section active">
              {renderSectionHead('integrations')}

              <div className="settings-group">
                <div className="settings-group-label">Payment &amp; Communications</div>
                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">HDFC &amp; UPI Payment Gateway</div>
                    <div className="settings-row-desc">Connected for instant ticket fee settlement</div>
                  </div>
                  <span className="status-badge active">● Connected</span>
                </div>

                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">Slack Notifications</div>
                    <div className="settings-row-desc">Broadcast gate scan alerts and attendee issues to #knotnex-ops</div>
                  </div>
                  <button className="settings-row-action" onClick={() => showToast('Slack webhook connected')}>Connect</button>
                </div>

                <div className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-title">Zoom &amp; YouTube Live</div>
                    <div className="settings-row-desc">Auto-sync livestream keynotes into the AI highlight generator</div>
                  </div>
                  <span className="status-badge active">● Connected</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
    </section>
  );
}
