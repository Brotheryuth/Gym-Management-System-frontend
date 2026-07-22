import React from 'react';
import Button from './Button';

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 20,
  onPageChange,
  itemLabel = 'items'
}) {
  if (!totalItems || totalItems <= pageSize) {
    return null;
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: '1px solid var(--color-border)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
        Showing <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{startItem}-{endItem}</span> of <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{totalItems}</span> {itemLabel}
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            minHeight: '34px',
            width: 'auto',
            padding: '4px 12px',
            fontSize: '13px'
          }}
        >
          Previous
        </Button>

        {pages.map((p) => {
          const isSelected = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                minWidth: '34px',
                height: '34px',
                padding: '0 8px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--color-border)',
                backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--bg-surface)',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                fontWeight: isSelected ? 700 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {p}
            </button>
          );
        })}

        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            minHeight: '34px',
            width: 'auto',
            padding: '4px 12px',
            fontSize: '13px'
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
