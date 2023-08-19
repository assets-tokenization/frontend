
import XLSX from 'xlsx';
import csvParse from 'helpers/csvParse';

export default async file => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
        try {
            let wb;
            try {
                wb = XLSX.read(e.target.result, { type: 'array', cellDates: true });
                resolve(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 }));
            } catch (error) {
                const encoder = new TextDecoder("utf-8");
                const csvData = encoder.decode(e.target.result);
                const rows = csvData.split('\n');

                if (!rows.length) {
                    return resolve(rows);
                }

                const [firstRow] = rows;
                const [delimiter] = [',', ';'].sort((a, b) => firstRow.split(b).length - firstRow.split(a).length);

                return resolve(csvParse(csvData, { delimiter }));
            }
        } catch (e) {
            reject(e);
        }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
});