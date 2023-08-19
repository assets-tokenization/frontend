import React from 'react';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import withStyles from '@mui/styles/withStyles';

import waiter from 'helpers/waitForAction';

ClassicEditor.defaultConfig = {
    // // plugins: [Alignment],
    // alignment: {
    //     options: ['left', 'right']
    // },
    toolbar: {
        items: ["heading", 'alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify', "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "indent", "outdent", "|", /* "imageUpload", */"blockQuote", "insertTable",/* "mediaEmbed",*/ "undo", "redo"]
    }
};

const styles = {
    root: {
        height: '100%',
        '& .ck-editor': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        },
        '& .ck-editor__main': {
            flex: 1,
            overflow: 'hidden'
        },
        '& .ck-content': {
            height: '100%'
        }
    }
};

const RichTextEditor = ({ classes, value, onChange }) => (
    <div className={classes.root}>
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => waiter.addAction('CKEditor', () => onChange(editor.getData()), 100)}
            height="100%"
            onError={(error, editor) => {
                console.log('error initialize editor', error, editor);
            }}
        />
    </div>
);

export default withStyles(styles)(RichTextEditor);
