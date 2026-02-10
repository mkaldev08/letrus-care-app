import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight, BookUser, GraduationCap, ShieldCheck } from 'lucide-react'
import { useDebounce } from 'use-debounce'

import { useCenter } from '@renderer/contexts/center-context'
import { IStudent } from '@renderer/services/student'
import { useSearchStudentsQuery } from '@renderer/hooks/queries/useStudentQueries'
import { ContentLoader } from '@renderer/components/ContentLoader'

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
  const { center } = useCenter()

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
      studentSearch: initialStudent?.name.fullName ?? ''
    }
  })

  const studentSearch = watchSearch('studentSearch')
  const [debouncedSearch] = useDebounce(studentSearch, 500)

  // React Query for student search
  const { data: resultList, isLoading } = useSearchStudentsQuery(center?._id, debouncedSearch)

  // Handle initial student and reset trigger
  useEffect(() => {
    if (initialStudent) {
      setValue('studentSearch', initialStudent.name.fullName)
      onStudentSelect(initialStudent)
    } else if (resetSearchTrigger) {
      reset({ studentSearch: '' })
      onStudentSelect(null)
    }
  }, [initialStudent, resetSearchTrigger, onStudentSelect, setValue, reset])

  const handleStudentSelection = (student: IStudent): void => {
    setValue('studentSearch', student.name.fullName)
    onStudentSelect(student)
  }

  const showResults = debouncedSearch.length >= 3 && !initialStudent

  return (
    <section className="flex items-center justify-center pt-10">
      <div className="flex flex-col items-center max-w-3xl w-full px-6 text-center space-y-4">
        <form
          onSubmit={handleSubmitSearch(() => {})}
          className="h-16 bg-zinc-900 px-4 rounded-lg flex items-center justify-between shadow-shape gap-3 w-full"
        >
          <div className="flex items-center gap-2 flex-1">
            <BookUser className="size-8 text-zinc-400" />
            <input
              type="text"
              {...registerSearch('studentSearch')}
              autoFocus={true}
              placeholder="código ou Nome do Aluno (mínimo 3 caracteres)"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none rounded-md shadow-shape flex-1"
            />
          </div>
          <button
            disabled
            type="button"
            className="bg-orange-600 text-orange-100 rounded-lg py-2 px-5 font-medium flex items-center gap-2 opacity-50 cursor-not-allowed"
          >
            Pesquisar
            <ArrowRight className="size-5" />
          </button>
        </form>

        {errorsSearch.studentSearch && (
          <p className="text-red-400">{errorsSearch.studentSearch.message}</p>
        )}

        {/* Loading State */}
        {isLoading && showResults && (
          <div className="w-full py-4">
            <ContentLoader />
          </div>
        )}

        {/* Lista de resultados da busca */}
        {!isLoading && showResults && resultList && resultList.length > 0 ? (
          resultList.map((resultItem) => (
            <div
              key={resultItem._id}
              className="bg-zinc-800 flex items-center justify-between gap-2 hover:brightness-110 min-w-min h-12 rounded-md cursor-pointer px-4 transition-all w-full"
              onClick={() => handleStudentSelection(resultItem)}
            >
              <p className="flex items-center gap-2 justify-center">
                <GraduationCap />
                <span className="text-orange-600">{resultItem?.name?.fullName}</span>
              </p>
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck /> Selecionar
              </p>
            </div>
          ))
        ) : !isLoading && showResults && resultList?.length === 0 ? (
          <div className="flex items-center gap-2 text-zinc-400">
            <p>Estudante não encontrado!</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
