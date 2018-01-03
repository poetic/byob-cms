import React, { Component } from 'react'
import { isEmpty } from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML, ContentBlock } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class WysiwygWidget extends Component {
  constructor(props) {
    super(props);

    const { value, options: { blockType } } = this.props;

    if (!isEmpty(value)) {
      this.state = {
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(value)
          )
        ),
      }
    } else {
      if (!isEmpty(blockType)) {
        this.state = {
          editorState: EditorState.createWithContent(ContentState.createFromBlockArray([new ContentBlock({
            type: blockType
          })])),
        }
      } else {
        this.state = {
          editorState: EditorState.createEmpty(),
        }
      }
    }
    
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
    
    const { onChange } = this.props;

    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  };

  render() {
    const { editorState } = this.state;
    const { options: { wysiwygConfig: { ...otherProps }}} = this.props;

    return (
      <Editor
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        {...otherProps}
      />
    )
  }
}

export default WysiwygWidget;