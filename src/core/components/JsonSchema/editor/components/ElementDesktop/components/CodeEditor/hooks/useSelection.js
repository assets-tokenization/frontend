import React from 'react';

const regex = /"(.+)": +"(.+)"/;
const functionRegex = /\((.+)?\)|.+=>.+/;

const useSelection = (aceRef) => {
    const [row, setRow] = React.useState();
    const [column, setColumn] = React.useState();
    const [functionBody, setFunctionBody] = React.useState();
    const [functionName, setFunctionName] = React.useState();
    const [cursorPosition, setCursorPosition] = React.useState();
    const [editorScrollTop, setEditorScrollTop] = React.useState();

    React.useEffect(() => {
        if (!aceRef?.editor) {
            return;
        }

        if (editorScrollTop) {
            aceRef.editor.renderer.scrollTop = editorScrollTop;
            setEditorScrollTop();
        }

        aceRef.editor.getSession().on('changeScrollTop', () => setCursorPosition());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aceRef]);

    React.useEffect(() => {
        if (!column || !row || !aceRef?.editor) {
            return;
        }

        const line = aceRef.editor.getSession().getDocument().getLine(row);

        try {
            if (!regex.test(line)) {
                throw new Error();
            }

            const [, funcName, func] = line.match(regex);

            if (!functionRegex.test(func)) {
                throw new Error();
            }
            
            const { scrollTop } = aceRef.editor.renderer;
            const { top, left } = aceRef.editor.renderer.$cursorLayer.getPixelPosition({ row, column });

            setCursorPosition({ top: top - scrollTop, left });

            setFunctionBody(func);
            setFunctionName(funcName);
        } catch (e) {
            setFunctionBody();
            setFunctionName();
        }
    }, [column, row, aceRef]);

    const saveEditorScrollTop = React.useCallback(() => {
        setEditorScrollTop(aceRef.editor?.renderer.scrollTop);
    }, [aceRef]);

    const onFunctionChange = React.useCallback(({
        functionRow,
        functionName,
        functionBody: changedFunctionBody
    }) => {
        try {
            const lines = aceRef.editor.getSession().getDocument().getAllLines();

            const [, funcName, func] = lines[functionRow].match(regex);

            if (!functionRegex.test(func) || funcName !== functionName) {
                throw new Error();
            }

            lines[functionRow] = lines[functionRow].replace(func, changedFunctionBody.replace(/"/g, '\\"'));
            aceRef.editor.session.setValue(lines.join('\n'));
        } catch (e) {
            console.log(e);
        }
    }, [aceRef]);

    return {
        functionName,
        cursorPosition,
        functionRow: row,
        onFunctionChange,
        saveEditorScrollTop,
        functionBody: functionBody && functionBody.replace(/\\"/g, '"'),
        setSelection: selection => setTimeout(() => {
            const { anchor: { column: c, row: r } } = selection;
            setColumn(c);
            setRow(r);
        }, 50)
    };
};

export default useSelection;
