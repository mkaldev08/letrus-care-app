import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import { formateCurrency } from '@renderer/utils/format'

const TableHeader: React.FC = () => {
  return (
    <View style={styles.tableRowStyle} fixed>
      <View style={styles.firstTableColHeaderStyle}>
        <Text style={styles.tableCellHeaderStyle}>Ano Lectivo</Text>
      </View>

      <View style={styles.tableColHeaderStyle}>
        <Text style={styles.tableCellHeaderStyle}>Data de Pagamento</Text>
      </View>

      <View style={styles.tableColHeaderStyle}>
        <Text style={styles.tableCellHeaderStyle}>Forma de Pagamento</Text>
      </View>

      <View style={styles.tableColHeaderStyle}>
        <Text style={styles.tableCellHeaderStyle}>Valor (Kz)</Text>
      </View>

      <View style={styles.tableColHeaderStyle}>
        <Text style={styles.tableCellHeaderStyle}>Estado</Text>
      </View>
    </View>
  )
}
const TableRow: React.FC<{ row: RowsProps }> = ({ row }) => {
  const STATUS = ['Pago', 'Pendente', 'Atrasado']
  return (
    <View style={styles.tableRowStyle}>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{row.year}</Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>
          {row.paymentDate?.toLocaleString('pt', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          })}
        </Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{row.paymentMode}</Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{formateCurrency(row?.amount)} </Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>
          {row.status === 'paid' ? STATUS[0] : row.status === 'pending' ? STATUS[1] : STATUS[2]}
        </Text>
      </View>
    </View>
  )
}

interface RowsProps {
  year: string
  paymentDate: Date
  paymentMode: string
  amount: number
  status: string
}

export const TablePaymentMode: React.FC<{ rows: RowsProps[] }> = ({ rows }) => {
  const rowsWithFilter = rows.filter((row) => row.amount > 0)
  return (
    <>
      <View style={styles.tableStyle}>
        <TableHeader />
        {rowsWithFilter.map((row, index) => (
          <TableRow row={row} key={index} />
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  pageStyle: {
    paddingTop: 14,
    paddingHorizontal: 30,
    paddingBottom: 46
  },
  tableStyle: {
    display: 'flex',
    width: 'auto'
  },
  tableRowStyle: {
    flexDirection: 'row'
  },
  firstTableColHeaderStyle: {
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    backgroundColor: '#bdbdbd'
  },
  tableColHeaderStyle: {
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: '#bdbdbd'
  },
  firstTableColStyle: {
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderTopWidth: 0
  },
  tableColStyle: {
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeaderStyle: {
    textAlign: 'center',
    margin: 3,
    fontSize: 9,
    fontWeight: 'bold'
  },
  tableCellStyle: {
    textAlign: 'center',
    margin: 4,
    fontSize: 7
  }
})
