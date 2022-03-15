import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { Plugin } from 'ckeditor5/src/core';

import taskIcon from '../theme/icons/task-icon.svg';

export default class Taskui extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;


		editor.ui.componentFactory.add( 'task', locale => {
			const command = editor.commands.get( 'insertTask' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: t( 'Task' ),
				icon: taskIcon,
				tooltip: true
			} );

			// Bind the state of the button to the command.
			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute the command when the button is clicked (executed).
			this.listenTo( buttonView, 'execute', () => {
				editor.execute( 'insertTask' )
			} );

			return buttonView;
		} );
	}
}
