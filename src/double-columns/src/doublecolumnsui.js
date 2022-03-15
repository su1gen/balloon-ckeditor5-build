import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { Plugin } from 'ckeditor5/src/core';

import doubleColumnsIcon from '../theme/icons/double-column-icon.svg';

export default class DoubleColumnsUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'doubleColumns', locale => {
			const command = editor.commands.get( 'insertDoubleColumns' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: t( 'Double columns' ),
				icon: doubleColumnsIcon,
				tooltip: true
			} );

			// Bind the state of the button to the command.
			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute the command when the button is clicked (executed).
			this.listenTo( buttonView, 'execute', () => {
				editor.execute( 'insertDoubleColumns' )
			} );

			return buttonView;
		} );
	}
}
