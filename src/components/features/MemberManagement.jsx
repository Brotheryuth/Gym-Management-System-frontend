import { useToast } from '../../context/ToastContext';
import { formatErrorMessage } from '../../utils/errorFormatter';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import MemberFormModal from './MemberFormModal';

export default function MemberManagement({
  members = [],
  recentMembers = [],
  plans = [],
  onRegisterMember,
  onUpdateMember,
  onDeleteMember,
  onViewProfile,
  onSubscribeMember,
  cashier,
  onShowAdminWarning
}) {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Cross-reference members with recentMembers to get real planName & status
  const enrichedMembers = members.map(m => {
    const activeSub = recentMembers.find(
      rm => String(rm.memberID) === String(m.memberID || m.id)
    );
    return {
      ...m,
      planName: activeSub ? activeSub.planName : (m.planName || 'No Active Plan'),
      status: activeSub ? activeSub.status : (m.status || 'INACTIVE')
    };
  });

  const activeCount = enrichedMembers.filter(m => m.status === 'ACTIVE').length;
  const inactiveCount = enrichedMembers.length - activeCount;

  // Filter & Sort
  const filteredMembers = enrichedMembers
    .filter(m => {
      const term = search.toLowerCase();
      const matchesSearch = (
        (m.fullName && m.fullName.toLowerCase().includes(term)) ||
        (m.phoneNumber && m.phoneNumber.toLowerCase().includes(term)) ||
        (m.memberID && String(m.memberID).toLowerCase().includes(term))
      );
      const matchesGender = genderFilter === 'ALL' || m.gender === genderFilter;
      const matchesPlan = planFilter === 'ALL' || m.planName === planFilter;
      return matchesSearch && matchesGender && matchesPlan;
    })
    .sort((a, b) => {
      if (sortBy === 'NAME_ASC') return (a.fullName || '').localeCompare(b.fullName || '');
      if (sortBy === 'NAME_DESC') return (b.fullName || '').localeCompare(a.fullName || '');
      if (sortBy === 'GENDER') return (a.gender || '').localeCompare(b.gender || '');
      if (sortBy === 'PLAN') return (a.planName || '').localeCompare(b.planName || '');
      return 0;
    });

  const pageSize = 20;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAddModal = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (selectedMember) {
        await onUpdateMember(selectedMember.memberID, formData);
        toast.success(`Member "${formData.fullName}" updated.`);
      } else {
        await onRegisterMember(formData);
        toast.success(`Member "${formData.fullName}" created.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(formatErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-overview-container">
      {/* 1. Stats dashboard box */}
      <div className="purity-grid-2-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Total Members</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">{totalMembers}</span>
            </div>
          </div>
          <div className="purity-metric-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Active Members</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: '#4bbe04' }}>{activeMembers}</span>
            </div>
          </div>
          <div className="purity-metric-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Inactive / Suspended</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: 'var(--color-error)' }}>{inactiveMembers}</span>
            </div>
          </div>
          <div className="purity-metric-icon red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Main data Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-blue)' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Registered Member Profiles
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '210px' }}>
              <InputField
                placeholder="Search name, ID, phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="mb-0"
                style={{ margin: 0 }}
              />
            </div>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL">All Plans</option>
              <option value="UNSUBSCRIBED">Unsubscribed (No Plan)</option>
              {plans.map(p => (
                <option key={p.planID} value={p.planName}>{p.planName}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="DEFAULT">Sort by Default</option>
              <option value="UNSUBSCRIBED_FIRST"> Unsubscribed First</option>
              <option value="SUBSCRIBED_FIRST">Subscribed First</option>
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="NAME_DESC">Name (Z-A)</option>
              <option value="GENDER">Gender</option>
              <option value="PLAN">Gym Plan</option>
            </select>

            <Button
              onClick={handleRegisterClick}
              style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '13px' }}
            >
              Register Member
            </Button>
          </div>
        </div>

        <div className="dashboard-table-container">
          <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No member profiles found.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((m, idx) => (
                  <tr key={m.memberID ? `m-${m.memberID}-${idx}` : `m-idx-${idx}`}>
                    <td style={{ fontWeight: 'bold' }}>{m.memberID || 'N/A'}</td>
                    <td>
                      <span 
                        className="member-name-cell"
                        onClick={() => onViewProfile && onViewProfile(m)}
                        style={{ cursor: 'pointer', color: 'var(--brand-primary)', fontWeight: 700 }}
                        title="Click to view full member profile"
                      >
                        {m.fullName}
                      </span>
                    </td>
                    <td>{m.phoneNumber}</td>
                    <td>{m.dob}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: '#f1f5f9',
                        color: 'var(--text-muted)'
                      }}>
                        {m.gender}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-round)',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: m.status === 'ACTIVE' ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                        color: m.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-error)',
                        border: `1px solid ${m.status === 'ACTIVE' ? 'rgba(22, 163, 74, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
                      }}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button
                          variant="secondary"
                          onClick={() => onViewProfile && onViewProfile(m)}
                          style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', width: 'auto' }}
                        >
                          View Profile
                        </Button>
                        {onSubscribeMember && (
                          <Button
                            onClick={() => onSubscribeMember(m)}
                            style={{
                              minHeight: '32px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              width: 'auto',
                              backgroundColor: 'var(--brand-primary)',
                              color: '#ffffff'
                            }}
                          >
                            + Add Membership
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          onClick={() => handleEditClick(m)}
                          style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', width: 'auto' }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(m.memberID)}
                          style={{
                            minHeight: '32px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            width: 'auto',
                            color: 'var(--color-error)',
                            border: '1.5px solid transparent'
                          }}
                          className="delete-member-btn"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredMembers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="members"
        />
      </Card>

      {/* Member Creation & Edit Popup Overlay Modal */}
      <MemberFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMember}
        isLoading={isSaving}
      />
    </div>
  );
}
