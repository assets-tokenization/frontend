import React from 'react';
import HeaderCell from 'components/JsonSchema/elements/Spreadsheet/SheetHeader/HeaderCell';

const SheetHeader = ({ data, headers, headAlign, headFontSize, headerRef, schema: { showRowNumbers = true } }) => (
    <thead ref={headerRef}>
        {headers.map((header, headerKey) => (
            <tr key={headerKey}>
                {showRowNumbers && headerKey === 0 ? (
                    <HeaderCell
                        cell={{
                            label: '№',
                            rowSpan: headers.length
                        }}
                        data={data}
                        staticWidth={1}
                        headAlign={headAlign}
                        headFontSize={headFontSize}
                    />
                ) : null}
                {header.map((cell, cellKey) => (
                    <HeaderCell
                        cell={cell}
                        data={data}
                        key={cellKey}
                        cellKey={cellKey}
                        headAlign={headAlign}
                        headFontSize={headFontSize}
                    />
                ))}
            </tr>
        ))}
    </thead>
);

export default SheetHeader;
