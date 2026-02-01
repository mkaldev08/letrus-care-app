import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import Logo from '../../assets/logo-vector.png'
import { getFromStorage } from '../../utils/storage'
import { ICenter } from '@renderer/services/center-service'
import { formatDateWithTimeNoWeekDay, formateCurrency } from '@renderer/utils/format'
import { IPaymentForShow, IPaymentReceipt } from '@renderer/services/payment-service'
import { TablePaymentDetails } from '../components/TablePaymentDetails'
import { TablePaymentMode } from '../components/TablePaymentMode'
import { createFormalName } from '@renderer/utils'

interface PaymentPDFProps {
  selectedPayment: {
    payment: IPaymentForShow
    receipt: IPaymentReceipt
  }
  center: ICenter
  schoolYear: string
}

export const PaymentPDF: React.FC<PaymentPDFProps> = ({ selectedPayment, center, schoolYear }) => {
  const [imageFromDB, setImageFromDB] = useState('')

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const storedCenter = getFromStorage('center') as ICenter

        if (storedCenter?.fileData) {
          setImageFromDB(storedCenter.fileData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    loadData()
  }, [])

  const ReceiptContent = (): React.ReactElement => {
    return (
      <React.Fragment>
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
          <Text style={styles.titleDocument}>Recibo de Pagamento - Ano Lectivo {schoolYear}</Text>
        </View>
        <View style={styles.section}>
          <View style={[styles.horiSection, styles.textMin]}>
            <Text>Recibo Nº: {selectedPayment?.receipt.receiptNumber}</Text>
            <Text>
              Data de Pagamento:{' '}
              {formatDateWithTimeNoWeekDay(selectedPayment?.payment?.paymentDate as Date)}
            </Text>
          </View>
          <View style={styles.boxContent}>
            <View>
              <Text style={styles.lineSpace}>
                <Text style={styles.label}>Nome: </Text>
                {createFormalName(selectedPayment.payment.enrollmentId?.studentId?.name?.fullName)}
              </Text>
              <Text style={styles.lineSpace}>
                <Text style={styles.label}>
                  Código: {selectedPayment.payment.enrollmentId?.studentId?.studentCode}
                </Text>
              </Text>
              <Text style={styles.lineSpace}>
                <Text style={styles.label}>Telefone: </Text>{' '}
                {selectedPayment.payment.enrollmentId?.studentId?.phoneNumber}
              </Text>
              <Text style={styles.lineSpace}>
                <Text style={styles.label}>Curso: </Text>{' '}
                {selectedPayment.payment.enrollmentId?.classId?.course?.name}
              </Text>
            </View>
            <View>
              <Text style={styles.lineSpace}>
                <Text style={styles.label}>Turma: </Text>{' '}
                {selectedPayment.payment.enrollmentId?.classId?.className}
              </Text>
              <Text style={styles.lineSpace}>
                <Text style={styles.label}>Nível: </Text>{' '}
                {selectedPayment.payment.enrollmentId?.classId?.grade?.grade}
              </Text>
              <Text style={styles.lineSpace}>
                <Text style={styles.label}>Total Pago: </Text>{' '}
                {formateCurrency(selectedPayment.payment.amount)}
              </Text>
            </View>
          </View>
          <View style={{ marginVertical: 2, fontSize: 10 }}>
            <Text>Detalhes de Pagamento Descritos Abaixo: </Text>
          </View>
          <TablePaymentDetails
            rows={[
              {
                year: schoolYear,
                service: 'Propina',
                description: selectedPayment.payment.paymentMonthReference,
                amount: selectedPayment.payment.amount - selectedPayment.payment.lateFee,
                status: selectedPayment.payment.status as string
              },
              {
                year: schoolYear,
                service: 'Multa',
                description: selectedPayment.payment.paymentMonthReference,
                amount: selectedPayment.payment.lateFee,
                status: selectedPayment.payment.status as string
              }
            ]}
          />
          <View style={{ marginVertical: 2 }} />
          <TablePaymentMode
            rows={[
              {
                year: schoolYear,
                paymentDate: new Date(selectedPayment.payment.paymentDate as Date),
                paymentMode: selectedPayment.payment.paymentMethod as string,
                amount: selectedPayment.payment.amount - selectedPayment.payment.lateFee,
                status: selectedPayment.payment.status as string
              },
              {
                year: schoolYear,
                paymentDate: new Date(selectedPayment.payment.paymentDate as Date),
                paymentMode: selectedPayment.payment.paymentMethod as string,
                amount: selectedPayment.payment.lateFee,
                status: selectedPayment.payment.status as string
              }
            ]}
          />
          <View style={[styles.horiSection, { marginTop: 8 }]}>
            <View style={styles.signView}>
              <Text>O (a) Encarregado (a)</Text>
              <Text style={styles.signBar}></Text>
              <Text>
                {createFormalName(selectedPayment.payment.enrollmentId?.studentId?.parents?.mother)}
              </Text>
            </View>
            <View style={styles.signView}>
              <Text>O (a) Responsável (a)</Text>
              <Text style={styles.signBar}></Text>
              <Text>{selectedPayment.payment.userId?.username}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer} fixed>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Este recibo é válido como comprovativo de pagamento
            </Text>
            <Text style={styles.footerSeparator}>•</Text>
            <Text style={styles.footerText}>
              Gerado em {formatDateWithTimeNoWeekDay(new Date())}
            </Text>
          </View>
          <View style={styles.footerContact}>
            <Text style={styles.footerContactText}>Mais informações contacte:</Text>
            {center?.phoneNumber && (
              <Text style={styles.footerContactText}>Tel: {center.phoneNumber}</Text>
            )}
            {center?.email && <Text style={styles.footerContactText}>Email: {center.email}</Text>}
          </View>
          <Text style={styles.footerBrand}>Letrus Care v1.0.0</Text>
        </View>
      </React.Fragment>
    )
  }

  return (
    <Document>
      <Page size={'A4'} style={styles.page} orientation="portrait">
        <ReceiptContent />
        <View style={styles.sheetWrapper} />
        <ReceiptContent />
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1
  },
  sheetWrapper: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopStyle: 'dashed'
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
    margin: 8,
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
    width: '100%',
    borderWidth: 1,
    marginTop: 8
  },
  signView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize'
  },
  footer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    flexDirection: 'column',
    gap: 3,
    alignItems: 'center'
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center'
  },
  footerText: {
    fontSize: 7,
    color: '#888',
    textAlign: 'center'
  },
  footerSeparator: {
    fontSize: 6,
    color: '#ccc'
  },
  footerContact: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    marginTop: 3
  },
  footerContactText: {
    fontSize: 6.5,
    color: '#999',
    textAlign: 'center'
  },
  footerBrand: {
    fontSize: 7,
    color: '#999',
    marginTop: 2
  }
})
