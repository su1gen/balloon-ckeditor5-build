import ToggleListEditing from './togglelistediting';
import ToggleListUI from './togglelistui';

import { Plugin } from 'ckeditor5/src/core';

export default class ToggleList extends Plugin {
	static get requires() {
		return [ ToggleListEditing, ToggleListUI ];
	}
}

// import { ButtonView } from 'ckeditor5/src/ui';

// import ckeditor5Icon from '../theme/icons/toggle-icon.svg';

// export default class ToggleList extends Plugin {
//   static get pluginName() {
// 	return 'Togglelist';
//   }

// init() {
// const editor = this.editor;
// const t = editor.t;
// const model = editor.model;
//
// // Add the "myPlugin" button to feature components.
// editor.ui.componentFactory.add( 'toggleList', locale => {
// 	const view = new ButtonView( locale );
//
// 	view.set( {
// 		label: t( 'Toggle list' ),
// 		icon: ckeditor5Icon,
// 		tooltip: true
// 	} );
//
// 	// Insert a text into the editor after clicking the button.
// 	this.listenTo( view, 'execute', () => {
// 		model.change( writer => {
// 			const textNode = writer.createText( 'Hello CKEditor 5!' );
//
// 			model.insertContent( textNode );
// 		} );
//
// 		editor.editing.view.focus();
// 	} );
//
// 	return view;
// } );
// }
// }
