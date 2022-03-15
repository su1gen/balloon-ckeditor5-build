import Taskediting from './taskediting';
import TaskUI from './taskui';

import { Plugin } from 'ckeditor5/src/core';

export default class Task extends Plugin {
	static get requires() {
		return [ Taskediting, TaskUI ];
	}
}
