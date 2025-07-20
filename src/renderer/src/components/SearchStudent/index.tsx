import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight, BookUser, GraduationCap, ShieldCheck } from 'lucide-react'

import { useCenter } from '@renderer/contexts/center-context'
import { IStudent, searchStudentService } from '@renderer/services/student'

export const schemaStudentSearch = yup
  .object({
    studentSearch: yup.string().required('Preencha o campo para pesquisar um aluno')
  })
  .required()

export type FormSearchData = yup.InferType<typeof schemaStudentSearch>

interface SearchStudentProps {
  /**
   * Função de callback para quando um aluno é selecionado.
   * Recebe o aluno selecionado (IStudent) ou null se a seleção for limpa.
   */
  onStudentSelect: (student: IStudent | null) => void

  initialStudent?: IStudent | null
  resetSearchTrigger?: boolean
}

export const SearchStudent: React.FC<SearchStudentProps> = ({
  onStudentSelect,
  initialStudent = null,
  resetSearchTrigger = false
}) => {
  const [resultList, setResultList] = useState<IStudent[] | null>(null)

  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    watch: watchSearch,
    formState: { errors: errorsSearch },
    setValue,
    reset
  } = useForm<FormSearchData>({
    resolver: yupResolver(schemaStudentSearch),
    defaultValues: {
      studentSearch: initialStudent ? initialStudent.name.fullName : ''
    }
  })

  const studentSearch = watchSearch('studentSearch')
  const { center } = useCenter()

  const [hasSelectedInternally, setHasSelectedInternally] = useState(false)

  const fetchResults = async (query: string): Promise<void> => {
    if (query) {
      try {
        const response = await searchStudentService(center?._id as string, query)
        setResultList(response)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        setResultList(null)
      }
    } else {
      setResultList(null)
    }
  }

  useEffect(() => {
    if (!hasSelectedInternally && studentSearch.length > 2) {
      // Só busca se não houver seleção interna e query tiver pelo menos 3 caracteres
      const delayDebounceFn = setTimeout(() => {
        fetchResults(studentSearch)
      }, 500)

      return (): void => clearTimeout(delayDebounceFn)
    } else if (studentSearch.length <= 2) {
      setResultList(null)
    }

    return
  }, [studentSearch, hasSelectedInternally])

  // Efeito para lidar com o initialStudent e resetSearchTrigger
  useEffect(() => {
    if (initialStudent) {
      onStudentSelect(initialStudent)
      setHasSelectedInternally(true)
      setValue('studentSearch', initialStudent.name.fullName)
    } else {
      if (resetSearchTrigger) {
        setHasSelectedInternally(false)
        setResultList(null)
        reset({ studentSearch: '' })
        onStudentSelect(null)
      }
    }
  }, [initialStudent, resetSearchTrigger, onStudentSelect, setValue, reset])

  const onSubmit = async (data: FormSearchData): Promise<void> => {
    await fetchResults(data.studentSearch)
  }

  const handleStudentSelection = (student: IStudent): void => {
    onStudentSelect(student)
    setHasSelectedInternally(true)
    setValue('studentSearch', student.name.fullName)
    setResultList(null)
  }

  // if (hasSelectedInternally && initialStudent) {
  //   // Se um aluno já está selecionado/inicial, pode exibir uma visualização.
  //   return (
  //     <div className="flex flex-col items-center max-w-3xl w-full px-6 text-center space-y-4">
  //       <div className="bg-zinc-800 flex items-center justify-between gap-2 min-w-min h-12 rounded-md px-4 w-full">
  //         <p className="flex items-center gap-1">
  //           <GraduationCap /> Aluno Selecionado:{' '}
  //           <span className="text-orange-600 font-bold">{initialStudent.name.fullName}</span>
  //         </p>
  //         <button
  //           onClick={() => {
  //             setHasSelectedInternally(false)
  //             setResultList(null)
  //             reset({ studentSearch: '' })
  //             onStudentSelect(null)
  //           }}
  //           className="bg-red-600 text-white rounded-md px-3 py-1 hover:bg-red-700 transition-all"
  //         >
  //           Trocar
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <section className="flex items-center justify-center pt-10">
      <div className="flex flex-col items-center max-w-3xl w-full px-6 text-center space-y-4">
        <form
          onSubmit={handleSubmitSearch(onSubmit)}
          className="h-16 bg-zinc-900 px-4 rounded-lg flex items-center justify-between shadow-shape gap-3 w-full"
        >
          <div className="flex items-center gap-2 flex-1">
            <BookUser className="size-8 text-zinc-400" />
            <input
              type="text"
              {...registerSearch('studentSearch')}
              autoFocus={true}
              placeholder="Nome ou código do Aluno"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none rounded-md shadow-shape flex-1"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-600 text-orange-100 rounded-lg py-2 px-5 font-medium flex items-center gap-2 hover:bg-orange-700 transition-all"
          >
            Pesquisar
            <ArrowRight className="size-5" />
          </button>
        </form>

        {errorsSearch.studentSearch && (
          <p className="text-red-400">{errorsSearch.studentSearch.message}</p>
        )}

        {/* Lista de resultados da busca */}
        {resultList && resultList.length > 0 && !hasSelectedInternally ? (
          resultList.map((resultItem) => (
            <div
              key={resultItem._id}
              className="bg-zinc-800 flex items-center justify-between gap-2 hover:brightness-110 min-w-min h-12 rounded-md cursor-pointer px-4 transition-all w-full"
              onClick={() => {
                handleStudentSelection(resultItem)
              }}
            >
              <p className="flex items-center gap-1">
                <GraduationCap />
                <span className="text-orange-600 font-bold">{resultItem?.name?.fullName}</span>
              </p>
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck /> Selecionar
              </p>
            </div>
          ))
        ) : resultList?.length === 0 && studentSearch && !hasSelectedInternally ? (
          <div className="flex items-center gap-2">
            <p>Estudante não encontrado!</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
