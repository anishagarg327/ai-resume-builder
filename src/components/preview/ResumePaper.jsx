import { ResumePaperHeader } from './ResumePaperHeader'
import { ResumeSection } from './ResumeSection'
import { renderBullets } from '../../utils/renderHelpers'
import { getContactLineItems } from '../../utils/pdfGenerator'

export function ResumePaper({ resumeData, theme }) {
  const {
    name,
    title,
    summary,
    experience = [],
    education = [],
    projects = [],
    skills = '',
  } = resumeData || {}

  const contactLineItems = getContactLineItems(resumeData)

  const skillTags = (skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

  const isFormEmpty = !name && !title && !summary && experience.length === 0 && education.length === 0 && projects.length === 0 && !skills

  return (
    <div className={`resume-paper ${theme}`}>
      <ResumePaperHeader name={name} title={title} contactLineItems={contactLineItems} />

      {summary && (
        <ResumeSection title="Summary">
          <p className="resume-summary-text">{summary}</p>
        </ResumeSection>
      )}

      {experience && experience.length > 0 && (
        <ResumeSection title="Experience">
          <div className="resume-section-body">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="resume-item">
                <div className="resume-item-header">
                  <span className="resume-item-title">{exp.role || 'Role Name'}</span>
                  <span>{exp.duration}</span>
                </div>
                <div className="resume-item-sub">
                  <span>{exp.company}{exp.location && `, ${exp.location}`}</span>
                </div>
                {exp.description && (
                  <div className="resume-item-desc">
                    {renderBullets(exp.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {projects && projects.length > 0 && (
        <ResumeSection title="Projects">
          <div className="resume-section-body">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="resume-item">
                <div className="resume-item-header">
                  <span className="resume-item-title">{proj.name || 'Project Name'}</span>
                  <span>{proj.duration}</span>
                </div>
                <div className="resume-item-sub">
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'normal' }}>
                    {proj.technologies && `Technologies: ${proj.technologies}`}
                  </span>
                  {proj.link && (
                    <a href={`https://${proj.link}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>
                      {proj.link}
                    </a>
                  )}
                </div>
                {proj.description && (
                  <div className="resume-item-desc">
                    {renderBullets(proj.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {education && education.length > 0 && (
        <ResumeSection title="Education">
          <div className="resume-section-body">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="resume-item">
                <div className="resume-item-header">
                  <span className="resume-item-title">{edu.degree || 'Degree name'}</span>
                  <span>{edu.duration}</span>
                </div>
                <div className="resume-item-sub">
                  <span>{edu.school}{edu.location && `, ${edu.location}`}</span>
                </div>
                {edu.details && (
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {skillTags.length > 0 && (
        <ResumeSection title="Skills">
          <div className="skills-list">
            {theme === 'classic' ? (
              <div style={{ fontSize: '0.85rem', color: '#1f2937', lineHeight: '1.6' }}>
                {skillTags.join('  •  ')}
              </div>
            ) : (
              skillTags.map((skill, index) => (
                <span key={`${skill}-${index}`} className="skill-badge">
                  {skill}
                </span>
              ))
            )}
          </div>
        </ResumeSection>
      )}

      {isFormEmpty && (
        <div className="placeholder">
          <span>✨</span>
          <p>Fill the guided form sections on the left. Your live resume sheet compiles automatically.</p>
        </div>
      )}
    </div>
  )
}
