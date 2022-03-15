import DoubleColumnsEditing from './doublecolumnsediting';
import DoubleColumnsUI from './doublecolumnsui';

import { Plugin } from 'ckeditor5/src/core';

export default class DoubleColumns extends Plugin {
	static get requires() {
		return [ DoubleColumnsEditing, DoubleColumnsUI ];
	}
}
