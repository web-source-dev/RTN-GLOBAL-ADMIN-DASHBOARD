import { Extension } from '@tiptap/core';

/**
 * FontFamily Extension for Tiptap
 * 
 * This extension allows changing the font family of selected text
 * It adds a fontFamily attribute to the textStyle mark type
 */
const FontFamilyExtension = Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
      fontFamilies: [
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Helvetica', value: 'Helvetica, sans-serif' },
        { name: 'Times New Roman', value: 'Times New Roman, serif' },
        { name: 'Courier New', value: 'Courier New, monospace' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Verdana', value: 'Verdana, sans-serif' },
        { name: 'Tahoma', value: 'Tahoma, sans-serif' },
        { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
        { name: 'Impact', value: 'Impact, sans-serif' },
        { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
      ],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily,
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {}
              }

              return {
                style: `font-family: ${attributes.fontFamily}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontFamily: fontFamily => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily })
          .run()
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

export default FontFamilyExtension; 