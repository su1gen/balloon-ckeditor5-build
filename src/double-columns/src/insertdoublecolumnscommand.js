import Command from '@ckeditor/ckeditor5-core/src/command'


export default class InsertDoubleColumnsCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            this.editor.model.insertContent( createDoubleColumns( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'doubleColumns' );

        this.isEnabled = allowedIn !== null;
    }
}

function createDoubleColumns( writer ) {
    const doubleColumns = writer.createElement( 'doubleColumns');
    const doubleColumnsBlock1 = writer.createElement( 'doubleColumnsBlock' );
    const doubleColumnsBlock2 = writer.createElement( 'doubleColumnsBlock' );

    writer.appendElement( 'paragraph', doubleColumnsBlock1 );
    writer.appendElement( 'paragraph', doubleColumnsBlock2 );

    writer.append( doubleColumnsBlock1, doubleColumns );
    writer.append( doubleColumnsBlock2, doubleColumns );

    return doubleColumns;
}

