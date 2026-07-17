import { ProjectItem } from './ProjectItem'

export function ProjectsStep({
  projects = [],
  addProject,
  updateProject,
  deleteProject,
  openDatePicker,
  polishBulletsWithAI,
  aiActionLoading = {},
}) {
  return (
    <div className="list-items-container">
      {projects.map((proj, index) => (
        <ProjectItem
          key={proj.id || index}
          proj={proj}
          index={index}
          updateProject={updateProject}
          deleteProject={deleteProject}
          openDatePicker={openDatePicker}
          polishBulletsWithAI={polishBulletsWithAI}
          isPolishing={!!aiActionLoading[index]}
        />
      ))}
      <button type="button" className="add-btn" onClick={addProject}>
        ➕ Add Project
      </button>
    </div>
  )
}
