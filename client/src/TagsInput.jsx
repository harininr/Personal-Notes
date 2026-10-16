import { useState, useRef } from 'react';

export default function TagsInput({ tags, onChange }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addTag = (val) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (t) => onChange(tags.filter(tag => tag !== t));

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="tags-input-wrapper" onClick={() => inputRef.current?.focus()}>
      {tags.map(t => (
        <span key={t} className="tag" onClick={() => removeTag(t)}>{t} ×</span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length ? '' : 'Add tags, press Enter'}
      />
    </div>
  );
}
