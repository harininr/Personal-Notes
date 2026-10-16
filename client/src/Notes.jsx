import { useState, useEffect, useCallback } from 'react';
import api from './api';
import NoteModal from './NoteModal';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Notes({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { note?: NoteObj }
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (tagFilter) params.tag = tagFilter;
      const { data } = await api.get('/notes', { params });
      setNotes(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [search, tagFilter]);

  useEffect(() => {
    const t = setTimeout(fetchNotes, 300);
    return () => clearTimeout(t);
  }, [fetchNotes]);

  const handleSave = async (form) => {
    if (modal.note) {
      await api.put(`/notes/${modal.note._id}`, form);
    } else {
      await api.post('/notes', form);
    }
    setModal(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`);
    setDeleteConfirm(null);
    fetchNotes();
  };

  const togglePin = async (note) => {
    await api.put(`/notes/${note._id}`, { pinned: !note.pinned });
    fetchNotes();
  };

  const pinnedNotes = notes.filter(n => n.pinned);
  const otherNotes  = notes.filter(n => !n.pinned);

  return (
    <div className="app-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">NoteKeeper</div>
        <div className="navbar-right">
          <span className="navbar-user">Hi, {user.username}</span>
          <button className="btn-logout" onClick={onLogout}>Sign Out</button>
        </div>
      </nav>

      <div className="main-content">
        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
          />
          {tagFilter && (
            <span className="active-filter">
              #{tagFilter}
              <button onClick={() => setTagFilter('')}>×</button>
            </span>
          )}
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setModal({})}>
            + New Note
          </button>
        </div>

        {/* Notes */}
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            
            <p>{search || tagFilter ? 'No notes match your search.' : 'No notes yet. Create your first one!'}</p>
          </div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <>
                <div className="section-label">Pinned</div>
                <div className="notes-grid" style={{ marginBottom: '1.5rem' }}>
                  {pinnedNotes.map(note => (
                    <NoteCard key={note._id} note={note}
                      onEdit={() => setModal({ note })}
                      onDelete={() => setDeleteConfirm(note._id)}
                      onPin={() => togglePin(note)}
                      onTagClick={setTagFilter}
                    />
                  ))}
                </div>
              </>
            )}
            {otherNotes.length > 0 && (
              <>
                {pinnedNotes.length > 0 && <div className="section-label">All Notes</div>}
                <div className="notes-grid">
                  {otherNotes.map(note => (
                    <NoteCard key={note._id} note={note}
                      onEdit={() => setModal({ note })}
                      onDelete={() => setDeleteConfirm(note._id)}
                      onPin={() => togglePin(note)}
                      onTagClick={setTagFilter}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Note Modal */}
      {modal && (
        <NoteModal note={modal.note} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-title">Delete Note?</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete, onPin, onTagClick }) {
  return (
    <div className={`note-card ${note.pinned ? 'pinned' : ''}`}>
      {note.pinned && <span className="pin-badge">pinned</span>}
      <div className="note-title">{note.title}</div>
      {note.content && <div className="note-content">{note.content}</div>}
      {note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map(t => (
            <span key={t} className="tag" onClick={() => onTagClick(t)}>#{t}</span>
          ))}
        </div>
      )}
      <div className="note-date">Updated {formatDate(note.updatedAt)}</div>
      <div className="note-actions">
        <button className="btn btn-sm btn-outline" onClick={onEdit}>Edit</button>
        <button className="btn btn-sm btn-ghost" onClick={onPin} title={note.pinned ? 'Unpin' : 'Pin'}>
          {note.pinned ? 'Unpin' : 'Pin'}
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>Del</button>
      </div>
    </div>
  );
}
