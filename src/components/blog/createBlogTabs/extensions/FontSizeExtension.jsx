import { Extension } from '@tiptap/core';

/**
 * FontSize Extension for Tiptap
 * 
 * This extension allows changing the font size of selected text
 * It adds a fontSize attribute to the textStyle mark type
 */
const FontSizeExtension = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
      fontSizes: [
        '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', 
        '20px', '24px', '28px', '32px', '36px', '48px', '60px', '72px'
      ],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

export default FontSizeExtension; 