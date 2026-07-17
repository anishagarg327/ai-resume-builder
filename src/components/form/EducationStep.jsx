import { EducationItem } from './EducationItem'

export function EducationStep({ education = [], addEducation, updateEducation, deleteEducation, openDatePicker }) {
  return (
    <div className="list-items-container">
      {education.map((edu, index) => (
        <EducationItem
          key={edu.id || index}
          edu={edu}
          index={index}
          updateEducation={updateEducation}
          deleteEducation={deleteEducation}
          openDatePicker={openDatePicker}
        />
      ))}
      <button type="button" className="add-btn" onClick={addEducation}>
        ➕ Add Education Entry
      </button>
    </div>
  )
}
