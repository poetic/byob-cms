import React, { Component } from 'react'
import { isEmpty } from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, ContentBlock } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class WysiwygWidget extends Component {
  constructor(props) {
    super(props);

    const { value, options: { blockType } } = this.props;

    if (!isEmpty(value)) {
      const blocksFromHtml = htmlToDraft(value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

      this.state = {
        editorState: EditorState.createWithContent(contentState),
      }
    } else if (!isEmpty(blockType)) {
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

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
    
    const { onChange } = this.props;

    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  };

  render() {
    const { editorState } = this.state;
    const { options: { wysiwygConfig }} = this.props;

    return (
      <Editor
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        {...wysiwygConfig}
      />
    )
  }
}

export default WysiwygWidget;
