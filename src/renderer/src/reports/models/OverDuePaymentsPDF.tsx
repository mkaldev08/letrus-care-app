import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { ICenter } from '@renderer/services/center-service'
import { getFromStorage } from '@renderer/utils/storage'
import React, { useState, useEffect } from 'react'
import Logo from '../../assets/logo-vector.png'
import { TuitionPaymentResponse } from '@renderer/types/dashboard'
import { IAuth } from '@renderer/services/user'

interface OverDuePaymentsPDFProps {
  data: TuitionPaymentResponse
  center: ICenter
  user: IAuth
}

const OverDuePaymentsPDF: React.FC<OverDuePaymentsPDFProps> = ({ center, data, user }) => {
  const [imageFromDB, setImageFromDB] = useState('')
  const currentDate = new Date()

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const storagedCenter = getFromStorage('center') as ICenter

        if (storagedCenter?.fileData) {
          setImageFromDB(storagedCenter.fileData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    loadData()
  }, [])
  return (
    <Document>
      <Page size={'A4'} orientation="portrait" style={{ padding: 10 }}>
        <View style={styles.header}>
          <Image
            src={imageFromDB ? `data:${center?.fileType};base64,${imageFromDB}` : Logo}
            style={{
              width: 30,
              height: 30
            }}
          />
          <Text style={styles.titleCenter}>{center.name}</Text>
          <Text>Secretaria Geral</Text>
          <Text style={styles.titleDocument}>Relação Nominal de Propinas em Atraso</Text>
        </View>
        <View style={styles.section}>
          <>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.colSmall]}>#</Text>
              <Text style={[styles.cell, styles.colMedium]}>Inscrição</Text>
              <Text style={[styles.cell, styles.colLarge]}>Nome Completo</Text>
              <Text style={[styles.cell, styles.colMedium]}>Turma</Text>
              <Text style={[styles.cell, styles.colSmall]}>Mês</Text>
              <Text style={[styles.cell, styles.colSmall]}>Ano</Text>
            </View>
            {data.map((item, index) => (
              <View key={index} style={styles.tableRow} wrap>
                <Text style={[styles.cell, styles.colSmall]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.colMedium]}>
                  {item.enrollmentId.studentId?.studentCode}
                </Text>
                <Text style={[styles.cell, styles.colLarge]}>
                  {item.enrollmentId.studentId?.name?.fullName}
                </Text>
                <Text style={[styles.cell, styles.colMedium]}>
                  {item.enrollmentId?.classId.className}
                </Text>
                <Text style={[styles.cell, styles.colSmall]}>{item.month}</Text>
                <Text style={[styles.cell, styles.colSmall]}>{item.year}</Text>
              </View>
            ))}
          </>
          <View style={styles.footerArea}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 10
              }}
            >
              {center.name} - {center.documentCode} aos {currentDate.getDate()} de{' '}
              {currentDate.getMonth().toLocaleString()} de {currentDate.getFullYear()}
            </Text>
            <View style={styles.signView}>
              <Text>O (a) Responsável (a)</Text>
              <Text style={styles.signBar}></Text>
              <Text>{user.username}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 11,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1
  },
  sheetWrapper: {
    marginTop: 50,
    paddingTop: 30,
    borderTopWidth: 1
  },
  header: {
    alignItems: 'center',
    gap: 3
  },
  textMin: {
    fontSize: 10,
    fontWeight: 900
  },
  titleCenter: {
    fontSize: 11,
    textTransform: 'uppercase'
  },
  titleDocument: {
    fontSize: 12,
    fontWeight: 900,
    marginVertical: 8
  },
  section: {
    marginHorizontal: 8,
    marginVertical: 12,
    padding: 8,
    gap: 2
  },
  horiSection: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  boxContent: {
    padding: 2,
    width: '100%',
    height: 'auto',
    borderWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontSize: 10
  },
  label: {
    fontWeight: 'bold'
  },
  lineSpace: {
    lineHeight: 1.15
  },
  signBar: {
    width: '35%',
    borderWidth: 1,
    marginTop: 10
  },
  signView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize',
    marginTop: 10
  },

  footerArea: {
    fontSize: 11,
    marginTop: 10
  },

  // Tabela
  tableRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 0.8,
    borderColor: '#000'
  },
  tableHeader: {
    backgroundColor: '#f0f0f0'
  },
  cell: {
    fontSize: 9,
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRightWidth: 0.8,
    borderColor: '#000',
    justifyContent: 'center'
  },
  colSmall: { flex: 0.6 },
  colMedium: { flex: 1.2 },
  colLarge: { flex: 2.2 }
})

export { OverDuePaymentsPDF }
