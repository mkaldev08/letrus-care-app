import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { ICenter } from '@renderer/services/center-service'
import { getFromStorage } from '@renderer/utils/storage'
import React from 'react'
import Logo from '../../assets/logo-vector.png'
import { TuitionPaymentResponse } from '@renderer/types/dashboard'
import { IAuth } from '@renderer/services/user'

interface OverDuePaymentsPDFProps {
  data: TuitionPaymentResponse
  center: ICenter
  user: IAuth
}

const OverDuePaymentsPDF: React.FC<OverDuePaymentsPDFProps> = ({ center, data, user }) => {
  const currentDate = new Date()
  const storedCenter = getFromStorage('center') as ICenter | null
  const imageFromDB = storedCenter?.fileData ?? ''
  const dynamicFineFee = 1000

  const getMonthName = (date: Date): string => {
    try {
      const month = new Intl.DateTimeFormat('pt-PT', { month: 'long' }).format(date)
      // Capitalize first letter
      return month.charAt(0).toUpperCase() + month.slice(1)
    } catch (error) {
      return String(date.getMonth() + 1)
    }
  }

  return (
    <Document>
      <Page size={'A4'} orientation="portrait" style={{ padding: '25mm 30mm' }}>
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
            <Text style={styles.noticeText}>
              O pagamento é pré-pago e é feito de 01 a 10. De 11 em diante adiciona uma multa de{' '}
              {dynamicFineFee.toLocaleString('pt')} kz.
            </Text>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 10
              }}
            >
              {center.name} - {center.documentCode} aos {currentDate.getDate()} de{' '}
              {getMonthName(currentDate)} de {currentDate.getFullYear()}
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
    gap: 6,
    marginBottom: 15
  },
  textMin: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0.3
  },
  titleCenter: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 0.5,
    lineHeight: 1.5
  },
  titleDocument: {
    fontSize: 14,
    fontWeight: 700,
    marginVertical: 10,
    letterSpacing: 0.4,
    lineHeight: 1.6
  },
  section: {
    marginHorizontal: 25,
    marginVertical: 15,
    padding: 10
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
    borderBottomWidth: 1.5,
    borderColor: '#333',
    width: 220,
    marginTop: 25
  },
  signView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize',
    marginTop: 40,
    gap: 6,
    fontSize: 11
  },

  footerArea: {
    fontSize: 10,
    marginTop: 30,
    lineHeight: 1.5
  },
  noticeText: {
    fontSize: 9,
    textAlign: 'center'
  },

  // Tabela
  tableRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderColor: '#666',
    minHeight: 28
  },
  tableHeader: {
    backgroundColor: '#e8e8e8',
    fontWeight: 700,
    borderBottomWidth: 2,
    borderColor: '#333',
    letterSpacing: 0.3
  },
  cell: {
    fontSize: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderColor: '#666',
    justifyContent: 'center',
    lineHeight: 1.4
  },
  colSmall: { flex: 0.6 },
  colMedium: { flex: 1.2 },
  colLarge: { flex: 2.2 }
})

export { OverDuePaymentsPDF }
