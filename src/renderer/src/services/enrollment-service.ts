import apiMananger from './api'

interface IEnrollment {
  studentId?: string
  courseId: string
  grade: string | string
  name: { fullName: string; surname?: string }
  birthDate: Date
  gender: 'masculino' | 'feminino'
  parents: { father: string; mother: string }
  address: string
  phoneNumber: string
  email?: string
  centerId: string
  userId: string
  doc_file?: File
  image_file?: File
}

export const createEnrollment = async (data: IEnrollment): Promise<void> => {
  const {
    name,
    birthDate,
    gender,
    parents,
    address,
    phoneNumber,
    email,
    centerId,
    courseId,
    grade,
    userId,
    doc_file,
    image_file
  } = data

  try {
    // Cria o estudante
    const { data: studentData } = await apiMananger.post('/students/new', {
      name,
      birthDate,
      gender,
      address,
      phoneNumber,
      email,
      parents,
      centerId,
      userId
    })

    // Usa o ID do estudante recém-criado para criar a inscrição
    await apiMananger.post(
      '/enrollments/new',
      {
        courseId,
        grade,
        centerId,
        studentId: studentData?._id,
        userId,
        doc_file,
        image_file
      },
      {
        headers: { 'Content-Type': 'multpart/form' }
      }
    )
  } catch (error) {
    console.log('Erro ao criar inscrição:', error)
    throw error
  }
}

export const getEnrollmentsService = async (centerId: string) => {
  try {
    const { data } = await apiMananger.get(`/enrollments/all/${centerId}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar inscrições: ', error)
    throw error
  }
}
