import {Plugin} from 'ckeditor5/src/core';
import {Widget, toWidget, toWidgetEditable} from 'ckeditor5/src/widget';
import InsertDoubleColumnsCommand from './insertdoublecolumnscommand';

import '../theme/double-columns.css';

export default class DoubleColumnsEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertDoubleColumns', new InsertDoubleColumnsCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('doubleColumns', {
            isObject: true,
            allowWhere: '$block'
        });

        schema.register('doubleColumnsBlock', {
			isLimit: true,
			isObject: true,
			allowIn: 'doubleColumns',
			allowContentOf: '$root'
        });

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( context.endsWith( 'doubleColumnsBlock' ) && childDefinition.name == 'doubleColumns' ) {
				return false;
			}
		} );

    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for( 'upcast' )
            .elementToElement( {
                view: { name: 'div', classes: [ 'ckeditor-double-columns' ] },
                model: upcastDoubleColumns,
            } )
            .elementToElement( {
                view: { name: 'div', classes: [ 'ckeditor-double-columns__block' ] },
                model: 'doubleColumnsBlock'
            } )

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'doubleColumns',
            view: downcastDoubleColumns( this.editor, { asWidget: true } ),
        } );
        // The data downcast is always executed from the current model stat, so `triggerBy` will take no effect.
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'doubleColumns',
            view: downcastDoubleColumns( this.editor, { asWidget: false } )
        } );


        // conversion.elementToElement( {
        //     model: 'toggleListContent',
        //     view: {
        //         name: 'div',
        //         classes: 'toggle-list__content'
        //     }
        // } );
		//
        // conversion.elementToElement( {
        //     model: 'toggleListWrapper',
        //     view: {
        //         name: 'div',
        //         classes: 'toggle-list__wrapper'
        //     }
        // } );
    }
}


/**
 * Single upcast converter to the <sideCard/> element with all its attributes.
 */
const upcastDoubleColumns = ( viewElement, { writer } ) => {
	return writer.createElement( 'doubleColumns' );
};



/**
 * Helper function that creates the card editing UI inside the card.
 */
// const createActionsView = ( editor, modelElement ) => function( domElement ) {
//
//     const currentType = modelElement.getAttribute( 'listStatus' );
//     const newType = currentType === 'default' ? 'hidden' : 'default';
//
//     addActionButton( '', writer => {
//         writer.setAttribute( 'listStatus', newType, modelElement );
//     }, domElement, editor );
//
// };

/**
 * The downcast converter for the <sideCard/> element.
 *
 * It returns the full view structure based on the current state of the model element.
 */
const downcastDoubleColumns = ( editor, { asWidget } ) => {
    return ( modelElement, { writer, consumable, mapper } ) => {

        // The main view element for the side card.
        const doubleColumnsView = writer.createContainerElement( 'div', {
            class: `ckeditor-double-columns`,
        } );

		toWidget( doubleColumnsView, writer, { widgetLabel: 'Double columns' } );

        // Create inner views from the side card children.
        for ( const child of modelElement.getChildren() ) {

            let childView = null


            // Child is either a "title" or "section".
            if ( child.is( 'element', 'doubleColumnsBlock' ) ) {

                childView = writer.createEditableElement( 'div' );
                writer.addClass( 'ckeditor-double-columns__block', childView );

            }

            // It is important to consume and bind converted elements.
            consumable.consume( child, 'insert' );
            mapper.bindElements( child, childView );

            // Make it an editable part of the widget.
            if ( asWidget ) {
                toWidgetEditable( childView, writer );
            }

            writer.insert( writer.createPositionAt( doubleColumnsView, 'end' ), childView );
        }


        // Inner element used to render a simple UI that allows to change the side card's attributes.
        // It will only be needed in the editing view inside the widgetized element.
        // The data output should not contain this section.


        return doubleColumnsView;
    };
};
