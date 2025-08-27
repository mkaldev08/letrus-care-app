import React, { useEffect, useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'
import { IResponseClass } from '@renderer/services/class-service'
import { useLocation } from 'react-router'
import { CheckCheck, History, NotebookPen, Printer, X } from 'lucide-react'
import { ITeacher } from '@renderer/services/teacher-service'
import { createFormalName } from '@renderer/utils'
import { Modal } from '@renderer/components/Modal'
import {
  createAttendanceServicePerStudent,
  editAttendanceServicePerStudent,
  IAttendance
} from '@renderer/services/attendance'
import { IStudent } from '@renderer/services/student'

export const ShowClassScreen: React.FC = () => {
  const [classRoom, setClassRoom] = useState<IResponseClass>({} as IResponseClass)
  const location = useLocation()

  useEffect(() => {
    setClassRoom(location.state?.class)
  }, [location.state])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [attendance, setAttendance] = useState({})

  // async function fetchClass(): Promise<void> {
  //   const classResult = await getClassService(classRoom?._id as string)
  //   setClassRoom(classResult)
  // }

  // //em caso de actualização colocar dependentes correctos
  // useEffect(() => {
  //   fetchClass()
  // }, [location.state?.class])

  const [isLessonOpened, setIsLessonOpened] = useState(false)
  const [topic, setTopic] = useState('')
  const [attendanceDate, setAttendanceDate] = useState(new Date())
  const [isAttended, setIsAttended] = useState<{ [key: string]: boolean }>({})

  const handleAttendance = async (studentId: string, status: string): Promise<void> => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
    await createAttendanceServicePerStudent({
      classId: classRoom?._id as string,
      student: studentId,
      status,
      date: attendanceDate,
      topic
    })

    setIsAttended((prev) => ({
      ...prev,
      [studentId]: true
    }))
  }

  function showTeachers(teachers: ITeacher[]): string {
    if (!teachers || teachers.length === 0) {
      return ''
    }

    let names = createFormalName(teachers[0].fullName)

    if (teachers.length > 1 && teachers.length < 3) {
      names += ' e ' + createFormalName(teachers[teachers.length - 1].fullName)
    } else if (teachers.length > 2) {
      for (let i = 1; i < teachers.length - 1; i++) {
        names += ', ' + createFormalName(teachers[i].fullName)
      }

      names += ' e ' + createFormalName(teachers[teachers.length - 1].fullName)
    }

    return names
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalNoteOpen, setIsModalNoteOpen] = useState(false)
  const [studentSelectedOnNote, setStudentSelectedOnNote] = useState<IStudent>({} as IStudent)
  const [note, setNote] = useState('')
  const [isJustified, setIsJustified] = useState<{ [key: string]: boolean }>({})

  const openModal = (): void => setIsModalOpen(true)

  const closeModal = (): void => setIsModalOpen(false)

  const openModalNote = (student: IStudent): void => {
    setIsModalNoteOpen(true)
    setStudentSelectedOnNote(student)
  }
  const closeModalNote = (): void => setIsModalNoteOpen(false)

  const handleSaveTopic = (): void => {
    setIsLessonOpened(true)
    closeModal()
  }

  const handleAddNote = async (): Promise<void> => {
    await editAttendanceServicePerStudent(
      studentSelectedOnNote?._id as string,
      {
        note,
        isJustified: isJustified[studentSelectedOnNote?._id as string]
      } as IAttendance
    )
    closeModalNote()
  }

  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden pt-4">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            {classRoom ? (
              <>
                <div className="flex justify-between items-center w-full mx-auto bg-zinc-800 p-6 rounded-lg shadow-md">
                  <div>
                    <h2 className="text-3xl text-zinc-400">{classRoom.className}</h2>
                    <article className="text-zinc-300 mt-3">
                      <p>Professores: {showTeachers(classRoom?.teachers)}</p>
                      <p>Nível: {classRoom.grade?.grade}</p>
                      <p>Curso: {classRoom.course?.name}</p>
                    </article>
                  </div>
                  <div>
                    <button
                      className={` ${isLessonOpened ? 'bg-zinc-300' : 'bg-orange-700'} text-white px-4 py-2 rounded hover:brightness-110 transition-all`}
                      onClick={openModal}
                      disabled={isLessonOpened}
                    >
                      Nova Aula
                    </button>
                  </div>
                </div>
                <div>
                  <h3
                    className={`${isLessonOpened ? 'text-zinc-200' : 'text-zinc-700'} mt-4 text-xl font-semibold transition-all`}
                  >
                    Lista de Presença
                  </h3>
                  <div className="max-h-[70%] overflow-auto">
                    <ul
                      className={`mt-2 ${isLessonOpened ? 'text-zinc-200' : 'text-zinc-700'} transition-all`}
                    >
                      {classRoom.students?.map((student, index) => (
                        <li
                          key={student?._id as string}
                          className="flex justify-between items-center p-2 border-b border-zinc-700"
                        >
                          <span>
                            {index + 1}. {student?.name?.fullName}
                          </span>
                          <div className="space-x-2">
                            <button
                              disabled={!isLessonOpened || isAttended[student?._id as string]}
                              title="Presente"
                              className={`px-3 py-1 rounded hover:opacity-80 transition-all ${
                                attendance[student?._id as string] === 'present'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-zinc-700'
                              }`}
                              onClick={() => handleAttendance(student?._id as string, 'present')}
                            >
                              <CheckCheck />
                            </button>
                            <button
                              disabled={!isLessonOpened || isAttended[student?._id as string]}
                              title="Ausente"
                              className={`px-3 py-1 rounded hover:opacity-80 transition-all ${
                                attendance[student?._id as string] === 'absent'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-zinc-700'
                              }`}
                              onClick={() => handleAttendance(student?._id as string, 'absent')}
                            >
                              <X />
                            </button>
                            <button
                              disabled={!isLessonOpened}
                              title="Adicionar Nota"
                              className="px-3 py-1 rounded hover:opacity-80 transition-all bg-zinc-700"
                              onClick={() => openModalNote(student)}
                            >
                              <NotebookPen />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <h4 className="mt-6 text-zinc-700">
                      Total de Alunos: {classRoom.students?.length}
                    </h4>
                    <div className="flex items-center justify-between gap-6 ">
                      <button
                        className="hover:opacity-80 transition-all"
                        title="Histórico das aula"
                      >
                        <History />
                      </button>
                      <button
                        className={`hover:opacity-80 transition-all active:text-orange-600 ${!isLessonOpened && 'text-zinc-700 active:text-zinc-700'}`}
                        title="Imprimir lista de presença"
                        disabled={!isLessonOpened}
                      >
                        <Printer />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center">Carregando dados da turma...</p>
            )}
          </div>
          <Footer />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <h2 className="text-3xl">Criar Aula</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <form className="mt-6 flex flex-col gap-2">
            <label htmlFor="topic">
              Tema da Aula <span className="text-orange-700">*</span>
            </label>
            <input
              onChange={(e) => setTopic(e.target.value)}
              value={topic}
              id="topic"
              placeholder="Tema da Aula"
              type="text"
              className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
              required
            />
            <label htmlFor="attendanceDate">
              Data da Aula<span className="text-orange-700">*</span>
            </label>
            <input
              onChange={(e) => setAttendanceDate(new Date(e.target.value))}
              value={attendanceDate.toISOString().split('T')[0]}
              id="attendanceDate"
              type="date"
              className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
              required
            />
            <button
              type="button"
              className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all"
              onClick={handleSaveTopic}
            >
              Criar
            </button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isModalNoteOpen} onClose={closeModalNote}>
        <div>
          <h2 className="text-3xl">Adicionar Justificativa</h2>
          <p className="text-zinc-500 mt-1">{studentSelectedOnNote?.name?.fullName}</p>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <form className="mt-6 flex flex-col gap-2">
            <label htmlFor="note">
              Observação <span className="text-orange-700">*</span>
            </label>
            <input
              onChange={(e) => setNote(e.target.value)}
              value={note}
              id="note"
              placeholder="Observação da falta"
              type="text"
              className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
              required
            />
            <div className="flex gap-2 items-center my-4">
              <label htmlFor="isJustified">Justificada?</label>
              <input
                onChange={(e) => {
                  setIsJustified((prev) => ({
                    ...prev,
                    [studentSelectedOnNote?._id as string]: e.target.checked
                  }))
                }}
                checked={isJustified[studentSelectedOnNote?._id as string]}
                name="isJustified"
                id="isJustified"
                type="radio"
                className="text-lg p-2 bg-zinc-950"
              />
            </div>
            <button
              type="button"
              className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all"
              onClick={handleAddNote}
            >
              Adicionar
            </button>
          </form>
        </div>
      </Modal>
    </div>
  )
}
