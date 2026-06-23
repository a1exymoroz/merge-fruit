import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import './TechStackPage.css';

const FRONTEND_REPO_URL = 'https://github.com/a1exymoroz/merge-fruit';
const BACKEND_REPO_URL = 'https://github.com/a1exymoroz/merge-fruit-api';

interface StackRow {
  layer: string;
  tech: string;
}

interface FlowDiagramProps {
  title: string;
  steps: string[];
}

const FRONTEND_STACK: StackRow[] = [
  { layer: 'Language', tech: 'TypeScript 5' },
  { layer: 'UI', tech: 'React 18, Vite 5, React Router 7' },
  { layer: 'State', tech: 'Redux Toolkit, React Redux' },
  { layer: 'Physics', tech: 'Matter.js' },
  { layer: 'i18n', tech: 'i18next, react-i18next (EN, PL, RU)' },
  { layer: 'Styling', tech: 'Plain CSS' },
  { layer: 'Auth (client)', tech: 'React Context, localStorage JWT' },
  { layer: 'API', tech: 'Native fetch' },
  { layer: 'Testing', tech: 'Playwright' },
  { layer: 'Deploy', tech: 'Netlify' },
];

const BACKEND_STACK: StackRow[] = [
  { layer: 'Runtime', tech: 'Java 21, Maven, Spring Boot 3.4.5' },
  { layer: 'API', tech: 'Spring Web (REST/JSON), Jakarta Validation' },
  { layer: 'Security', tech: 'Spring Security 6, BCrypt, JWT (JJWT 0.12.6 / HS256)' },
  { layer: 'Data', tech: 'PostgreSQL, Spring Data JPA, Hibernate, HikariCP, Flyway' },
  { layer: 'Email', tech: 'Brevo REST API via RestClient' },
  { layer: 'Ops', tech: 'Spring Actuator, Docker (local), Render + Neon (prod)' },
];

function RepoLink({ href, name }: { href: string; name: string }) {
  const { t } = useTranslation();

  return (
    <a
      href={href}
      className="tech-stack-repo-link"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('stack.viewRepo', { name })}
    >
      {name}
    </a>
  );
}

function StackTable({ rows }: { rows: StackRow[] }) {
  const { t } = useTranslation();

  return (
    <table className="stack-table">
      <thead>
        <tr>
          <th>{t('stack.layer')}</th>
          <th>{t('stack.tech')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.layer}>
            <td>{row.layer}</td>
            <td>{row.tech}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FlowDiagram({ title, steps }: FlowDiagramProps) {
  return (
    <article className="flow-diagram">
      <h3 className="flow-diagram-title">{title}</h3>
      <ol className="flow-steps">
        {steps.map((step) => (
          <li key={step} className="flow-step">
            {step}
          </li>
        ))}
      </ol>
    </article>
  );
}

function TechStackPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const backPath = isAuthenticated ? '/' : '/login';

  return (
    <div className="tech-stack-page">
      <header className="tech-stack-header">
        <div className="tech-stack-header-top">
          <Link to={backPath} className="tech-stack-back">
            {t('stack.back')}
          </Link>
          <LanguageSwitcher theme="dark" />
        </div>
        <h1>{t('stack.title')}</h1>
        <p className="tech-stack-intro">{t('stack.intro')}</p>
      </header>

      <section className="tech-stack-section">
        <h2>{t('stack.architecture')}</h2>
        <div className="architecture-diagram" aria-label={t('stack.architecture')}>
          <div className="arch-group">
            <span className="arch-group-label">{t('stack.archFrontend')}</span>
            <div className="arch-nodes">
              <span>React SPA</span>
              <span>Matter.js</span>
              <span>Redux</span>
            </div>
          </div>
          <div className="arch-arrow" aria-hidden="true">
            REST + JWT
          </div>
          <div className="arch-group">
            <span className="arch-group-label">{t('stack.archBackend')}</span>
            <div className="arch-nodes">
              <span>Spring Boot</span>
              <span>PostgreSQL</span>
            </div>
          </div>
        </div>
        <p className="tech-stack-hosting">
          {t('stack.hosting')}: Netlify (frontend) · Render + Neon (backend)
        </p>
      </section>

      <section className="tech-stack-section">
        <h2>{t('stack.frontend')}</h2>
        <RepoLink href={FRONTEND_REPO_URL} name="merge-fruit" />
        <StackTable rows={FRONTEND_STACK} />
      </section>

      <section className="tech-stack-section">
        <h2>{t('stack.backend')}</h2>
        <RepoLink href={BACKEND_REPO_URL} name="merge-fruit-api" />
        <StackTable rows={BACKEND_STACK} />
      </section>

      <section className="tech-stack-section">
        <h2>{t('stack.diagrams')}</h2>
        <div className="flow-diagram-grid">
          <FlowDiagram
            title={t('stack.flow.authRequest.title')}
            steps={[
              t('stack.flow.authRequest.step1'),
              t('stack.flow.authRequest.step2'),
              t('stack.flow.authRequest.step3'),
              t('stack.flow.authRequest.step4'),
            ]}
          />
          <FlowDiagram
            title={t('stack.flow.signup.title')}
            steps={[
              t('stack.flow.signup.step1'),
              t('stack.flow.signup.step2'),
              t('stack.flow.signup.step3'),
              t('stack.flow.signup.step4'),
              t('stack.flow.signup.step5'),
            ]}
          />
          <FlowDiagram
            title={t('stack.flow.login.title')}
            steps={[
              t('stack.flow.login.step1'),
              t('stack.flow.login.step2'),
              t('stack.flow.login.step3'),
            ]}
          />
          <FlowDiagram
            title={t('stack.flow.protected.title')}
            steps={[
              t('stack.flow.protected.step1'),
              t('stack.flow.protected.step2'),
              t('stack.flow.protected.step3'),
            ]}
          />
        </div>
      </section>
    </div>
  );
}

export default TechStackPage;
