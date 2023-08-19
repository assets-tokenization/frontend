/* eslint-disable no-case-declarations */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as XLSX from 'xlsx';
import objectPath from 'object-path';

function getRow(ws, sheet, index) {
    const result = {};
    for (const cell in sheet.columns) {
        const val = ws[sheet.columns[cell].column + index];

        if (!val) continue;

        switch (sheet.columns[cell].type) {
            case 'number':
                // result[sheet.columns[cell].objPath] = +val.v;
                objectPath.set(result, sheet.columns[cell].objPath, +val.v);
                break;
            case 'date':
                const dateTmp = XLSX.SSF.parse_date_code(val.v);
                if (!dateTmp.y || !dateTmp.m || !dateTmp.d) {
                    // result[sheet.columns[cell].objPath] = val.v;
                    objectPath.set(result, sheet.columns[cell].objPath, val.v);
                    break;
                }

                // result[sheet.columns[cell].objPath] = new Date(dateTmp.y, dateTmp.m - 1, dateTmp.d);
                objectPath.set(result, sheet.columns[cell].objPath, new Date(dateTmp.y, dateTmp.m - 1, dateTmp.d).toLocaleDateString('uk-UK'));
                break;
            default:
                // result[sheet.columns[cell].objPath] = val.v;
                objectPath.set(result, sheet.columns[cell].objPath, val.v);
                break;
        }
    }

    return result;
}

const readXlS = (f, fileJson = {}) => new Promise((resolve, reject) => {
    const result = {
        name: fileJson.name,
        descr: fileJson.descr,
        sheets: []
    };

    const reader = new FileReader();
    reader.onload = (evt) => {
        const bstr = evt.target.result;
        let wb;

        try {
            wb = XLSX.read(bstr, { type: 'binary' });
        } catch (err) {
            return reject(err);
        }

        for (const sheet in fileJson.sheets) {
            const ws = wb.Sheets[fileJson.sheets[sheet].name];

            if (!ws) {
                continue;
            }

            const rows = +ws['!ref'].split(':')[1].match(/\d+/)[0];
            const shRes = [];

            for (let row = fileJson.sheets[sheet].startRow; row <= rows; row++) {
                const rowData = getRow(ws, fileJson.sheets[sheet], row);
                shRes.push(rowData);
            }

            // result.sheets[fileJson.sheets[sheet].objPath] = shRes;

            objectPath.set(result, fileJson.sheets[sheet].objPath, shRes);
        }

        // if (Object.keys(result.sheets).length === 0) {
        //     return reject(new Error('No data'));
        // }
        resolve(result);
    };

    reader.readAsBinaryString(f);
});

export default readXlS;
