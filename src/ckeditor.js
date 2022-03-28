import BalloonEditorBase from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize";
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';

import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import ToggleList from './toggle-list/src/togglelist'
import DoubleColumns from './double-columns/src/doublecolumns';
import Task from './task/src/task';

import '../theme/theme.css';



function MentionCustomization( editor ) {
	// The upcast converter will convert <a class="mention" href="" data-user-id="">
	// elements to the model 'mention' attribute.
	editor.conversion.for( 'upcast' ).elementToAttribute( {
		view: {
			name: 'a',
			key: 'data-mention',
			classes: 'mention',
			attributes: {
				href: true,
				'data-user-id': true
			}
		},
		model: {
			key: 'mention',
			value: viewItem => {
				// The mention feature expects that the mention attribute value
				// in the model is a plain object with a set of additional attributes.
				// In order to create a proper object, use the toMentionAttribute helper method:
				const mentionAttribute = editor.plugins.get( 'Mention' ).toMentionAttribute( viewItem, {
					// Add any other properties that you need.
					link: viewItem.getAttribute( 'href' ),
					userId: viewItem.getAttribute( 'data-user-id' )
				} );

				return mentionAttribute;
			}
		},
		converterPriority: 'high'
	} );

	// Downcast the model 'mention' text attribute to a view <a> element.
	editor.conversion.for( 'downcast' ).attributeToElement( {
		model: 'mention',
		view: ( modelAttributeValue, { writer } ) => {
			// Do not convert empty attributes (lack of value means no mention).
			if ( !modelAttributeValue ) {
				return;
			}

			return writer.createAttributeElement( 'a', {
				class: 'mention',
				'data-mention': modelAttributeValue.id,
				'data-user-id': modelAttributeValue.userId,
				'href': modelAttributeValue.link
			}, {
				// Make mention attribute to be wrapped by other attribute elements.
				priority: 20,
				// Prevent merging mentions together.
				id: modelAttributeValue.uid
			} );
		},
		converterPriority: 'high'
	} );
}

class DefaultBalloonEditor extends BalloonEditorBase {}

DefaultBalloonEditor.builtinPlugins = [
	Task,
	ToggleList,
	DoubleColumns,
	Essentials,
	Autoformat,
	BlockToolbar,
	Bold,
	Italic,
	Underline,
	Strikethrough,
	BlockQuote,
	CloudServices,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	ImageResize,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TableProperties,
	TableCellProperties,
	TextTransformation,
	Alignment,
	TodoList,
	HorizontalLine,
	SimpleUploadAdapter,
	Comments,
	FontSize,
	FontColor,
	FontBackgroundColor,
	Mention,
	MentionCustomization
];

