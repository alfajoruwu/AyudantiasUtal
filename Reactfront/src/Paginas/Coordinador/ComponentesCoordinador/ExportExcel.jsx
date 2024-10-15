import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

const exportToExcel = (data, fileName, sheetName) => {
  // Crear una hoja de trabajo de Excel
  const ws = XLSX.utils.json_to_sheet(data)

  // Crear un libro de Excel
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  // Generar un archivo binario
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

  // Función para descargar el archivo
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  }

  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName)
}

export default exportToExcel
