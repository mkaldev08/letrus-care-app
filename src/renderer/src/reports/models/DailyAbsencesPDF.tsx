import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { ICenter } from '@renderer/services/center-service'
import { getFromStorage } from '@renderer/utils/storage'
import React from 'react'
import Logo from '../../assets/logo-vector.png'
import { AbsenceResponse } from '@renderer/types/dashboard'
import { IAuth } from '@renderer/services/user'
import { format } from 'date-fns'

interface DailyAbsencesPDFProps {
  data: AbsenceResponse
  center: ICenter
  user: IAuth
}

export const DailyAbsencesPDF: React.FC<DailyAbsencesPDFProps> = ({ center, data, user }) => {
  const currentDate = new Date()
  const storedCenter = getFromStorage('center') as ICenter | null
  const imageFromDB = storedCenter?.fileData ?? ''

  const getMonthName = (date: Date): string => {
    try {
      const month = new Intl.DateTimeFormat('pt-PT', { month: 'long' }).format(date)
      return month.charAt(0).toUpperCase() + month.slice(1)
    } catch (error) {
      return String(date.getMonth() + 1)
    }
  }

  return (
    <Document>
      <Page size={'A4'} orientation="landscape" style={{ padding: '20mm 25mm' }}>
        <View style={styles.header}>
          <Image
            src={imageFromDB ? `data:${center?.fileType};base64,${imageFromDB}` : Logo}
            style={{ width: 30, height: 30 }}
          />
          <Text style={styles.titleCenter}>{center.name}</Text>
          <Text>Secretaria Geral</Text>
          <Text style={styles.titleDocument}>Relação de Faltas Diárias</Text>
          <Text style={styles.textMin}>Data: {format(new Date(), 'dd/MM/yyyy')}</Text>
          <Text style={styles.textMin}>Total: {data.length} faltas</Text>
        </View>
        <View style={styles.section}>
          <>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.colSmall]}>#</Text>
              <Text style={[styles.cell, styles.colMedium]}>Código</Text>
              <Text style={[styles.cell, styles.colLarge]}>Nome Completo</Text>
              <Text style={[styles.cell, styles.colMedium]}>Turma</Text>
              <Text style={[styles.cell, styles.colMedium]}>Data</Text>
              <Text style={[styles.cell, styles.colSmall]}>Justificada</Text>
              <Text style={[styles.cell, styles.colLarge]}>Tópico</Text>
            </View>
            {data.map((item, index) => (
              <View key={index} style={styles.tableRow} wrap>
                <Text style={[styles.cell, styles.colSmall]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.colMedium]}>
                  {item.enrollmentId?.studentId?.studentCode}
                </Text>
                <Text style={[styles.cell, styles.colLarge]}>
                  {item.enrollmentId?.studentId?.name?.fullName}
                </Text>
                <Text style={[styles.cell, styles.colMedium]}>
                  {item.enrollmentId?.classId?.className}
                </Text>
                <Text style={[styles.cell, styles.colMedium]}>
                  {format(new Date(item.date), 'dd/MM/yyyy')}
                </Text>
                <Text style={[styles.cell, styles.colSmall]}>
                  {item.isJustified ? 'Sim' : 'Não'}
                </Text>
                <Text style={[styles.cell, styles.colLarge]}>{item.topic || 'N/A'}</Text>
              </View>
            ))}
          </>
          <View style={styles.footerArea}>
            <Text style={{ alignSelf: 'center', marginTop: 10 }}>
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
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#999',
    fontSize: 9,
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
    padding: 6,
    paddingHorizontal: 7,
    borderRightWidth: 1,
    borderColor: '#999',
    lineHeight: 1.4
  },
  colSmall: {
    width: '8%'
  },
  colMedium: {
    width: '15%'
  },
  colLarge: {
    width: '20%'
  },
  footerArea: {
    marginTop: 30,
    gap: 12,
    fontSize: 10,
    lineHeight: 1.5
  },
  signView: {
    marginTop: 40,
    alignItems: 'center',
    gap: 6,
    fontSize: 11
  },
  signBar: {
    borderBottomWidth: 1.5,
    borderColor: '#333',
    width: 220,
    marginTop: 25
  }
})
