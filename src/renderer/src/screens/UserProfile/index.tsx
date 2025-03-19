import React, { useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { HeaderMain } from '@renderer/components/HeaderMain'
import { Sidebar } from '@renderer/components/Sidebar'
import { Construction } from 'lucide-react'

// const schema = yup
//   .object({
//     name: yup.string().required('Preecha o Nome do Centro'),
//     address: yup.string().required('Preecha o endereço do centro'),
//     phoneNumber: yup.string().required('Preecha o Telefone'),
//     email: yup.string().email('Email Inválido'),
//     nif: yup.string(),
//     documentCode: yup.string()
//   })
//   .required()
// type FormData = yup.InferType<typeof schema>

export const UserProfile: React.FC = () => {
  // const { user: userAuth } = useAuth()
  // const { center } = useCenter()
  // const [user, setUser] = useState<object | null>(null)

  // useEffect(() => {
  //   setUser({ userAuth, center })
  // }, [])

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<FormData>({
  //   resolver: yupResolver(schema)
  // })

  // const onSubmit = async (data: FormData): Promise<void> => {
  //   try {
  //     Swal.fire({
  //       position: 'bottom-end',
  //       icon: 'success',
  //       title: 'Centro Editado com Sucesso!',
  //       showConfirmButton: false,
  //       timer: 2000,
  //       customClass: {
  //         popup: 'h-44 p-2', // Define a largura e o padding do card
  //         title: 'text-sm', // Tamanho do texto do título
  //         icon: 'text-xs' // Reduz o tamanho do ícone
  //       },
  //       timerProgressBar: true // Ativa a barra de progresso
  //     })
  //   } catch (error) {
  //     Swal.fire({
  //       position: 'bottom-end',
  //       icon: 'error',
  //       title: 'Verifique os dados',
  //       showConfirmButton: false,
  //       timer: 2000,
  //       customClass: {
  //         popup: 'h-44 p-2',
  //         title: 'text-sm',
  //         icon: 'text-xs'
  //       },
  //       timerProgressBar: true
  //     })
  //   }
  // }
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <HeaderMain isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-auto pt-4">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">Perfil</h2>
            <main className="flex-1">
              <p className="flex flex-col justify-center items-center w-full h-full text-3xl text-zinc-400">
                <Construction size={140} />
                Tela em Construção
              </p>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