DefaultBalloonEditor.defaultConfig = {
	blockToolbar: [
		'heading',
		'|',
		'task',
		'|',
		'doubleColumns',
		'|',
		'bulletedList',
		'numberedList',
		'todoList',
		'toggleList',
		'|',
		'outdent',
		'indent',
		'|',
	  	'alignment',
	  	'horizontalLine',
		'uploadImage',
		'blockQuote',
		'insertTable',
		'mediaEmbed',
		'|',
		'undo',
		'redo'
	],
	toolbar: {
		items: [
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'link',
			'|',
			'fontSize',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'comment'
		]
	},
	fontSize: {
		options: [
			'tiny',
			'small',
			'default',
			'big',
			'huge'
		]
	},
	fontColor: {
		colors: [
			{
				color: 'hsl(0, 0%, 0%)',
				label: 'Black'
			},
			{
				color: 'hsl(0, 0%, 30%)',
				label: 'Dim grey'
			},
			{
				color: 'hsl(0, 0%, 60%)',
				label: 'Grey'
			},
			{
				color: 'hsl(0, 0%, 90%)',
				label: 'Light grey'
			},
			{
				color: 'hsl(0, 0%, 100%)',
				label: 'White',
				hasBorder: true
			},
			{
				color: 'hsla(0, 100%, 50%)',
				label: 'Red'
			},
			{
				color: 'hsla(0, 100%, 25%)',
				label: 'Maroon'
			},
			{
				color: 'hsla(16, 100%, 66%)',
				label: 'Coral'
			},
			{
				color: 'hsla(60, 100%, 50%)',
				label: 'Yellow'
			},
			{
				color: 'hsl(43, 89%, 38%)',
				label: 'Dark golden rod'
			},
			{
				color: 'hsla(60, 100%, 25%)',
				label: 'Olive'
			},
			{
				color: 'hsla(120, 100%, 50%)',
				label: 'Lime'
			},
			{
				color: 'hsl(120, 61%, 50%)',
				label: 'Limegreen'
			},
			{
				color: 'hsla(120, 100%, 25%)',
				label: 'Green'
			},
			{
				color: 'hsl(120, 73%, 75%)',
				label: 'Lightgreen'
			},
			{
				color: 'hsla(160, 100%, 75%)',
				label: 'Aquamarine'
			},
			{
				color: 'hsla(180, 100%, 50%)',
				label: 'Aqua'
			},
			{
				color: 'hsl(210, 100%, 56%)',
				label: 'Dodger blue'
			},
			{
				color: 'hsla(180, 100%, 25%)',
				label: 'Teal'
			},
			{
				color: 'hsla(182, 25%, 50%)',
				label: 'Cadet blue'
			},
			{
				color: 'hsl(219, 79%, 66%)',
				label: 'Corn flower blue'
			},
			{
				color: 'hsla(240, 100%, 50%)',
				label: 'Blue'
			},
			{
				color: 'hsla(240, 100%, 25%)',
				label: 'Navy'
			},
			{
				color: 'hsla(300, 100%, 50%)',
				label: 'Fuchsia'
			},
			{
				color: 'hsla(300, 100%, 25%)',
				label: 'Purple'
			},
			{
				color: 'hsl(260, 60%, 65%)',
				label: 'Medium purple'
			},
			{
				color: 'hsl(330, 100%, 71%)',
				label: 'Hotpink'
			},
			{
				color: 'hsl(351, 100%, 86%)',
				label: 'Lightpink'
			},
			{
				color: 'hsl(0, 53%, 58%)',
				label: 'Indian red'
			},
			{
				color: 'hsl(348, 83%, 58%)',
				label: 'Crimson'
			},
		]
	},
	fontBackgroundColor: {
		colors: [
			{
				color: 'hsl(0, 0%, 0%)',
				label: 'Black'
			},
			{
				color: 'hsl(0, 0%, 30%)',
				label: 'Dim grey'
			},
			{
				color: 'hsl(0, 0%, 60%)',
				label: 'Grey'
			},
			{
				color: 'hsl(0, 0%, 90%)',
				label: 'Light grey'
			},
			{
				color: 'hsl(0, 0%, 100%)',
				label: 'White',
				hasBorder: true
			},
			{
				color: 'hsla(0, 100%, 50%)',
				label: 'Red'
			},
			{
				color: 'hsla(0, 100%, 25%)',
				label: 'Maroon'
			},
			{
				color: 'hsla(16, 100%, 66%)',
				label: 'Coral'
			},
			{
				color: 'hsla(60, 100%, 50%)',
				label: 'Yellow'
			},
			{
				color: 'hsl(43, 89%, 38%)',
				label: 'Dark golden rod'
			},
			{
				color: 'hsla(60, 100%, 25%)',
				label: 'Olive'
			},
			{
				color: 'hsla(120, 100%, 50%)',
				label: 'Lime'
			},
			{
				color: 'hsl(120, 61%, 50%)',
				label: 'Limegreen'
			},
			{
				color: 'hsla(120, 100%, 25%)',
				label: 'Green'
			},
			{
				color: 'hsl(120, 73%, 75%)',
				label: 'Lightgreen'
			},
			{
				color: 'hsla(160, 100%, 75%)',
				label: 'Aquamarine'
			},
			{
				color: 'hsla(180, 100%, 50%)',
				label: 'Aqua'
			},
			{
				color: 'hsl(210, 100%, 56%)',
				label: 'Dodger blue'
			},
			{
				color: 'hsla(180, 100%, 25%)',
				label: 'Teal'
			},
			{
				color: 'hsla(182, 25%, 50%)',
				label: 'Cadet blue'
			},
			{
				color: 'hsl(219, 79%, 66%)',
				label: 'Corn flower blue'
			},
			{
				color: 'hsla(240, 100%, 50%)',
				label: 'Blue'
			},
			{
				color: 'hsla(240, 100%, 25%)',
				label: 'Navy'
			},
			{
				color: 'hsla(300, 100%, 50%)',
				label: 'Fuchsia'
			},
			{
				color: 'hsla(300, 100%, 25%)',
				label: 'Purple'
			},
			{
				color: 'hsl(260, 60%, 65%)',
				label: 'Medium purple'
			},
			{
				color: 'hsl(330, 100%, 71%)',
				label: 'Hotpink'
			},
			{
				color: 'hsl(351, 100%, 86%)',
				label: 'Lightpink'
			},
			{
				color: 'hsl(0, 53%, 58%)',
				label: 'Indian red'
			},
			{
				color: 'hsl(348, 83%, 58%)',
				label: 'Crimson'
			},
		]
	},
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:alignLeft',
			'imageStyle:alignRight',
			'|',
			'toggleImageCaption',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells',
			'tableProperties',
			'tableCellProperties'
		]
	},
	mediaEmbed: {
		previewsInData: true
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};


export default { DefaultBalloonEditor };





