import Command from '@ckeditor/ckeditor5-core/src/command'

export default class Inserttaskcommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            this.editor.model.insertContent( createTask( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'task' );

        this.isEnabled = allowedIn !== null;
    }
}

function createTask( writer ) {
    const task = writer.createElement( 'task' );
    const taskIdBlock = writer.createElement( 'taskIdBlock');
    const taskTriggerBlock = writer.createElement( 'taskTriggerBlock', { taskStatus: 'default' , completed: 'false'} );
    const taskTop = writer.createElement( 'taskTop' );
    const taskBtn = writer.createElement( 'taskBtn' );
    const taskName = writer.createElement( 'taskName' );
    const taskUsers = writer.createElement( 'taskUser' );
    const taskCheckbox = writer.createElement( 'taskCheckbox' );


	let today = new Date();
	let year = today.getFullYear()
	let mouth = today.getMonth() + 1
	if (mouth < 10){
		mouth = '0' + mouth
	}
	let day = today.getDate()
	if (day < 10){
		day = '0' + day
	}
	let date = `${year}-${mouth}-${day}`;


    const taskDate = writer.createElement( 'taskDate', { date: date } );
    const taskDescription = writer.createElement( 'taskDescription' );


	const taskDateInput = writer.createElement( 'taskDateInput' );

	// writer.appendElement( 'paragraph', taskIdBlock );
    writer.append( taskIdBlock, task );
    writer.append( taskTriggerBlock, task );
    writer.append( taskBtn, taskTop );
    writer.append( taskName, taskTop );
    writer.append( taskUsers, taskTop );
    writer.append( taskDate, taskTop );
    writer.append( taskCheckbox, taskTop );


    writer.append( taskDateInput, taskTop );


    writer.append( taskTop, task );
    writer.appendElement( 'paragraph', taskDescription );
    writer.append( taskDescription, task );



    // writer.append( taskDate, fixBlock );
    // writer.appendElement( 'paragraph', taskDate );





    // const taskBottom = writer.createElement( 'taskBottom' );
    //
    //

    //
    // writer.append(taskBtn, taskTop)
    // writer.append(taskName, taskTop)
    // writer.append(taskUsers, taskTop)
    // writer.append(taskDate, taskTop)
    // writer.append(taskTop, task)
    //
    // writer.append( taskBottom, task );


    return task;
}

