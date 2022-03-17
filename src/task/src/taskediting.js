import {Plugin} from 'ckeditor5/src/core';
import {toWidget, Widget, toWidgetEditable,} from 'ckeditor5/src/widget';
import Inserttaskcommand from './inserttaskcommand';
import '../theme/task.css';

export default class Taskediting extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'insertTask', new Inserttaskcommand( this.editor ) );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('task', {
            isObject: true,
            // allowWhere: '$root'
			allowIn: '$root',
        });

		schema.register('taskIdBlock', {
			isLimit: true,
			allowIn: 'task',
			allowContentOf: '$block'
		});

        schema.register('taskTriggerBlock', {
            isLimit: true,
            allowIn: 'task',
            allowAttributes: [ 'taskStatus', 'completed' ]
        });

        schema.register('taskTop', {
            isLimit: true,
            allowIn: 'task',
            allowContentOf: '$block'
        });

        schema.register('taskBtn', {
            isLimit: true,
            allowIn: 'taskTop',
        });

        schema.register('taskName', {
            isLimit: true,
            allowIn: 'taskTop',
            allowContentOf: '$block'
        });

        schema.register('taskUser', {
            isLimit: true,
            allowIn: 'taskTop',
            allowContentOf: '$block'
        });

        schema.register('taskDate', {
			isLimit: true,
			isObject: true,
			allowIn: 'taskTop',
			allowAttributes: [ 'date' ]
        });

        schema.register('taskCheckbox', {
			isLimit: true,
			isObject: true,
			allowIn: 'taskTop'
        });

        schema.register('taskDescription', {
            isLimit: true,
            isObject: true,
            allowIn: 'task',
            // allowContentOf: '$root',
			allowChildren: ['paragraph', 'task']
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // task
        conversion.for( 'upcast' ).elementToElement( {
            model: 'task',
            view: {
                name: 'div',
                classes: 'task'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'task',
            view: {
                name: 'div',
                classes: 'task'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'task',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'div', { class: 'task' } );
                return toWidget( section, viewWriter, { label: 'Task' } );
            }
        } );

        // taskIdBlock
		conversion.for( 'upcast' ).elementToElement( {
			model: 'taskIdBlock',
			view: {
				name: 'div',
				classes: 'task__id-block'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'taskIdBlock',
			view: {
				name: 'div',
				classes: 'task__id-block'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'taskIdBlock',
			view: ( modelElement, { writer: viewWriter } ) => {
				const taskName = viewWriter.createEditableElement( 'div', { class: 'task__id-block' } );
				return toWidgetEditable( taskName, viewWriter );
			}
		} );


        // taskTriggerBlock
        conversion.for( 'upcast' ).elementToElement( {
            view: { name: 'div', classes: [ 'task__trigger-block' ] },
            model: upcastTriggerBlock,
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'taskTriggerBlock',
            view: ( modelElement, { writer: viewWriter } ) => {
                let type = modelElement.getAttribute( 'taskStatus' )
                let isCompleted = modelElement.getAttribute( 'completed' )
                return viewWriter.createUIElement('div', {class: `task__trigger-block task__trigger-block--${type} task__completed-${isCompleted}`});
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'taskTriggerBlock',
            view: ( modelElement, { writer: viewWriter } ) => {
                let type = modelElement.getAttribute( 'taskStatus' )
				let isCompleted = modelElement.getAttribute( 'completed' )
				return viewWriter.createUIElement('div', {class: `task__trigger-block task__trigger-block--${type} task__completed-${isCompleted}`});
            },
            triggerBy: {
                attributes: [ 'taskStatus', 'completed' ]
            }
        } );

        // taskTop
        conversion.for( 'upcast' ).elementToElement( {
            model: 'taskTop',
            view: {
                name: 'div',
                classes: 'task__top'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'taskTop',
            view: {
                name: 'div',
                classes: 'task__top'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'taskTop',
            view: ( modelElement, { writer: viewWriter } ) => {
                return viewWriter.createContainerElement('div', {class: 'task__top'});
            }
        } );

        // taskBtn
        conversion.for( 'upcast' )
            .elementToElement( {
                model: 'taskBtn',
                view: {
                    name: 'button',
                    classes: 'task__btn'
                }
            } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'taskBtn',
            view: {
                name: 'button',
                classes: 'task__btn'
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'taskBtn',
            view: ( modelElement, { writer: viewWriter } ) => {

                let editor = this.editor
                let lastTrigger = null

                return viewWriter.createUIElement('button',
                    {class: `task__btn`}, function (domDocument) {
                        const domElement = this.toDomElement(domDocument);
                        domElement.addEventListener('click', () => {
                            editor.model.change(writer => {
                                for (const ancestor of modelElement.getAncestors()) {
                                    for (const child of ancestor.getChildren()) {
                                        if (child.is('element', 'taskTriggerBlock')) {
                                            lastTrigger = child
                                        }
                                    }
                                }
                                if (lastTrigger){
                                    const currentType = lastTrigger.getAttribute('taskStatus');
                                    const newType = currentType === 'default' ? 'hidden' : 'default';
                                    writer.setAttribute('taskStatus', newType, lastTrigger);
                                }
                            })
                        })
                        return domElement
                    })
            }
        } );

        // taskDescription
        conversion.for( 'upcast' ).elementToElement( {
            model: 'taskDescription',
            view: {
                name: 'div',
                classes: 'task__description'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'taskDescription',
            view: {
                name: 'div',
                classes: 'task__description'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'taskDescription',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const element = viewWriter.createEditableElement( 'div', { class: 'task__description' } );
                return toWidgetEditable( element, viewWriter );
            }
        } );


        // taskName
        conversion.for( 'upcast' ).elementToElement( {
            model: 'taskName',
            view: {
                name: 'div',
                classes: 'task__name'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'taskName',
            view: {
                name: 'div',
                classes: 'task__name'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'taskName',
            view: ( modelElement, { writer: viewWriter } ) => {
                const taskName = viewWriter.createEditableElement( 'div', { class: 'task__name' } );
                return toWidgetEditable( taskName, viewWriter );
            }
        } );

        // taskUser
        conversion.for( 'upcast' ).elementToElement( {
            model: 'taskUser',
            view: {
                name: 'div',
                classes: 'task__user'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'taskUser',
            view: {
                name: 'div',
                classes: 'task__user'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'taskUser',
            view: ( modelElement, { writer: viewWriter } ) => {
                const taskUser = viewWriter.createEditableElement( 'div', { class: 'task__user' } );
                return toWidgetEditable( taskUser, viewWriter );
            }
        } );

        // taskDate
		conversion.for( 'upcast' ).elementToElement( {
			view: { name: 'div', classes: [ 'task__date' ] },
			model: upcastDateBlock,
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'taskDate',
			view: ( modelElement, { writer: viewWriter } ) => {
				return createDateElement( viewWriter, modelElement )
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'taskDate',
			view: ( modelElement, { writer: viewWriter } ) => {
				// Create the widget view element.
				const div = createDateElement( viewWriter, modelElement );

				// Create a wrapper for custom UI (must use UIElement!).
				const renderFunction = createCustomUIRenderer( this.editor, modelElement );
				const customUIWrapper = viewWriter.createUIElement( 'div', {}, renderFunction );

				// And insert it inside the widget element.
				viewWriter.insert( viewWriter.createPositionAt( div, 0 ), customUIWrapper );

				return div;
			},
			triggerBy: {
				attributes: [ 'date' ]
			}
		} );

		// taskCheckbox
		conversion.for( 'upcast' ).elementToElement( {
			model: 'taskCheckbox',
			view: {
				name: 'div',
				classes: 'task__checkbox'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'taskCheckbox',
			view: {
				name: 'div',
				classes: 'task__checkbox'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'taskCheckbox',
			view: ( modelElement, { writer: viewWriter } ) => {

				let editor = this.editor
				let lastTrigger = null

				return viewWriter.createUIElement('div',
					{class: `task__checkbox`}, function (domDocument) {
						const domElement = this.toDomElement(domDocument);
						domElement.addEventListener('click', () => {
							editor.model.change(writer => {
								for (const ancestor of modelElement.getAncestors()) {
									for (const child of ancestor.getChildren()) {
										if (child.is('element', 'taskTriggerBlock')) {
											lastTrigger = child
										}
									}
								}
								if (lastTrigger){
									const isCompleted = lastTrigger.getAttribute('completed');
									writer.setAttribute('completed', isCompleted === 'false' ? 'true' : 'false', lastTrigger);
								}
							})
						})
						return domElement
					})


				// return viewWriter.createContainerElement( 'div', { class: 'task__checkbox' } );
			}
		} );
    }
}

const upcastDateBlock = ( viewElement, { writer: viewWriter} ) => {
	let date = viewElement.getAttribute('data-date')
	const dateBlock = viewWriter.createElement( 'taskDate', { date: date } );
	return dateBlock;
};

const upcastTriggerBlock = ( viewElement, { writer } ) => {
	let type = getTypeFromViewElement( viewElement )
	let isCompleted = getIsCompletedFromViewElement( viewElement )
	const triggerBlock = writer.createElement( 'taskTriggerBlock' );
	writer.setAttribute( 'taskStatus', type, triggerBlock );
	writer.setAttribute( 'completed', isCompleted, triggerBlock );
	return triggerBlock;
};

const getCurrentDate = (date = null, isForDisplay = false) => {
	let today = null

	if (date){
		today = new Date(date);
	} else {
		today = new Date();
	}

	let year = today.getFullYear()
	let mouth = today.getMonth() + 1
	if (mouth < 10){
		mouth = '0' + mouth
	}
	let day = today.getDate()
	if (day < 10){
		day = '0' + day
	}

	if (isForDisplay){
		return `${day}.${mouth}.${year}`;
	}

	return `${year}-${mouth}-${day}`;
}

const createDateElement = ( viewWriter, modelElement ) => {
	let date = modelElement.getAttribute( 'date' )
	if (!date){
		date = getCurrentDate()
	}
	let dateWrapper = viewWriter.createContainerElement( 'div', {
		class: 'task__date',
		'data-date': date
	} );

	let spanForDate = viewWriter.createContainerElement('span')
	const text = viewWriter.createText( getCurrentDate(date, true) );

	viewWriter.insert( viewWriter.createPositionAt( spanForDate, 0 ), text);
	viewWriter.insert( viewWriter.createPositionAt( dateWrapper, 0 ), spanForDate );

	return dateWrapper
}

function createCustomUIRenderer( editor, modelElement ) {
	return function ( domDocument ) {
		// const domUiWrap = this.toDomElement( domDocument );

		// ================================
		// Add a custom input to the widget.
		// Initialize jQuery date picker on it.
		// Note: there's a bug that changing the date via the jQ panel will not change it
		// in the input – that's most likely jQ date picker's bug. It works when changing by typing
		// in this widget.
		const domInput = domDocument.createElement( 'input' );

		let date = modelElement.getAttribute( 'date' )
		if (!date){
			date = getCurrentDate()
		}

		domInput.setAttribute( 'value', date );
		domInput.setAttribute( 'type',  'date' );

		domInput.addEventListener( 'change', e => {
			editor.model.change( writer => {
				const newValue = domInput.value;
				writer.setAttribute( 'date', newValue, modelElement );
			} );
		} );
		// domUiWrap.appendChild( domInput );

		// =======================================
		// Below code is used to prevent CKEditor from handling events on elements inside a widget.
		preventCKEditorHandling( domInput, editor );

		return domInput;
	};
}

const preventCKEditorHandling = ( domElement, editor ) => {
	// Prevent the editor from listening on below events in order to stop rendering selection.
	domElement.addEventListener( 'click', stopEventPropagationAndHackRendererFocus, { capture: true } );
	domElement.addEventListener( 'mousedown', stopEventPropagationAndHackRendererFocus, { capture: true } );
	domElement.addEventListener( 'focus', stopEventPropagationAndHackRendererFocus, { capture: true } );

	// Prevents TAB handling or other editor keys listeners which might be executed on editors selection.
	domElement.addEventListener( 'keydown', stopEventPropagationAndHackRendererFocus, { capture: true } );

	function stopEventPropagationAndHackRendererFocus( evt ) {
		evt.stopPropagation();
		// This prevents rendering changed view selection thus preventing to changing DOM selection while inside a widget.
		editor.editing.view._renderer.isFocused = false;
	}
}

const getTypeFromViewElement = viewElement => {
    for ( const type of [ 'default', 'hidden' ] ) {
        if ( viewElement.hasClass( `task__trigger-block--${ type }` ) ) {
            return type;
        }
    }
    return 'default';
};

const getIsCompletedFromViewElement = viewElement => {
    for ( const type of [ 'false', 'true' ] ) {
        if ( viewElement.hasClass( `task__completed-${ type }` ) ) {
            return type;
        }
    }
    return 'false';
};
