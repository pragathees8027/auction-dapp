import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faDiagramProject } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="http://localhost:3000/create/account"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faUserPlus} 
          width={16}
          height={16}
        />
        Create
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="http://localhost:3000/login"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faUser} 
          width={16}
          height={16}
        />
        Login
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faDiagramProject} 
          width={16}
          height={16} 
        />
        View Chain
      </a>
    </footer>
  );
}
