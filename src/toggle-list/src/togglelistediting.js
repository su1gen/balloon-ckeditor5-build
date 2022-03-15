import {Plugin} from 'ckeditor5/src/core';

import {toWidget, toWidgetEditable, Widget} from 'ckeditor5/src/widget';

import InsertToggleListCommand from './inserttogglelistcommand';

import createElement from '@ckeditor/ckeditor5-utils/src/dom/createelement';

import '../theme/toggle-list.css';

export default class ToggleListEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertToggleList', new InsertToggleListCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('toggleList', {
            isObject: true,
            allowWhere: '$block'
        });

        schema.register('toggleBtn', {
            isLimit: true,
            allowIn: 'toggleListTop',
            // allowAttributes: [ 'listStatus' ]
        });

        schema.register('toggleTriggerBlock', {
            isLimit: true,
            allowIn: 'toggleList',
            allowAttributes: [ 'listStatus' ]
        });

        schema.register('toggleListWrapper', {
            isLimit: true,
            isObject: true,
            allowIn: 'toggleList',
            allowContentOf: '$root'
        });


        schema.register('toggleListTop', {
            // isObject: true,
            isLimit: true,
            allowIn: 'toggleList',
            allowContentOf: '$block'
        });

        schema.register('toggleListTitle', {
            isLimit: true,
            allowIn: 'toggleListTop',
            allowContentOf: '$block'
        });


    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // toggleList
        conversion.for( 'upcast' ).elementToElement( {
            model: 'toggleList',
            view: {
                name: 'div',
                classes: 'toggle-list'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'toggleList',
            view: {
                name: 'div',
                classes: 'toggle-list'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'toggleList',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'div', { class: 'toggle-list' } );
                return toWidget( section, viewWriter, { label: 'Toggle list' } );
            }
        } );

        // toggleListTop
        conversion.for( 'upcast' ).elementToElement( {
            model: 'toggleListTop',
            view: {
                name: 'div',
                classes: 'toggle-list__top'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'toggleListTop',
            view: {
                name: 'div',
                classes: 'toggle-list__top'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'toggleListTop',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'div', { class: 'toggle-list__top' } );
                return section;
            }
        } );

        // toggleTriggerBlock
        conversion.for( 'upcast' ).elementToElement( {
            view: { name: 'div', classes: [ 'toggle-list__trigger-block' ] },
            model: upcastTriggerBlock,
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'toggleTriggerBlock',
            view: ( modelElement, { writer: viewWriter } ) => {
                let type = modelElement.getAttribute( 'listStatus' )
                return viewWriter.createUIElement('div', {class: `toggle-list__trigger-block toggle-list__trigger-block--${type}`});
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'toggleTriggerBlock',
            view: ( modelElement, { writer: viewWriter } ) => {
                let type = modelElement.getAttribute( 'listStatus' )
                return viewWriter.createUIElement('div', {class: `toggle-list__trigger-block toggle-list__trigger-block--${type}`});
            },
            triggerBy: {
                attributes: [ 'listStatus' ]
            }
        } );

        // toggleListTitle
        conversion.for( 'upcast' ).elementToElement( {
            model: 'toggleListTitle',
            view: {
                name: 'div',
                classes: 'toggle-list__title'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'toggleListTitle',
            view: {
                name: 'div',
                classes: 'toggle-list__title'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'toggleListTitle',
            view: ( modelElement, { writer: viewWriter } ) => {
                const title = viewWriter.createEditableElement( 'div', { class: 'toggle-list__title' } );
                return toWidgetEditable( title, viewWriter );
            }
        } );


        conversion.for( 'upcast' )
            .elementToElement( {
                model: 'toggleBtn',
                view: {
                    name: 'button',
                    classes: 'toggle-list__btn'
                }
            } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'toggleBtn',
            view: {
                name: 'button',
                classes: 'toggle-list__btn'
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'toggleBtn',
            view: ( modelElement, { writer: viewWriter } ) => {

                let editor = this.editor
				let lastTrigger = null

                return viewWriter.createUIElement('button',
                    {class: `toggle-list__btn`}, function (domDocument) {
                        const domElement = this.toDomElement(domDocument);
                        domElement.addEventListener('click', () => {
                            editor.model.change(writer => {
                                for (const ancestor of modelElement.getAncestors()) {
                                    for (const child of ancestor.getChildren()) {
                                        if (child.is('element', 'toggleTriggerBlock')) {
                                        	lastTrigger = child
                                        }
                                    }
                                }
                                if (lastTrigger){
									const currentType = lastTrigger.getAttribute('listStatus');
									const newType = currentType === 'default' ? 'hidden' : 'default';
									writer.setAttribute('listStatus', newType, lastTrigger);
								}
                            })
                        })
                        return domElement
                    })
            }
        } );

        conversion.for( 'upcast' ).elementToElement( {
            model: 'toggleListWrapper',
            view: {
                name: 'div',
                classes: 'toggle-list__wrapper'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'toggleListWrapper',
            view: {
                name: 'div',
                classes: 'toggle-list__wrapper'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'toggleListWrapper',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const element = viewWriter.createEditableElement( 'div', { class: 'toggle-list__wrapper' } );
                return toWidgetEditable( element, viewWriter );
            }
        } );

    }
}

const getTypeFromViewElement = viewElement => {
    for ( const type of [ 'default', 'hidden' ] ) {
        if ( viewElement.hasClass( `toggle-list__trigger-block--${ type }` ) ) {
            return type;
        }
    }

    return 'default';


};

/**
 * Single upcast converter to the <sideCard/> element with all its attributes.
 */
const upcastTriggerBlock = ( viewElement, { writer } ) => {

    let type = getTypeFromViewElement( viewElement )
    const triggerBlock = writer.createElement( 'toggleTriggerBlock' );
    writer.setAttribute( 'listStatus', type, triggerBlock );

    return triggerBlock;
};
