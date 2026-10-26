import { useState } from 'react';

const decorativeItems = [
  { name: 'datasets_2025.csv', type: 'file', position: 'desktop-entry__item--one' },
  { name: 'models_ML', type: 'folder', position: 'desktop-entry__item--two' },
  { name: 'sql_queries.sql', type: 'file', position: 'desktop-entry__item--three' },
  { name: 'archive_insee', type: 'folder', position: 'desktop-entry__item--four' },
  { name: 'visualisations', type: 'folder', position: 'desktop-entry__item--five' },
];

function FolderIcon({ active = false }) {
  return (
    <svg className="desktop-entry__icon" viewBox="0 0 96 76" aria-hidden="true">
      <path
        className="desktop-entry__folder-back"
        d="M7 16.5A7.5 7.5 0 0 1 14.5 9H39l9 9h33.5a7.5 7.5 0 0 1 7.5 7.5v4H7v-13Z"
      />
      <path
        className="desktop-entry__folder-front"
        d="M5 27.5h86l-5.7 38.2A7.5 7.5 0 0 1 77.9 72H18.1a7.5 7.5 0 0 1-7.4-6.3L5 27.5Z"
      />
      {active && <path className="desktop-entry__folder-shine" d="M13 34h70" />}
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="desktop-entry__icon desktop-entry__icon--file" viewBox="0 0 72 88" aria-hidden="true">
      <path className="desktop-entry__file-paper" d="M10 4h35l17 17v63H10V4Z" />
      <path className="desktop-entry__file-fold" d="M45 4v18h17" />
      <path className="desktop-entry__file-lines" d="M20 42h32M20 53h32M20 64h21" />
    </svg>
  );
}

function DesktopItem({ item }) {
  return (
    <div className={`desktop-entry__item ${item.position}`} aria-hidden="true">
      {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
      <span>{item.name}{item.type === 'folder' ? '/' : ''}</span>
    </div>
  );
}

function DesktopEntry({ onEnter }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(onEnter, 850);
  };

  return (
    <main className={`desktop-entry${isExiting ? ' desktop-entry--exiting' : ''}`}>
      <div className="desktop-entry__topbar">
        <span className="desktop-entry__brand"><i /> ELY / DATA DESK</span>
        <span>MONDAY, 26 OCTOBER 2026</span>
        <span>[ 01 ] / OPEN DIRECTORY</span>
      </div>

      <div className="desktop-entry__grid" aria-label="Répertoire de projets data">
        {decorativeItems.map((item) => <DesktopItem item={item} key={item.name} />)}

        <button className="desktop-entry__portfolio" type="button" onClick={handleEnter}>
          <FolderIcon active />
          <span>Portfolio_Ely</span>
          <small>Cliquez pour ouvrir</small>
        </button>
      </div>

      <div className="desktop-entry__footer">
        <span>DATA / ARCHIVE / 2026</span>
        <span>Double click to explore</span>
      </div>
    </main>
  );
}

export default DesktopEntry;
