import React, { ChangeEvent, useRef, useState, useEffect } from 'react'
import Logo from '@renderer/assets/logo-vector.png'

interface CenterLogoUploadProps {
  centerImage: { fileData: string; fileType: string } | null
  onUpload: (formData: FormData) => Promise<void>
  isUploading: boolean
}

export const CenterLogoUpload: React.FC<CenterLogoUploadProps> = ({
  centerImage,
  onUpload,
  isUploading
}) => {
  const [imageFromUser, setImageFromUser] = useState('')
  const [imageFromDB, setImageFromDB] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (centerImage?.fileData) {
      setImageFromDB(centerImage.fileData)
    }
  }, [centerImage])

  const handleSelectImage = (): void => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImageFromUser(imageUrl)
    }
  }

  const handleUpload = async (): Promise<void> => {
    const file = fileInputRef.current?.files?.[0]

    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('logo', file)

    await onUpload(formData)

    setImageFromDB(URL.createObjectURL(file))
    setImageFromUser('')
  }

  const displayImage =
    imageFromUser || (imageFromDB ? `data:${centerImage?.fileType};base64,${imageFromDB}` : Logo)

  return (
    <div className="flex flex-col border shadow-shape border-zinc-700 h-28 bg-transparent rounded-md">
      <img src={displayImage} alt="Logo do Centro" className="w-full h-full object-contain" />
      <input
        ref={fileInputRef}
        accept="image/*"
        type="file"
        name="logo"
        className="hidden"
        onChange={handleImageChange}
      />
      {imageFromUser ? (
        <button
          type="button"
          disabled={isUploading}
          className="flex-1 rounded-md bg-orange-700 p-[2px] m-2 hover:bg-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUpload}
        >
          {isUploading ? 'Salvando...' : 'Salvar Imagem'}
        </button>
      ) : (
        <button
          type="button"
          className="flex-1 rounded-md bg-orange-700 p-[2px] m-2 hover:bg-orange-800 transition-all"
          onClick={handleSelectImage}
        >
          Carregar Imagem
        </button>
      )}
    </div>
  )
}
