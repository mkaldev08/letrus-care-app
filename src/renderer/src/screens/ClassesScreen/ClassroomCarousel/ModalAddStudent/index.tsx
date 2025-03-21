import { useCenter } from '@renderer/contexts/center-context'
import { addStudentClassService, IResponseClass } from '@renderer/services/class-service'
import {
  getStudentsForClassService,
  IEnrollmentForShow
} from '@renderer/services/enrollment-service'
import { CheckCircle, PlusCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const ModalAddStudent: React.FC<{ selectedClass: IResponseClass }> = ({ selectedClass }) => {
  const [studentList, setStudentList] = useState<IEnrollmentForShow[]>()
  const { center } = useCenter()

  const fetchStudents = async (): Promise<void> => {
    try {
      console.log()
      const results = await getStudentsForClassService(center?._id as string, {
        courseId: selectedClass.course?._id as string,
        grade: selectedClass.grade?._id as string
      })
      setStudentList(results)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  const [isAdded, setIsAdded] = useState<{ [key: string]: boolean }>({})
  const handleAddStudentOnClass = async (studentId: string): Promise<void> => {
    try {
      await addStudentClassService(selectedClass?._id as string, studentId)
      setIsAdded((prev) => ({
        ...prev,
        [studentId]: true
      }))
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    studentList?.forEach((ennroll) => {
      if (selectedClass.students?.some((student) => student._id === ennroll.studentId?._id))
        setIsAdded((prev) => ({
          ...prev,
          [ennroll.studentId?._id as string]: true
        }))
    })
  }, [])

  return (
    <div>
      {studentList ? (
        <ul className="mt-2 text-zinc-200 bg-zinc-700 rounded-md p-2">
          {studentList.map((enrollment) => (
            <li
              key={enrollment.studentId?._id}
              className="flex justify-between items-center p-2 border-b border-zinc-600"
            >
              <span>{enrollment.studentId?.name?.fullName}</span>
              <div className="space-x-2">
                {!isAdded[enrollment.studentId?._id as string] ? (
                  <button
                    title="Adicionar"
                    className="px-3 py-1 rounded text-white"
                    onClick={() => handleAddStudentOnClass(enrollment.studentId?._id as string)}
                  >
                    <PlusCircle />
                  </button>
                ) : (
                  <button title="adicionado" className="px-3 py-1 rounded text-white">
                    <CheckCircle />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>Sem alunos inscritos para esse curso e nível</p>
        </div>
      )}
    </div>
  )
}
