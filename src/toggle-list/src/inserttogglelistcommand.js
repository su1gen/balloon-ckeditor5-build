import Command from '@ckeditor/ckeditor5-core/src/command'

export default class InsertToggleListCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            this.editor.model.insertContent( createToggleList( writer ) );
		} );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'toggleList' );

        this.isEnabled = allowedIn !== null;
    }
}

function createToggleList( writer ) {
    const toggleList = writer.createElement( 'toggleList' );
    const toggleBtn = writer.createElement( 'toggleBtn' );
    const toggleTriggerBlock = writer.createElement( 'toggleTriggerBlock', { listStatus: 'default' } );
    const toggleListWrapper = writer.createElement( 'toggleListWrapper' );
    const toggleListTop = writer.createElement( 'toggleListTop' );
    const toggleListTitle = writer.createElement( 'toggleListTitle' );

    writer.append(toggleTriggerBlock, toggleList)
    writer.append(toggleBtn, toggleListTop)
    writer.append(toggleListTitle, toggleListTop)
    writer.append(toggleListTop, toggleList)


    writer.appendElement( 'paragraph', toggleListWrapper );
    writer.append(toggleListWrapper, toggleList)




    return toggleList;
}

