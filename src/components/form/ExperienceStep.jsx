import { ExperienceItem } from './ExperienceItem'

export function ExperienceStep({
  experience = [],
  addExperience,
  updateExperience,
  deleteExperience,
  openDatePicker,
  polishBulletsWithAI,
  aiActionLoading = {},
}) {
  return (
    <div className="list-items-container">
      {experience.map((exp, index) => (
        <ExperienceItem
          key={exp.id || index}
          exp={exp}
          index={index}
          updateExperience={updateExperience}
          deleteExperience={deleteExperience}
          openDatePicker={openDatePicker}
          polishBulletsWithAI={polishBulletsWithAI}
          isPolishing={!!aiActionLoading[index]}
        />
      ))}
      <button type="button" className="add-btn" onClick={addExperience}>
        ➕ Add Work Experience
      </button>
    </div>
  )
}
