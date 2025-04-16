import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const resizableImagePlugin = new PluginKey('resizableImage');

export const ResizableImage = Node.create({
  name: 'resizableImage',
  
  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
      allowBase64: true,
    };
  },
  
  group: 'block',
  
  draggable: true,
  
  isolating: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (node) => ({
          src: node.getAttribute('src'),
          alt: node.getAttribute('alt'),
          title: node.getAttribute('title'),
          width: node.getAttribute('width') || node.style.width,
          height: node.getAttribute('height') || node.style.height,
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    // Use div wrapper instead of raw img for resizable functionality
    return ['div', { class: 'resizable-image-wrapper' }, 
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    ];
  },

  addCommands() {
    return {
      setResizableImage: (attrs) => ({ tr, dispatch }) => {
        const { selection } = tr;
        const node = this.type.create(attrs);

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node);
        }

        return true;
      },
    };
  },
  
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('div');
      dom.classList.add('resizable-image-wrapper');
      
      const img = document.createElement('img');
      img.src = node.attrs.src;
      if (node.attrs.alt) img.alt = node.attrs.alt;
      if (node.attrs.title) img.title = node.attrs.title;
      if (node.attrs.width) img.style.width = node.attrs.width;
      if (node.attrs.height) img.style.height = node.attrs.height;
      
      dom.appendChild(img);
      
      // Create resize handles
      const handles = ['nw', 'ne', 'sw', 'se'];
      handles.forEach(dir => {
        const handle = document.createElement('div');
        handle.classList.add('resize-handle', `resize-handle-${dir}`);
        dom.appendChild(handle);
      });
      
      // Handle drag to resize
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
      let currentHandle = null;
      
      const onMouseDown = (e, handle) => {
        e.preventDefault();
        e.stopPropagation();
        
        startX = e.pageX;
        startY = e.pageY;
        startWidth = img.offsetWidth;
        startHeight = img.offsetHeight;
        currentHandle = handle;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
      
      const onMouseMove = (e) => {
        e.preventDefault();
        
        const dx = e.pageX - startX;
        const dy = e.pageY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        
        // Resize based on which handle is being dragged
        switch (currentHandle) {
          case 'nw':
            newWidth = startWidth - dx;
            newHeight = startHeight - dy;
            break;
          case 'ne':
            newWidth = startWidth + dx;
            newHeight = startHeight - dy;
            break;
          case 'sw':
            newWidth = startWidth - dx;
            newHeight = startHeight + dy;
            break;
          case 'se':
            newWidth = startWidth + dx;
            newHeight = startHeight + dy;
            break;
          default:
            return;
        }
        
        // Maintain aspect ratio if not pressing shift
        if (!e.shiftKey) {
          const ratio = startWidth / startHeight;
          newHeight = Math.round(newWidth / ratio);
        }
        
        // Apply new dimensions
        if (newWidth > 50 && newHeight > 30) {
          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
        }
      };
      
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // Update the node attributes when resize is complete
        if (getPos && editor.isEditable) {
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(getPos(), undefined, {
              ...node.attrs,
              width: `${img.offsetWidth}px`,
              height: `${img.offsetHeight}px`,
            })
          );
        }
      };
      
      // Attach event listeners to resize handles
      dom.querySelectorAll('.resize-handle').forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
          const direction = handle.className.match(/resize-handle-([^\s]+)/)[1];
          onMouseDown(e, direction);
        });
      });
      
      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.attrs.src !== node.attrs.src) {
            img.src = updatedNode.attrs.src;
          }
          if (updatedNode.attrs.alt !== node.attrs.alt) {
            img.alt = updatedNode.attrs.alt || '';
          }
          if (updatedNode.attrs.title !== node.attrs.title) {
            img.title = updatedNode.attrs.title || '';
          }
          if (updatedNode.attrs.width !== node.attrs.width) {
            img.style.width = updatedNode.attrs.width;
          }
          if (updatedNode.attrs.height !== node.attrs.height) {
            img.style.height = updatedNode.attrs.height;
          }
          return true;
        },
        destroy: () => {
          // Clean up event listeners
          dom.querySelectorAll('.resize-handle').forEach(handle => {
            handle.removeEventListener('mousedown', onMouseDown);
          });
        },
        stopEvent: () => {
          return false; // Allow events to be handled by ProseMirror
        },
      };
    };
  },
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: resizableImagePlugin,
        props: {
          handleDOMEvents: {
            // Prevent dragging the image from interfering with resize handles
            mousedown: (view, event) => {
              const target = event.target;
              if (target.classList.contains('resize-handle')) {
                event.preventDefault();
                return true;
              }
              return false;
            },
          },
          decorations: state => {
            const { doc } = state;
            const decorations = [];
            
            doc.descendants((node, pos) => {
              if (node.type.name === 'resizableImage') {
                // Add custom decorations if needed
              }
            });
            
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default ResizableImage; 