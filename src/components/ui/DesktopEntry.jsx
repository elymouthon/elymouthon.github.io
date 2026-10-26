import { useState } from 'react';

const finderItems = [
  { name: 'datasets_2025.csv', type: 'file' },
  { name: 'models_ML', type: 'folder' },
  { name: 'sql_queries.sql', type: 'file' },
  { name: 'archive_insee', type: 'folder' },
  { name: 'visualisations', type: 'folder' },
];

function FolderIcon({ active = false }) {
  return (
    <svg className={`finder-icon${active ? ' finder-icon--active' : ''}`} viewBox="0 0 96 76" aria-hidden="true">
      <path className="finder-icon__folder-back" d="M7 16.5A7.5 7.5 0 0 1 14.5 9H39l9 9h33.5a7.5 7.5 0 0 1 7.5 7.5v4H7v-13Z" />
      <path className="finder-icon__folder-front" d="M5 27.5h86l-5.7 38.2A7.5 7.5 0 0 1 77.9 72H18.1a7.5 7.5 0 0 1-7.4-6.3L5 27.5Z" />
      {active && <path className="finder-icon__shine" d="M13 34h70" />}
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="finder-icon finder-icon--file" viewBox="0 0 72 88" aria-hidden="true">
      <path className="finder-icon__paper" d="M10 4h35l17 17v63H10V4Z" />
      <path className="finder-icon__fold" d="M45 4v18h17" />
      <path className="finder-icon__lines" d="M20 42h32M20 53h32M20 64h21" />
    </svg>
  );
}

function FinderItem({ name, type }) {
  return (
    <div className="finder-item" aria-hidden="true">
      {type === 'folder' ? <FolderIcon /> : <FileIcon />}
      <span>{name}{type === 'folder' ? '/' : ''}</span>
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
      <div className="finder-window">
        <header className="finder-window__bar">
          <div className="finder-window__traffic-lights" aria-hidden="true">
            <i className="finder-window__light finder-window__light--red" />
            <i className="finder-window__light finder-window__light--yellow" />
            <i className="finder-window__light finder-window__light--green" />
          </div>
          <span className="finder-window__title">Ely_Mouthon — Data</span>
          <span className="finder-window__counter">6 items</span>
        </header>

        <section className="finder-window__content" aria-label="Répertoire de projets data">
          <div className="finder-window__path">[ HOME ] / ELY_MOUTHON / DATA</div>
          <div className="finder-grid">
            {finderItems.map((item) => <FinderItem key={item.name} {...item} />)}
            <button className="finder-item finder-item--portfolio" type="button" onClick={handleEnter}>
              <FolderIcon active />
              <span>Portfolio.exe</span>
              <small>Cliquez pour ouvrir</small>
            </button>
          </div>
        </section>
      </div>
      <p className="desktop-entry__hint">Sélectionnez Portfolio.exe pour entrer dans l&apos;expérience</p>
    </main>
  );
}

export default DesktopEntry;
