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
        <Text style={styles.tableCellHeaderStyle}>Serviço</Text>
      </View>

      <View style={styles.tableColHeaderStyle}>
        <Text style={styles.tableCellHeaderStyle}>Descrição</Text>
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
  // const STATUS = ['Pago', 'Pendente', 'Atrasado']
  return (
    <View style={styles.tableRowStyle}>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{row.year}</Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{row.service}</Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{row.description}</Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{formateCurrency(row?.amount)} </Text>
      </View>
      <View style={styles.firstTableColStyle}>
        <Text style={styles.tableCellStyle}>{row.status}</Text>
      </View>
    </View>
  )
}

interface RowsProps {
  year: string
  service: string
  description: string
  amount: number
  status: string
}
export const TableEnrollmentDetails: React.FC<{ rows: RowsProps[] }> = ({ rows }) => {
  return (
    <>
      <View style={styles.tableStyle}>
        <TableHeader />
        {rows.map((row, index) => (
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
