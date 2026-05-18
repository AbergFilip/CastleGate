import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGrades, createGrade, deleteGrade } from '../lib/documents'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

const educationLevels = [
  { name: 'Grundskola', value: 'Grundskola' },
  { name: 'Gymnasium', value: 'Gymnasium' },
  { name: 'Högskola och universitet', value: 'Högskola och universitet' },
]

function Grades() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [grades, setGrades] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentEducationLevel, setCurrentEducationLevel] = useState<string | null>(null)
  const [formData, setFormData] = useState({ school_name: '', program: '', year: '', semester: '' })

  useEffect(() => {
    loadGrades()
  }, [])

  const loadGrades = async () => {
    try {
      setLoading(true)
      setError(null)
      const allGrades = await getGrades()
      
      // Gruppera betyg efter utbildningsnivå
      const grouped: Record<string, any[]> = {}
      educationLevels.forEach(level => {
        grouped[level.value] = []
      })

      allGrades.forEach((grade: any) => {
        if (grade.education_level && grouped[grade.education_level]) {
          grouped[grade.education_level].push(grade)
        }
      })

      setGrades(grouped)
    } catch (err) {
      console.error('Error loading grades:', err)
      setError(err instanceof Error ? err.message : 'Kunde inte ladda betyg')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/documents')
    }
  }

  const handleGradeClick = (grade: any) => {
    // Visa betygdetaljer eller öppna dokument
    if (grade.document_id) {
      // Navigera till dokument
    }
    // För nu, visa info i en alert
    const courses = grade.courses || []
    if (courses.length > 0) {
      const coursesText = courses.map((c: any) => `${c.name}: ${c.grade || 'N/A'}`).join('\n')
      showToast(`Betyg för ${grade.education_level}:\n${coursesText}`, 'info')
    }
  }

  const handleAddGrade = (educationLevel: string) => {
    setCurrentEducationLevel(educationLevel)
    setFormData({ school_name: '', program: '', year: '', semester: '' })
    setShowAddModal(true)
  }

  const handleSubmitGrade = async () => {
    if (!formData.school_name.trim() || !currentEducationLevel) return

    try {
      await createGrade({
        education_level: currentEducationLevel,
        school_name: formData.school_name,
        program: formData.program || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        semester: formData.semester || undefined,
        courses: [],
      })
      loadGrades()
      setShowAddModal(false)
      setFormData({ school_name: '', program: '', year: '', semester: '' })
    } catch (err) {
      showToast('Kunde inte skapa betyg: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  const handleDeleteGrade = async (gradeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort detta betyg?')) return

    try {
      await deleteGrade(gradeId)
      loadGrades()
    } catch (err) {
      showToast('Kunde inte ta bort betyg: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '200px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_grades" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_grades" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
            <linearGradient id="paint1_linear_grades" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_grades)" />
          <g filter="url(#filter0_d_grades)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_grades)" />
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            height: '88px',
            zIndex: 4,
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              zIndex: 5,
            }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '29px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Betyg
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '208px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar betyg...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3
              style={{
                margin: 0,
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: '#2A2A2A',
              }}
            >
              Avslutad utbildning
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {educationLevels.map((level) => {
                const levelGrades = grades[level.value] || []
                return (
                  <div key={level.value} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      onClick={() => handleAddGrade(level.value)}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                        padding: '14px 18px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        border: levelGrades.length === 0 ? '2px dashed #E3ECFF' : 'none',
                      }}
                    >
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px', color: '#2A2A2A' }}>
                        {level.name} {levelGrades.length > 0 && `(${levelGrades.length})`}
                      </span>
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    {levelGrades.map((grade) => (
                      <div
                        key={grade.id}
                        onClick={() => handleGradeClick(grade)}
                        style={{
                          width: '100%',
                          background: '#F4F6FF',
                          borderRadius: '12px',
                          boxShadow: '0px 4px 12px rgba(20, 45, 120, 0.06)',
                          padding: '12px 16px',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          marginLeft: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
                            {grade.school_name || 'Okänd skola'}
                          </span>
                          {grade.program && (
                            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: '#2A2A2A', opacity: 0.7 }}>
                              {grade.program}
                            </span>
                          )}
                          {grade.year && (
                            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: '#2A2A2A', opacity: 0.7 }}>
                              {grade.year} {grade.semester || ''}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={(e) => handleDeleteGrade(grade.id, e)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            aria-label="Ta bort"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M4 4L12 12M4 12L12 4"
                                stroke="#d32f2f"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormData({ school_name: '', program: '', year: '', semester: '' })
        }}
        title={`Lägg till betyg - ${currentEducationLevel || ''}`}
      >
        <FormField
          label="Skolans namn"
          value={formData.school_name}
          onChange={(value) => setFormData({ ...formData, school_name: value })}
          placeholder="Ange skolans namn"
          required
        />
        <FormField
          label="Program/Linje"
          value={formData.program}
          onChange={(value) => setFormData({ ...formData, program: value })}
          placeholder="Ange program eller linje (valfritt)"
        />
        <FormField
          label="År"
          value={formData.year}
          onChange={(value) => setFormData({ ...formData, year: value })}
          placeholder="Ange år (valfritt)"
          type="number"
        />
        <FormField
          label="Termin"
          value={formData.semester}
          onChange={(value) => setFormData({ ...formData, semester: value })}
          placeholder="Höst eller Vår (valfritt)"
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false)
              setFormData({ school_name: '', program: '', year: '', semester: '' })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitGrade}
            disabled={!formData.school_name.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Grades
