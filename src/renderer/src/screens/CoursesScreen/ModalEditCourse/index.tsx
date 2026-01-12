import { yupResolver } from '@hookform/resolvers/yup'
import { editCourse, ICourse } from '@renderer/services/course-service'
import { useForm } from 'react-hook-form'
import { Rings } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as yup from 'yup'
const schema = yup
  .object({
    name: yup.string().required('Preencha o nome do curso'),
    description: yup.string().required('Preencha a descrição do curso'),
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    fee: yup.number().required('Preencha a propina'),
    feeFine: yup.number().required('Preencha a multa'),
    enrollmentFee: yup.number(),
    confirmationEnrollmentFee: yup.number().required('Preencha a taxa de confirmação de inscrição'),
    courseType: yup.string().oneOf(['on_home', 'on_center'])
  })
  .required()
type FormData = yup.InferType<typeof schema>

interface ModalEditCourseProps {
  data: ICourse | null
  onClose: () => void
}
export const ModalEditCourse: React.FC<ModalEditCourseProps> = ({
  data: courseInfo,
  onClose
}: ModalEditCourseProps) => {
  const MySwal = withReactContent(Swal)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await editCourse(courseInfo?._id as string, data)
      onClose()
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Novas Informações de Curso Salvas',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2', // Define a largura e o padding do card
          title: 'text-sm', // Tamanho do texto do título
          icon: 'text-xs' // Reduz o tamanho do ícone
        },
        timerProgressBar: true // Ativa a barra de progresso
      })
    } catch (error) {
      MySwal.fire({
        title: 'Erro interno',
        text: 'Erro ao Salvar.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
      <label className="text-gray-200" htmlFor="name">
        Nome do Curso
      </label>
      <input
        {...register('name')}
        placeholder="Nome do curso"
        defaultValue={courseInfo?.name}
        id="name"
        type="text"
        className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
      />
      <span className="text-red-500">{errors.name?.message}</span>

      <label className="text-gray-200" htmlFor="description">
        Descrição
      </label>
      <input
        {...register('description')}
        placeholder="Descrição"
        defaultValue={courseInfo?.description}
        id="description"
        type="text"
        maxLength={120}
        className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
      />
      <span className="text-red-500">{errors.description?.message}</span>
      <label className="text-gray-200" htmlFor="startDate">
        Data de Início
      </label>
      <input
        {...register('startDate')}
        id="startDate"
        defaultValue={
          courseInfo?.startDate ? new Date(courseInfo?.startDate).toISOString().split('T')[0] : ''
        }
        type="date"
        required
        className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-gray-200" htmlFor="fee">
            Propina Mensal (Kz)
          </label>
          <input
            {...register('fee')}
            placeholder="Propina"
            defaultValue={courseInfo?.fee}
            id="fee"
            type="number"
            min={0}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-200" htmlFor="enrollmentFee">
            Taxa de Inscrição (Kz)
          </label>
          <input
            {...register('enrollmentFee')}
            defaultValue={courseInfo?.enrollmentFee}
            placeholder="Taxa de Inscrição"
            id="enrollmentFee"
            type="number"
            min={0}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          />
        </div>
      </div>
      <span className="text-red-500">{errors.fee?.message}</span>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-gray-200" htmlFor="confirmationEnrollmentFee">
            Taxa de Confirmação de Inscrição (Kz)
          </label>
          <input
            {...register('confirmationEnrollmentFee')}
            defaultValue={courseInfo?.confirmationEnrollmentFee}
            placeholder="Taxa de Confirmação de Inscrição"
            id="confirmationEnrollmentFee"
            type="number"
            min={0}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-200" htmlFor="feeFine">
            Multa por atraso (Kz)
          </label>
          <input
            {...register('feeFine')}
            defaultValue={courseInfo?.feeFine}
            placeholder="Multa"
            id="feeFine"
            type="number"
            min={0}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          />
        </div>
      </div>
      <span className="text-red-500">{errors.feeFine?.message}</span>

      <button
        type="submit"
        className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md"
      >
        {isSubmitting ? (
          <Rings
            height="32"
            width="32"
            color="#fff"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <span>Salvar</span>
        )}
      </button>
    </form>
  )
}
