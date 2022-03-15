import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { Plugin } from 'ckeditor5/src/core';

import toggleListIcon from '../theme/icons/toggle-icon.svg';

export default class ToggleListUi extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;


		editor.ui.componentFactory.add( 'toggleList', locale => {
			const command = editor.commands.get( 'insertToggleList' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: t( 'Toggle list' ),
				icon: toggleListIcon,
				tooltip: true
			} );

			// Bind the state of the button to the command.
			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute the command when the button is clicked (executed).
			this.listenTo( buttonView, 'execute', () => {
				editor.execute( 'insertToggleList' )
			} );

			return buttonView;
		} );
	}
}
