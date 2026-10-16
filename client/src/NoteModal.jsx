import { useState } from 'react';
import TagsInput from './TagsInput';

export default function NoteModal({ note, onSave, onClose }) {
  const [form, setForm] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags || [],
    pinned: note?.pinned || false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{note ? 'Edit Note' : 'New Note'}</div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Note title…"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Write your note…"
              rows={5}
            />
          </div>
          <div className="form-group">
            <label>Tags</label>
            <TagsInput tags={form.tags} onChange={tags => setForm({ ...form, tags })} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="pinned"
              checked={form.pinned}
              onChange={e => setForm({ ...form, pinned: e.target.checked })}
              style={{ width: 'auto', accentColor: 'var(--maroon)' }}
            />
            <label htmlFor="pinned" style={{ textTransform: 'none', fontSize: '0.88rem', cursor: 'pointer' }}>
              Pin this note
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Saving…' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
