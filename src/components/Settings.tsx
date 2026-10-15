import { useRef, useState, type ChangeEvent } from 'react';
import { exportState, importState, type ImportResult, type ProgressState } from '../lib/progress';

/**
 * Settings (plan §5/§7): export the whole progress object as a dated JSON
 * backup, and import one back. Import offers two modes — Replace all, or Add as
 * new profiles (profiles are the merge unit; no field-level merging).
 */
export function Settings({
  state,
  onBack,
  importReplace,
  importAdd,
}: {
  state: ProgressState;
  onBack: () => void;
  importReplace: (json: string) => ImportResult;
  importAdd: (json: string) => ImportResult;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importText, setImportText] = useState<string | null>(null);
  const [importErrors, setImportErrors] = useState<string[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const doExport = () => {
    const json = exportState(state);
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phonics-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Backup downloaded.');
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    const text = await file.text();
    const check = importState(text); // dry validation before the user commits
    if (check.ok) {
      setImportText(text);
      setImportErrors(null);
      setStatus(null);
    } else {
      setImportText(null);
      setImportErrors(check.errors);
      setStatus(null);
    }
  };

  const commit = (mode: 'replace' | 'add') => {
    if (!importText) return;
    const r = mode === 'replace' ? importReplace(importText) : importAdd(importText);
    if (r.ok) {
      setStatus(mode === 'replace' ? 'Imported — replaced all data.' : 'Imported — added as new profiles.');
      setImportText(null);
      setImportErrors(null);
    } else {
      setImportErrors(r.errors);
      setImportText(null);
    }
  };

  return (
    <div className="settings">
      <header className="dash-header">
        <button className="link-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Settings</h1>
      </header>

      <section className="settings-section">
        <h2>Your data</h2>
        <p className="settings-help">
          Everything is stored on this device. Download a backup to move to another device or keep a copy.
        </p>
        <button className="nav-btn" onClick={doExport}>
          Download backup
        </button>
      </section>

      <section className="settings-section">
        <h2>Import a backup</h2>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} hidden />
        <button className="nav-btn" onClick={() => fileRef.current?.click()}>
          Choose a backup file
        </button>

        {importText && (
          <div className="import-choice">
            <p>That backup looks valid. What would you like to do?</p>
            <button className="nav-btn primary" onClick={() => commit('replace')}>
              Replace all
            </button>
            <button className="nav-btn" onClick={() => commit('add')}>
              Add as new profiles
            </button>
          </div>
        )}

        {importErrors && (
          <div className="import-errors" role="alert">
            <p>Couldn't import that file:</p>
            <ul>
              {importErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {status && <p className="settings-status" role="status">{status}</p>}
    </div>
  );
}
