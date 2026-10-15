import { useState } from 'react';
import type { Profile } from '../lib/progress';

/**
 * Home screen (plan §5): a child profile picker. Each card shows the child's
 * name and "Lesson N". Tapping a card opens that child's dashboard; Rename and
 * Delete are small secondary actions. A form at the bottom adds a new child.
 */
export function ProfileHome({
  profiles,
  onAdd,
  onRename,
  onDelete,
  onSelect,
}: {
  profiles: Profile[];
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const submitAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName);
    setNewName('');
  };

  const startRename = (p: Profile) => {
    setEditingId(p.id);
    setEditName(p.name);
  };

  const submitRename = () => {
    if (editingId && editName.trim()) onRename(editingId, editName);
    setEditingId(null);
  };

  const confirmDelete = (p: Profile) => {
    if (window.confirm(`Delete ${p.name}'s progress? This can't be undone.`)) {
      onDelete(p.id);
    }
  };

  return (
    <div className="home">
      <h1>Reading Lessons</h1>
      <p className="subtitle">Pick a child to continue, or add a new one.</p>

      {profiles.length > 0 && (
        <ul className="profile-list">
          {profiles.map((p) => (
            <li key={p.id} className="profile-card">
              {editingId === p.id ? (
                <div className="profile-edit">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                    aria-label={`Rename ${p.name}`}
                    autoFocus
                  />
                  <button className="nav-btn primary" onClick={submitRename}>
                    Save
                  </button>
                  <button className="nav-btn" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button className="profile-main" onClick={() => onSelect(p.id)}>
                    <strong>{p.name}</strong>
                    <span>Lesson {p.currentLesson}</span>
                  </button>
                  <div className="profile-actions">
                    <button className="link-btn" onClick={() => startRename(p)}>
                      Rename
                    </button>
                    <button className="link-btn danger" onClick={() => confirmDelete(p)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="add-profile">
        <input
          placeholder="Child's name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
          aria-label="New child's name"
        />
        <button className="nav-btn primary" onClick={submitAdd} disabled={!newName.trim()}>
          Add child
        </button>
      </div>
    </div>
  );
}
